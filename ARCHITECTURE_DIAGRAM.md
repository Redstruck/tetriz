# Game Settings - Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     TETRIS FALL APP                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         GameSettingsProvider (App.tsx)               │  │
│  │     (Wraps entire application)                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                    │
│                    Context API                              │
│                         │                                    │
│    ┌────────────────────┼────────────────────┐              │
│    │                    │                    │              │
│    ▼                    ▼                    ▼              │
│ SettingsPanel      GameBoard            useGameControls  │
│                                         useVersusControls │
│                                                             │
└─────────────────────────────────────────────────────────────┘
           │
           │ localStorage Sync
           │
    ┌──────▼──────┐
    │ Browser     │
    │ Storage     │
    └─────────────┘
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────┐
│     User Opens Settings Dialog      │
└─────────────────┬───────────────────┘
                  │
                  ▼
        ┌─────────────────────┐
        │  SettingsPanel.tsx  │
        │                     │
        │ - Show toggles      │
        │ - Show sliders      │
        │ - Reset button      │
        └─────────┬───────────┘
                  │
                  ▼
      ┌───────────────────────┐
      │ useGameSettings()     │
      │ Hook                  │
      └───────────┬───────────┘
                  │
                  ▼
    ┌──────────────────────────┐
    │ GameSettingsContext      │
    │                          │
    │ - settings (state)       │
    │ - updateSetting()        │
    │ - resetToDefaults()      │
    └──────────┬───────────────┘
               │
               │ (every change)
               ▼
        ┌─────────────────┐
        │ localStorage    │
        │ 'gameSettings'  │
        └─────────────────┘
               │
               │ (app startup)
               ▼
       All Components Using
       useGameSettings()
               │
        ┌──────┴──────────┬──────────┐
        │                 │          │
        ▼                 ▼          ▼
    GameBoard      useGameControls useVersusControls
    
    Apply:        Apply:          Apply:
    - Ghost       - Auto-Repeat   - Auto-Repeat
    - Grid        (Player 1 & 2)
    - Particles
        │                 │          │
        └─────────────────┴──────────┘
                  │
                  ▼
         ┌────────────────┐
         │  Game Display  │
         │  Updates       │
         │  Immediately   │
         └────────────────┘
```

---

## Component Interaction

```
┌────────────────────────────────────────────────────────────┐
│                      App.tsx                              │
│         (GameSettingsProvider wrapper)                    │
└────┬───────────────────────────────────────────────┬───────┘
     │                                               │
     ▼                                               ▼
┌──────────────┐                            ┌──────────────┐
│  GamePage    │                            │ExtraGamePage │
│  (Classic)   │                            │  (Extra)     │
└──────┬───────┘                            └──────┬───────┘
       │                                          │
       ▼                                          ▼
┌────────────────┐                      ┌────────────────┐
│  TetrisGame    │                      │  TetrisGame    │
│  Component     │                      │  Component     │
└────────┬───────┘                      └────────┬───────┘
         │                                       │
         ▼                                       ▼
┌────────────────────┐                ┌────────────────────┐
│   GameBoard        │                │   GameBoard        │
│   (uses Context)   │                │   (uses Context)   │
│                    │                │                    │
│  Settings Applied: │                │  Settings Applied: │
│  - showGhost       │                │  - showGhost       │
│  - showGrid        │                │  - showGrid        │
│  - enableParticles │                │  - enableParticles │
└────────────────────┘                └────────────────────┘

┌──────────────────────┐               ┌──────────────────────┐
│ useGameControls Hook │               │ useGameControls Hook │
│ (uses Context)       │               │ (uses Context)       │
│                      │               │                      │
│ Settings Applied:    │               │ Settings Applied:    │
│ - autoRepeat         │               │ - autoRepeat         │
└──────────────────────┘               └──────────────────────┘
```

---

## Settings State Management

```
┌──────────────────────────────────────────────────────────┐
│            GameSettingsContext.tsx                       │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ const [settings, setSettings] = useState(...)      │ │
│  │                                                    │ │
│  │ settings = {                                       │ │
│  │   soundVolume: 70,                                │ │
│  │   musicVolume: 50,                                │ │
│  │   enableSounds: true,                             │ │
│  │   enableMusic: true,                              │ │
│  │   autoRepeat: true,        ✅ IMPLEMENTED        │ │
│  │   showGhost: true,         ✅ IMPLEMENTED        │ │
│  │   showGrid: false,         ✅ IMPLEMENTED        │ │
│  │   enableParticles: true    ✅ IMPLEMENTED        │ │
│  │ }                                                 │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ useEffect(() => {                                  │ │
│  │   // Load from localStorage on mount               │ │
│  │   const saved = localStorage.getItem(...)          │ │
│  │   if (saved) setSettings(...)                      │ │
│  │ }, [])                                             │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ useEffect(() => {                                  │ │
│  │   // Save to localStorage on change                │ │
│  │   localStorage.setItem('gameSettings', JSON...)    │ │
│  │ }, [settings])                                     │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ updateSetting(key, value) {                        │ │
│  │   setSettings(prev => ({...prev, [key]: value}))  │ │
│  │ }                                                   │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ resetToDefaults() {                                │ │
│  │   setSettings(DEFAULT_SETTINGS)                    │ │
│  │ }                                                   │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Export: useGameSettings() Hook                     │ │
│  │ Returns: { settings, updateSetting, reset... }    │ │
│  └────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

---

## Setting Application Flow

### Auto-Repeat Movement
```
User Presses Left Arrow Key
        │
        ▼
handleKeyDown (useGameControls.ts)
        │
        ├─ Add key to keysPressed Set
        │
        ├─ If settings.autoRepeat:
        │  └─ startKeyRepeat(key)
        │     └─ Request animation frame
        │
        ▼
gameLoop (runs every frame)
        │
        ├─ If settings.autoRepeat:
        │  └─ Check if repeat delay passed
        │     └─ Call onMoveLeft()
        │
        ▼
Game Board Updates
        │
        ▼
Piece Moves Left
```

### Show Ghost Piece
```
Render Game Board
        │
        ▼
useMemo calculation
        │
        ├─ If settings.showGhost:
        │  └─ Add ghost piece to ghostBoard
        │
        ▼
Render displayBoard
        │
        ├─ If hasGhostPiece && !hasActualPiece:
        │  └─ Apply ghost styling (dashed border)
        │
        ▼
Board Display Shows/Hides Ghost Piece
```

### Show Grid Lines
```
Render Game Board
        │
        ▼
Calculate className
        │
        ├─ Base: "grid gap-[2px] bg-game-grid/50 p-2 rounded"
        │
        ├─ If settings.showGrid:
        │  └─ Add: "gap-0.5 border border-slate-600/50"
        │
        ▼
Apply className
        │
        ▼
Grid Display Shows/Hides Lines
```

### Particle Effects
```
Line Complete
        │
        ▼
getCellClasses()
        │
        ├─ clearingClass = settings.enableParticles
        │  ? "animate-line-clear" : ""
        │
        ▼
Render Cell
        │
        ├─ If isClearing && settings.enableParticles:
        │  └─ <div className="animate-line-clear" />
        │
        ▼
Animation Plays or Skips
```

---

## localStorage Persistence

```
┌──────────────────────────────┐
│   Component Updates Setting  │
│   updateSetting('key', val)  │
└──────────┬───────────────────┘
           │
           ▼
   ┌──────────────────┐
   │ State Updated    │
   │ setSettings(...) │
   └──────────┬───────┘
              │
              ▼ (triggered by useEffect dependency)
   ┌────────────────────────────────┐
   │ useEffect(() => {              │
   │   localStorage.setItem(...)    │
   │ }, [settings])                 │
   └────────────┬───────────────────┘
                │
                ▼
     ┌─────────────────────┐
     │  Browser Storage    │
     │  'gameSettings' =   │
     │  {...serialized}    │
     └─────────────────────┘

━━━━━━━━━━━ PAGE REFRESH ━━━━━━━━━━━

   ┌──────────────────────────┐
   │  App Loads               │
   │  GameSettingsProvider    │
   └──────────┬───────────────┘
              │
              ▼ (on mount)
   ┌──────────────────────────────┐
   │ useEffect(() => {            │
   │   const saved =              │
   │     localStorage.getItem()   │
   │   setSettings(saved)         │
   │ }, [])                       │
   └──────────┬───────────────────┘
              │
              ▼
   ┌────────────────────────┐
   │ Settings Restored      │
   │ All Components Updated │
   └────────────────────────┘
```

---

## File Dependencies

```
App.tsx
├─ GameSettingsProvider (NEW)
├─ GamePage.tsx
│  ├─ TetrisGame.tsx
│  │  ├─ GameBoard.tsx (uses useGameSettings)
│  │  ├─ useGameControls.ts (uses useGameSettings)
│  │  └─ GameUI.tsx
├─ ExtraGamePage.tsx
│  ├─ SettingsPanel.tsx (uses useGameSettings)
├─ SpeedrunGamePage.tsx
│  ├─ TetrisGame.tsx
├─ VersusGamePage.tsx
   ├─ useVersusControls.ts (uses useGameSettings)
   └─ GameBoard.tsx (uses useGameSettings)

GameSettingsContext.tsx (NEW)
├─ exports GameSettingsProvider
├─ exports useGameSettings hook
└─ manages all game settings state
```

---

## Summary

The architecture uses React Context API for centralized settings management with localStorage persistence. Settings flow from the context to consumer components (GameBoard, control hooks) where they conditionally apply visual effects and behavior changes. All changes are automatically saved and restored across sessions.

**Key Features:**
- ✅ Centralized state
- ✅ Persistent storage
- ✅ Type-safe
- ✅ Zero external dependencies
- ✅ Performance optimized
- ✅ Easy to extend
