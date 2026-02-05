#!/usr/bin/env node

/**
 * MemoryAI - Cleanup Script
 * 
 * Processes raw session logs with AI to create clean, readable conversations.
 * 
 * Usage: node cleanup-session.js
 * 
 * Requires: REPLICATE_API_KEY in .env
 */

import { readFileSync, writeFileSync } from 'fs';

const REPLICATE_API_KEY = process.env.REPLICATE_API_KEY || readFileSync('.env', 'utf8').match(/REPLICATE_API_KEY=(.+)/)?.[1];
const REPLICATE_MODEL = 'deepseek-ai/deepseek-v3';

// Clean ANSI codes
function cleanOutput(text) {
  return text
    .replace(/\u001b\[[0-9;?]*[a-zA-Z]/g, '')
    .replace(/\u001b\].*?\u0007/g, '')
    .replace(/\u001b[^\[]*\[/g, '')
    .replace(/\[<u/g, '')
    .replace(/<u/g, '')
    .replace(/\[\?[0-9]+[hl]/g, '')
    .replace(/[^\x20-\x7E\n\r\t]/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^\s+|\s+$/gm, '')
    .trim();
}

async function cleanupSession() {
  console.log('🧹 Cleaning up session with AI...\n');
  
  const rawSession = readFileSync('.empusa-session.log', 'utf8');
  const cleanText = cleanOutput(rawSession);
  
  console.log(`📊 Raw: ${rawSession.length} bytes`);
  console.log(`📊 Clean: ${cleanText.length} bytes\n`);
  
  const prompt = `You are a conversation formatter. Extract and format this CLI session into a clean, readable conversation.

RAW SESSION LOG:
${cleanText.slice(-4000)}

INSTRUCTIONS:
- Extract the actual conversation between user and Claude
- Format each exchange as:
  User: [what the user typed/asked]
  Claude: [Claude's response]
- Remove ALL UI elements: boxes, spinners, status messages, "thinking" indicators, prompts (>), escape codes
- If you see text that looks like a user question/command, label it "User:"
- If you see Claude's response text, label it "Claude:"
- Keep it concise and readable
- Output ONLY the formatted conversation, nothing else`;

  console.log('🤖 Sending to DeepSeek v3...');
  
  const response = await fetch(`https://api.replicate.com/v1/models/${REPLICATE_MODEL}/predictions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${REPLICATE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      input: {
        prompt,
        max_tokens: 2048,
        temperature: 0.3,
        top_p: 0.9
      }
    })
  });

  const prediction = await response.json();
  console.log('⏳ Waiting for AI...\n');
  
  // Poll for result
  let result;
  for (let i = 0; i < 60; i++) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const statusRes = await fetch(prediction.urls.get, {
      headers: { 'Authorization': `Bearer ${REPLICATE_API_KEY}` }
    });
    
    const status = await statusRes.json();
    
    if (status.status === 'succeeded') {
      result = Array.isArray(status.output) ? status.output.join('') : status.output;
      break;
    }
    
    if (status.status === 'failed') {
      throw new Error('AI analysis failed');
    }
    
    process.stdout.write('.');
  }
  
  if (!result) {
    throw new Error('Timeout');
  }
  
  console.log('\n\n✅ AI Cleanup Complete!\n');
  console.log('─'.repeat(60));
  console.log(result);
  console.log('─'.repeat(60));
  
  // Save to MEMORY.md
  const summary = `# Empusa Session Log

**Last Updated:** ${new Date().toISOString()}
**AI Cleaned:** ✅ DeepSeek v3

## Conversation

${result}

## Status
- ✅ AI cleanup complete
- ✅ Full raw session in .empusa-session.log

---
*Cleaned by DeepSeek v3*
`;
  
  writeFileSync('MEMORY.md', summary);
  console.log('\n💾 Saved to MEMORY.md');
}

cleanupSession().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
