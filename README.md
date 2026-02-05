# MemoryAI 🧠

> **Never lose a Claude Code conversation again.**

Stop frantically screenshotting your terminal. Stop losing critical architectural decisions buried in chat history. Stop wondering "what did Claude say about that API design 3 hours ago?"

**MemoryAI captures every conversation with Claude Code and transforms it into clean, searchable memory.**

---

## The Problem 😤

You're deep in flow with Claude Code. Making critical decisions. Discussing architecture. Getting solutions to complex problems.

Then you close the terminal.

**Everything is gone.**

No history. No record. No way to reference what was discussed. You're left trying to remember if Claude suggested PostgreSQL or MongoDB, whether that API should be REST or GraphQL, what that regex pattern was...

**This is insane.** Every other tool has history. Slack has history. Discord has history. Even your bash terminal has history.

But Claude Code? **Nothing.**

---

## The Solution ✨

**MemoryAI** is a transparent wrapper that captures every single interaction with Claude Code:

- ✅ **Zero configuration** - Works out of the box
- ✅ **Zero latency** - No performance impact
- ✅ **Zero interference** - Full TTY support, colors, spinners, everything works
- ✅ **Automatic capture** - Every keystroke, every response, saved
- ✅ **AI-powered cleanup** - Raw logs → clean conversation format
- ✅ **Searchable memory** - Find any past conversation instantly

---

## Installation

```bash
# 1. Clone the repo
git clone https://github.com/justin55afdfdsf5ds45f4ds5f45ds4/MemoryAI.git
cd MemoryAI

# 2. Install dependencies
npm install

# 3. Link globally (use 'memoryai' from anywhere)
npm link

# 4. Set up your tokens in .env
CLAUDE_CODE_OAUTH_TOKEN=your_claude_token_here
REPLICATE_API_KEY=your_replicate_key_here
```

### Get Your Tokens

**Claude Code Token:**
```bash
claude auth login --long-lived
# Copy the token it gives you
```

**Replicate API Key:**
- Sign up at [replicate.com](https://replicate.com)
- Go to Account → API Tokens
- Copy your token

---

## Usage

### Instead of `claude`, use `memoryai`:

```bash
# Interactive mode (recommended)
memoryai

# Direct prompt
memoryai --print "explain async/await"

# Any Claude Code argument works
memoryai --help
memoryai --version
```

### That's it. 

Chat with Claude as normal. When you're done:

```bash
# Exit Claude (Ctrl+D or Ctrl+C twice)

# Clean up the conversation with AI
node cleanup-session.js
```

Your conversation is now saved in `MEMORY.md` in clean, readable format.

---

## How It Works

### 1. **Transparent Capture**
MemoryAI spawns Claude Code in a pseudo-terminal (PTY) and captures all I/O:
- Your input (every keystroke)
- Claude's responses (full text)
- All terminal interactions

### 2. **Real-time Saving**
Every second, the raw session is saved to `.empusa-session.log`. If your terminal crashes, you don't lose anything.

### 3. **AI-Powered Cleanup**
When you run `cleanup-session.js`, it:
- Strips all ANSI codes, escape sequences, UI elements
- Sends the clean text to DeepSeek v3 (via Replicate)
- Formats as "User: / Claude:" conversation pairs
- Saves to `MEMORY.md`

### 4. **Searchable Memory**
Now you have a clean markdown file with your entire conversation history. Search it, reference it, commit it to git, whatever you need.

---

## Example Output

**Before (raw terminal log):**
```
[?9001h[?1004h[?25l[2J[m[H]0;claude[?25h● Hello! How can I help...
```

**After (AI-cleaned):**
```markdown
User: How should I structure my API routes?

Claude: I recommend organizing your API routes by resource...
```

---

## Why This Matters

### For Solo Developers
- Reference past decisions without digging through terminal history
- Build a knowledge base of solutions Claude provided
- Never lose that perfect regex or SQL query again

### For Teams
- Share Claude conversations with teammates
- Document AI-assisted architectural decisions
- Create a searchable archive of problem-solving sessions

### For Learning
- Review how Claude explained complex concepts
- Build a personal knowledge base
- Track your learning journey

---

## Files Created

| File | Purpose |
|------|---------|
| `.empusa-session.log` | Raw session capture (all I/O) |
| `.empusa-debug.log` | Debug info (timestamps, errors) |
| `MEMORY.md` | AI-cleaned conversation history |

---

## Configuration

Create a `.env` file in your project directory:

```bash
# Required: Your Claude Code OAuth token
CLAUDE_CODE_OAUTH_TOKEN=sk-ant-oat01-...

# Required for AI cleanup: Replicate API key
REPLICATE_API_KEY=r8_...
```

**Without `REPLICATE_API_KEY`:** Sessions are still captured, but you'll get raw logs instead of AI-cleaned conversations.

---

## FAQ

**Q: Does this slow down Claude Code?**  
A: No. Zero added latency. MemoryAI uses PTY passthrough - Claude runs at full speed.

**Q: Does this work with all Claude Code features?**  
A: Yes. Colors, spinners, interactive mode, file editing - everything works exactly as before.

**Q: How much does the AI cleanup cost?**  
A: DeepSeek v3 on Replicate is extremely cheap (~$0.001 per cleanup). A month of daily use costs less than a coffee.

**Q: Can I use this without the AI cleanup?**  
A: Yes. Just don't set `REPLICATE_API_KEY`. You'll get raw logs that you can manually review.

**Q: Is my data sent anywhere?**  
A: Only to Replicate (if you enable AI cleanup). Nothing is sent to any other service. Your conversations stay on your machine.

---

## Roadmap

- [ ] Automatic git commit of MEMORY.md after each session
- [ ] Web UI for browsing conversation history
- [ ] Full-text search across all sessions
- [ ] Export to Notion/Obsidian
- [ ] Team collaboration features

---

## Contributing

PRs welcome! This tool was built out of frustration with losing important conversations. If you have ideas to make it better, let's build them.

---

## License

MIT - Do whatever you want with it.

---

## Credits

Built with:
- [node-pty](https://github.com/microsoft/node-pty) - PTY bindings for Node.js
- [DeepSeek v3](https://replicate.com/deepseek-ai/deepseek-v3) - AI conversation cleanup
- [Claude Code](https://claude.ai/code) - The AI pair programmer

---

**Stop losing conversations. Start building memory.**

```bash
npm install -g memoryai
memoryai
```
