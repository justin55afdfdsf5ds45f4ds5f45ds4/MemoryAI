#!/usr/bin/env node

/**
 * MemoryAI - Never lose a Claude Code conversation again
 * 
 * Transparent wrapper that captures all interactions with Claude Code
 * and saves them to searchable memory.
 * 
 * Usage: memoryai [claude-args]
 * 
 * Repository: https://github.com/justin55afdfdsf5ds45f4ds5f45ds4/MemoryAI
 */

import pty from 'node-pty';
import { existsSync, readFileSync, appendFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Load .env
const envPath = join(process.cwd(), '.env');
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

// Verify token
if (!process.env.CLAUDE_CODE_OAUTH_TOKEN) {
  console.error('ERROR: CLAUDE_CODE_OAUTH_TOKEN not found in .env');
  process.exit(1);
}

const DEBUG_LOG = '.empusa-debug.log';
const SESSION_LOG = '.empusa-session.log';
const MEMORY_FILE = 'MEMORY.md';
const AUTOSAVE_INTERVAL = 1000; // 1 second

let sessionBuffer = '';
let lastSaveTime = Date.now();

function log(msg) {
  try {
    appendFileSync(DEBUG_LOG, `[${new Date().toISOString()}] ${msg}\n`);
  } catch (e) {}
}

// Aggressive ANSI cleaning
function cleanOutput(text) {
  return text
    .replace(/\u001b\[[0-9;?]*[a-zA-Z]/g, '')  // ANSI colors/cursor
    .replace(/\u001b\].*?\u0007/g, '')         // OSC sequences
    .replace(/\u001b[^\[]*\[/g, '')            // Broken escape sequences
    .replace(/\[<u/g, '')                      // Specific garbage
    .replace(/<u/g, '')                        // More garbage
    .replace(/\[\?[0-9]+[hl]/g, '')            // Mode switches
    .replace(/[^\x20-\x7E\n\r\t]/g, '')        // Non-printable chars
    .replace(/\r\n/g, '\n')                    // Normalize newlines
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')                // Max 2 newlines
    .replace(/^\s+|\s+$/gm, '')                // Trim each line
    .trim();
}

log('Empusa starting');

const sessionStart = new Date().toISOString();
sessionBuffer += `\n=== Session: ${sessionStart} ===\n`;

// Spawn claude in PTY
const shell = process.platform === 'win32' ? 'powershell.exe' : 'bash';
const token = process.env.CLAUDE_CODE_OAUTH_TOKEN;
const claudeArgs = process.argv.slice(2).join(' ');
const claudeCmd = process.platform === 'win32'
  ? `$env:CLAUDE_CODE_OAUTH_TOKEN='${token}'; claude ${claudeArgs}`
  : `claude ${claudeArgs}`;

const ptyProcess = pty.spawn(shell, 
  process.platform === 'win32' 
    ? ['-NoProfile', '-Command', claudeCmd]
    : ['-c', claudeCmd],
  {
    name: 'xterm-256color',
    cols: process.stdout.columns || 80,
    rows: process.stdout.rows || 24,
    cwd: process.cwd(),
    env: {
      ...process.env,
      FORCE_COLOR: '1',
      CLAUDE_CODE_OAUTH_TOKEN: token
    }
  }
);

// Capture output
ptyProcess.onData((data) => {
  process.stdout.write(data);
  sessionBuffer += data;
  
  // Auto-save every second
  const now = Date.now();
  if (now - lastSaveTime > AUTOSAVE_INTERVAL) {
    updateMemory();
    lastSaveTime = now;
  }
});

// Forward input AND capture it
if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
}
process.stdin.on('data', (data) => {
  const input = data.toString();
  
  // CRITICAL: Capture user input BEFORE sending to PTY
  sessionBuffer += input;
  log(`User input captured: ${input.length} bytes`);
  
  // Forward to PTY
  ptyProcess.write(data);
});

// Handle resize
if (process.stdout.on) {
  process.stdout.on('resize', () => {
    ptyProcess.resize(process.stdout.columns, process.stdout.rows);
  });
}

// Handle exit
ptyProcess.onExit(({ exitCode }) => {
  if (process.stdin.isTTY && process.stdin.setRawMode) {
    process.stdin.setRawMode(false);
  }
  
  log(`Claude exited with code ${exitCode}`);
  log(`Captured ${sessionBuffer.length} bytes`);
  
  // Final save (NO AI - user runs cleanup-session.js manually)
  appendFileSync(SESSION_LOG, sessionBuffer);
  updateMemory();
  
  console.log('\n💾 Session saved to .empusa-session.log');
  console.log('🎯 Run: node cleanup-session.js (to AI-clean the log)');
  
  process.exit(exitCode);
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  if (process.stdin.isTTY && process.stdin.setRawMode) {
    process.stdin.setRawMode(false);
  }
  ptyProcess.kill();
  process.exit(0);
});

function updateMemory() {
  try {
    const cleanText = cleanOutput(sessionBuffer);
    const recentText = cleanText.slice(-2000);
    
    // Just save raw clean text - NO AI (user runs cleanup-session.js manually)
    const summary = `# Empusa Session Log

**Last Updated:** ${new Date().toISOString()}
**Captured:** ${sessionBuffer.length} bytes (${cleanText.length} clean)

## Recent Conversation (Raw)

${recentText || '(No conversation yet)'}

## Status
- ✅ Auto-saving every 1 second
- ✅ Full session in .empusa-session.log
- 🎯 Run \`node cleanup-session.js\` to AI-clean this log

---
*Auto-updates every second while chatting*
`;
    
    writeFileSync(MEMORY_FILE, summary);
    log(`Memory saved: ${cleanText.length} clean bytes`);
  } catch (error) {
    log(`Memory error: ${error.message}`);
  }
}
