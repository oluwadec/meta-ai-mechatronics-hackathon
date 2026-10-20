# Codespace — AI Pair-Programming Studio

**Meta Global AI Developer Hackathon 2026**  
**Track:** Indie Developer  
**Theme:** Push the Frontier / Build for Your World

A browser-based coding studio with an intelligent AI pair-programming assistant.  
Built as a single self-contained web app that runs entirely in the browser.

---

## Project Overview

**Codespace** is a full-featured online IDE experience designed for rapid prototyping, learning, and solving algorithmic problems with AI assistance.

### Core Features

| Feature | Description |
|---------|-------------|
| **CodeMirror 5 Editor** | Custom syntax highlighting, multi-file support with tabs |
| **Multi-language Support** | JavaScript (live execution), Python (hand-written subset interpreter), C++ & Java (static preview + clear labelling) |
| **Interactive Terminal** | Supports live `cin >> x` style input while programs run |
| **AI Pair Programmer** | Floating, draggable assistant that lints as you type |
| **One-click Fixes** | Clickable diagnostics with **Apply fix** that patches code directly |
| **Chat Interface** | Ask the AI to write code into the editor or solve LeetCode-style problems |
| **Persistence** | Chat history + files stored in `localStorage` |

### Technical Highlights

- **Debounced Static Analysis / Linting** — responsive feedback without blocking the UI
- **Hand-written Interpreter** — custom Python subset parser + executor
- **LLM API Integration** — carefully designed prompts for code generation, explanation, and automated fixes
- **State Persistence** — full workspace restored across sessions via `localStorage`

---

## Hackathon Angle (Meta Models)

This project is being evolved for the **Meta Global AI Developer Hackathon** by integrating:

- **Muse Spark / Muse Code** for higher-quality agentic code generation and multi-step reasoning
- **SAM 3.1** potential for future visual programming / diagram-to-code features
- Open-weight Meta models via partners (Baseten, Modal, Fireworks) for local/offline-capable inference options

The goal is to push the frontier of **in-browser AI-assisted development** — making powerful coding assistance available with zero setup, while exploring how Meta’s newest models can improve code understanding, repair, and multi-language reasoning.

---

## Quick Start (GitHub Codespaces)

1. Click the green **Code** button → **Codespaces** → **Create codespace on main**
2. Once the environment is ready, open `index.html` with the Live Server extension or run:
   ```bash
   python -m http.server 8080
   ```
3. Open the forwarded port in your browser.

A full `.devcontainer` configuration is included for a consistent development environment.

---

## Project Structure

```
.
├── index.html              # Main application entry
├── css/
│   └── styles.css          # App styling
├── js/
│   ├── editor.js           # CodeMirror setup + multi-file tabs
│   ├── terminal.js         # Interactive terminal + I/O
│   ├── interpreter.js      # Python subset interpreter
│   ├── linter.js           # Debounced static analysis
│   ├── ai-assistant.js     # Floating bot + chat + LLM integration
│   └── persistence.js      # localStorage state management
├── .devcontainer/
│   └── devcontainer.json   # Codespaces configuration
├── assets/                 # Icons, logos
└── README.md
```

---

## Roadmap for Hackathon

- [ ] Integrate Meta Muse Spark / Muse Code agent for superior code generation
- [ ] Improve multi-step reasoning for complex LeetCode-style problems
- [ ] Add support for more languages via Meta open-weight models
- [ ] Explore SAM 3.1 for visual-to-code / UI generation experiments
- [ ] Polish UX and add export / share workspace features

---

## Author

**Aboderin Logo**  
Mechatronics Engineering student · Indie developer  
GitHub: [oluwadec](https://github.com/oluwadec)

---

## License

MIT