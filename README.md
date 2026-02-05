<div align="center">
  <img src="logo.jpg" alt="MemoryAI Logo" width="600"/>
  
  # MemoryAI 🧠
  
  ### Your AI's perfect memory. Always under 5K tokens. Never loses context.
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
  
  [Installation](#installation) • [Usage](#usage) • [How It Works](#how-it-works) • [FAQ](#faq)
  
</div>

---

## The Real Problem 💥

You're building a project with Claude Code. Making decisions. Fixing bugs. Trying different approaches.

**Claude Code has a memory system.** It's supposed to save important context to `MEMORY.md`.

### But here's what actually happens:

```diff
- Claude forgets to save when handling multiple tasks
- You lose critical decisions when the session crashes
- No record of what failed and why
- Can't feed context to other AIs reliably
- Memory files bloated with 50K+ tokens of noise
```

You end up:
- ❌ Repeating the same mistakes
- ❌ Re-explaining your project structure every session
- ❌ Losing architectural decisions
- ❌ Wasting tokens on redundant context

**This isn't a "conversation logger." This is a state machine for your entire project.**

---

## What MemoryAI Actually Does ✨

<table>
<tr>
<td width="50%">

### 🎯 Captures Everything Automatically
Every interaction with Claude Code is saved. No manual work. No hoping Claude remembers to update memory.

### 🧹 AI-Powered Noise Removal
Raw terminal logs are full of garbage (ANSI codes, UI elements, spinners). MemoryAI strips all of it. **Only the actual conversation remains.**

### 📦 Always Under 5K Tokens
The AI cleanup keeps only what matters: decisions, solutions, mistakes, instructions. **No bloat. No noise. Pure signal.**

</td>
<td width="50%">

### 🔄 Universal AI Context
Feed `MEMORY.md` to ANY AI (Claude, ChatGPT, Cursor, Copilot, local models). They all instantly understand your project state.

### 🛡️ Mistake Prevention
"Wait, didn't we try that approach already?" Yes. It's in MEMORY.md. With the exact reason why it failed. **Never repeat the same mistake twice.**

### ⚡ Zero Performance Impact
PTY passthrough means Claude runs at full speed. No latency added.

</td>
</tr>
</table>

---

## Installation

```bash
# Clone the repo
git clone https://github.com/justin55afdfdsf5ds45f4ds5f45ds4/MemoryAI.git
cd MemoryAI

# Install dependencies
npm install

# Link globally
npm link

# Set up your environment
cp .env.example .env
# Edit .env with your tokens
```

### 🔑 Get Your Tokens

<details>
<summary><b>Claude Code Token</b></summary>

```bash
claude auth login --long-lived
# Copy the token it gives you
```

Add to `.env`:
```bash
CLAUDE_CODE_OAUTH_TOKEN=sk-ant-oat01-...
```

</details>

<details>
<summary><b>Replicate API Key</b></summary>

1. Sign up at [replicate.com](https://replicate.com)
2. Go to Account → API Tokens
3. Copy your token

Add to `.env`:
```bash
REPLICATE_API_KEY=r8_...
```

</details>

---

## Usage

### Replace `claude` with `memoryai`:

```bash
# Interactive mode
memoryai

# Direct prompt
memoryai --print "refactor the auth module"

# Any Claude Code argument works
memoryai --help
```

### Work normally with Claude Code

Chat, code, make decisions. Everything is captured automatically.

### When you're done:

```bash
# Exit Claude (Ctrl+D or Ctrl+C twice)

# Clean up the session with AI
npm run cleanup
```

**That's it.** Your `MEMORY.md` now contains:
- ✅ Every decision you made
- ✅ Every problem you solved
- ✅ Every mistake you fixed
- ✅ Clean, searchable, under 5K tokens

---

## Real-World Example

<table>
<tr>
<th>❌ Without MemoryAI</th>
<th>✅ With MemoryAI</th>
</tr>
<tr>
<td>

**Session 1:**
```
You: Should I use PostgreSQL or MongoDB?
Claude: For your use case, PostgreSQL 
is better because...
```

**Session 2 (next day):**
```
You: Should I use PostgreSQL or MongoDB?
Claude: Let me think about your 
requirements...
```

**You just wasted 10 minutes re-explaining everything.**

</td>
<td>

**Session 1:**
```
You: Should I use PostgreSQL or MongoDB?
Claude: For your use case, PostgreSQL 
is better because...
```

**Session 2 (next day):**
```
You: [Feed MEMORY.md to Claude]
Claude: I see we already decided on 
PostgreSQL. Let's continue with the 
schema design...
```

**Zero wasted time. Perfect continuity.**

</td>
</tr>
</table>

---

## Why This Matters

<table>
<tr>
<td width="33%">

### 👤 For Solo Developers
- Never lose context between sessions
- Build a knowledge base of project decisions
- Feed any AI your project state instantly
- Avoid repeating mistakes you already solved

</td>
<td width="33%">

### 👥 For Teams
- Onboard new devs by showing them MEMORY.md
- Document AI-assisted decisions automatically
- Share context across different AI tools
- Track project evolution over time

</td>
<td width="33%">

### 🏗️ For Complex Projects
- Maintain state across weeks of development
- Remember why you made specific architectural choices
- Avoid circular debugging
- Keep token usage low (always under 5K)

</td>
</tr>
</table>

---

## How It Works

```mermaid
graph LR
    A[You + Claude Code] --> B[MemoryAI Wrapper]
    B --> C[Raw Session Log]
    C --> D[AI Cleanup DeepSeek v3]
    D --> E[MEMORY.md < 5K tokens]
    E --> F[Feed to Any AI]
```

### 1. 🎬 Transparent Capture
MemoryAI wraps Claude Code in a pseudo-terminal (PTY):
- Captures every keystroke you type
- Captures every response from Claude
- Zero performance impact
- Full TTY support (colors, spinners, everything works)

### 2. 💾 Real-Time Saving
Every second, the raw session is saved to `.empusa-session.log`:
- If your terminal crashes, nothing is lost
- If Claude Code fails, you still have the log
- Complete backup of every interaction

### 3. 🤖 AI-Powered Cleanup
When you run `npm run cleanup`:

```javascript
// Strips all ANSI codes and terminal garbage
const cleanText = cleanOutput(rawSession);

// Sends to DeepSeek v3 via Replicate
const aiPrompt = `Extract only meaningful content:
- User questions/instructions
- Claude's solutions
- Decisions made
- Problems solved`;

// Formats as clean "User: / Claude:" pairs
// Saves to MEMORY.md
```

### 4. 📊 Token Optimization
The AI is instructed to:
- Remove redundant explanations
- Keep only actionable information
- Compress verbose responses
- Maintain context without bloat

**Result: Always under 5K tokens, no matter how long your session.**

---

## Project Structure

```
MemoryAI/
├── 📄 empusa.js              # Main wrapper (captures sessions)
├── 🧹 cleanup-session.js     # AI cleanup script
├── 📦 package.json           # NPM config
├── 🔧 .env.example           # Environment template
├── 🚫 .gitignore            # Git ignore rules
├── 📜 LICENSE               # MIT License
├── 📖 README.md             # This file
├── 🤝 CONTRIBUTING.md       # Contribution guide
└── 🖼️ logo.jpg              # Project logo

Generated files (not in repo):
├── 📝 .empusa-session.log   # Raw session capture
├── 🐛 .empusa-debug.log     # Debug info
├── 🧠 MEMORY.md             # AI-cleaned project memory
└── 🔐 .env                  # Your tokens (keep secret!)
```

---

## Configuration

Create a `.env` file:

```bash
# Required: Claude Code OAuth token
CLAUDE_CODE_OAUTH_TOKEN=sk-ant-oat01-...

# Required: Replicate API key for AI cleanup
REPLICATE_API_KEY=r8_...
```

**Without `REPLICATE_API_KEY`:** Sessions are still captured, but you get raw logs instead of AI-cleaned memory.

---

## Cost 💰

**DeepSeek v3 on Replicate:**
```
~$0.001 per cleanup
A month of daily use: less than $0.30
```

**Worth it?** Absolutely. The time saved from not repeating mistakes pays for itself in minutes.

---

## FAQ

<details>
<summary><b>Is this just a conversation logger?</b></summary>

No. It's a project state machine. It captures decisions, mistakes, solutions - everything needed to maintain context across sessions and AIs.

</details>

<details>
<summary><b>Why not just use Claude Code's built-in memory?</b></summary>

Claude Code's memory is unreliable:
- Forgets to save when busy
- Loses data on crashes
- Gets bloated with noise

MemoryAI is automatic, reliable, and always clean.

</details>

<details>
<summary><b>Does this slow down Claude Code?</b></summary>

Zero performance impact. MemoryAI uses PTY passthrough - Claude runs at full speed.

</details>

<details>
<summary><b>Can I use this with other AIs?</b></summary>

Yes! Feed `MEMORY.md` to ChatGPT, Cursor, Copilot, local models - anything. They all understand the format.

</details>

<details>
<summary><b>What if I don't want AI cleanup?</b></summary>

Don't set `REPLICATE_API_KEY`. You'll get raw logs you can manually review.

</details>

<details>
<summary><b>Is my data sent anywhere?</b></summary>

Only to Replicate (if you enable AI cleanup). Nothing else. Your conversations stay on your machine.

</details>

<details>
<summary><b>How do I know it's working?</b></summary>

Check `.empusa-debug.log` - you'll see "User input captured" entries. After cleanup, check `MEMORY.md`.

</details>

---

## Roadmap 🗺️

- [ ] Automatic session naming based on content
- [ ] Diff view between sessions
- [ ] Export to Notion/Obsidian
- [ ] Web UI for browsing history
- [ ] Full-text search across all sessions
- [ ] Support for other AI models (OpenAI, local)
- [ ] Team collaboration features
- [ ] Git integration (auto-commit MEMORY.md)

---

## Contributing 🤝

PRs welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

Built this because I was tired of:
- Losing context between sessions
- Repeating the same mistakes
- Wasting tokens on redundant explanations
- Claude Code's unreliable memory

If you have ideas to make it better, let's build them.

---

## License 📜

MIT - Do whatever you want with it.

---

## Credits 🙏

Built with:
- [node-pty](https://github.com/microsoft/node-pty) - PTY bindings for Node.js
- [DeepSeek v3](https://replicate.com/deepseek-ai/deepseek-v3) - AI conversation cleanup
- [Claude Code](https://claude.ai/code) - The AI pair programmer

Made by [@justin55afdfdsf5ds45f4ds5f45ds4](https://github.com/justin55afdfdsf5ds45f4ds5f45ds4)

---

<div align="center">
  
  **Stop repeating mistakes. Start building memory.**
  
  ```bash
  git clone https://github.com/justin55afdfdsf5ds45f4ds5f45ds4/MemoryAI.git
  cd MemoryAI
  npm install && npm link
  memoryai
  ```
  
  ⭐ Star this repo if it saved you time!
  
</div>
