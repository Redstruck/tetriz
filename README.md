# Tetriz

A modern, browser-based Tetris-inspired game built with React and TypeScript.  
Designed as an exploratory project to learn real-time game logic, UI systems, and iterative feature development.

🔗 **Live Demo:** https://tetriz-one.vercel.app/

---

## Overview

Tetriz is a fully playable Tetris-style game that runs entirely in the browser.  
It started as a simple clone and evolved organically into a multi-mode game with settings, speed controls, visual effects, and competitive mechanics.

The project was built iteratively: features were added, tested, refined, and sometimes removed based on gameplay feel rather than strict upfront planning.

---

## Key Features

- Classic Tetris core mechanics (movement, rotation, line clearing)
- Multiple game modes including Classic, Extra, Speedrun, Versus
- Customizable gameplay settings (speed, visuals, controls)
- High score tracking
- Responsive UI with animated backgrounds
- Progressive difficulty and target systems
- PWA support for offline play

---

## Tech Stack

- **React** + **TypeScript** — application logic and UI
- **Vite** — development and build tooling
- **Tailwind CSS** — styling
- **shadcn/ui** — UI components
- **PWA** — caching and offline support

---

## Project Structure

This repository includes extensive internal documentation created during development, including:

- Feature implementation summaries
- Architecture and layout notes
- Performance and UI optimization reports
- Game mode and settings guides

These files reflect the incremental development process and decision-making behind the project.

If you want a starting point, see:
- `00_START_HERE.md`
- `DOCUMENTATION_INDEX.md`
- `ARCHITECTURE_DIAGRAM.md`

---

## Development Philosophy

This project was intentionally **vibe-coded** in the best sense:

- Features were prototyped quickly
- Gameplay feel guided technical decisions
- Systems were refined through testing and iteration
- Documentation was written alongside implementation

The focus was learning by building rather than achieving a perfectly planned architecture.

---

## Running Locally

### Prerequisites
- Node.js
- npm

### Setup
```bash
git clone https://github.com/Redstruck/tetriz.git
cd tetriz
npm install
npm run dev
