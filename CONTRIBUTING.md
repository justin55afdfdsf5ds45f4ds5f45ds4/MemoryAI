# Contributing to MemoryAI

Thanks for your interest in making MemoryAI better! 

## Quick Start

1. Fork the repo
2. Clone your fork: `git clone https://github.com/justin55afdfdsf5ds45f4ds5f45ds4/MemoryAI.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test locally: `npm link` then `memoryai`
6. Commit: `git commit -m "Add: your feature description"`
7. Push: `git push origin feature/your-feature-name`
8. Open a Pull Request

## Development Setup

```bash
# Install dependencies
npm install

# Link for local testing
npm link

# Test the wrapper
memoryai

# Test the cleanup script
node cleanup-session.js
```

## Code Style

- Use ES modules (`import`/`export`)
- Keep functions small and focused
- Add comments for complex logic
- No external dependencies unless absolutely necessary

## Ideas for Contributions

### High Priority
- [ ] Better error handling for network failures
- [ ] Progress indicator during AI cleanup
- [ ] Support for other AI models (OpenAI, Anthropic direct)
- [ ] Automatic session naming based on content

### Medium Priority
- [ ] Web UI for browsing history
- [ ] Search functionality across all sessions
- [ ] Export to different formats (JSON, HTML, PDF)
- [ ] Session tagging and categorization

### Low Priority
- [ ] Integration with note-taking apps (Notion, Obsidian)
- [ ] Team collaboration features
- [ ] Analytics on conversation patterns

## Bug Reports

Found a bug? Open an issue with:
- What you expected to happen
- What actually happened
- Steps to reproduce
- Your environment (OS, Node version, Claude Code version)

## Questions?

Open a discussion or issue. We're here to help!
