# Technical Implementation Guide - Game Settings

## Architecture Decision

### Why Context API?
- ✅ Centralized state management
- ✅ No external dependencies (Redux not needed)
- ✅ Easy to integrate with localStorage
- ✅ Type-safe with TypeScript
- ✅ Performance optimized with useMemo

### Why localStorage?
- ✅ Persistent across sessions
- ✅ No backend required
- ✅ Works offline
- ✅ ~5-10MB available per domain

---

## File Structure

```
src/
├── contexts/
│   └── GameSettingsContext.tsx        # New: Settings management
├── components/
│   ├── SettingsPanel.tsx              # Modified: Uses context
│   ├── GameBoard.tsx                  # Modified: Applies visual settings
│   ├── TetrisGame.tsx                 # Passes settings to GameBoard
│   └── ...others
├── hooks/
│   ├── useGameControls.ts             # Modified: Auto-repeat logic
│   ├── useVersusControls.ts           # Modified: Auto-repeat logic
│   └── ...others
└── App.tsx                            # Modified: Provider wrapper
```

---

## GameSettingsContext Implementation

### Interface Definition
```typescript
export interface GameSettings {
  // Audio Settings
  soundVolume: number;           // 0-100
  musicVolume: number;           // 0-100
  enableSounds: boolean;
  enableMusic: boolean;
  
  // Gameplay Settings
  autoRepeat: boolean;           // ✅ Implemented
  
  // Visual Settings
  showGhost: boolean;            // ✅ Implemented
  showGrid: boolean;             // ✅ Implemented
  enableParticles: boolean;      // ✅ Implemented
}
```

### Hook Usage
```typescript
// In any component
import { useGameSettings } from '@/contexts/GameSettingsContext';

export const MyComponent = () => {
  const { settings, updateSetting, resetToDefaults } = useGameSettings();
  
  // Read settings
  if (settings.showGhost) {
    // Render ghost piece
  }
  
  // Update settings
  updateSetting('showGhost', false);
  
  // Reset all
  resetToDefaults();
};
```

---

## Setting-by-Setting Implementation

### 1. Auto-Repeat Movement

**Location:** `useGameControls.ts` and `useVersusControls.ts`

**How it works:**
```typescript
const { settings } = useGameSettings();

// In gameLoop callback
if (!settings.autoRepeat) return; // Skip repeat if disabled

// In handleKeyDown
if (settings.autoRepeat) {
  startKeyRepeat(key);  // Only enable repeat if setting on
}
```

**User Impact:**
- OFF: Keys require individual presses
- ON: Keys repeat when held continuously

**Dependency:** `[settings.autoRepeat]` added to useCallback deps

---

### 2. Show Ghost Piece

**Location:** `GameBoard.tsx`

**How it works:**
```typescript
const { settings } = useGameSettings();

// Memoized display board calculation
const { displayBoard, ghostBoard } = useMemo(() => {
  // ...
  if (settings.showGhost && ghostPiece && currentPiece && ...) {
    // Render ghost piece
  }
  // ...
}, [board, currentPiece, ghostPiece, boardWidth, settings.showGhost]);
```

**User Impact:**
- OFF: Ghost piece not rendered (cleaner view)
- ON: Ghost piece visible (helpful for planning drops)

**Performance:** Ghost piece calculation only re-runs when setting changes

---

### 3. Show Grid Lines

**Location:** `GameBoard.tsx`

**How it works:**
```typescript
const { settings } = useGameSettings();

// Dynamic class names
<div 
  className={cn(
    "grid gap-[2px] bg-game-grid/50 p-2 rounded",
    settings.showGrid && "gap-0.5 border border-slate-600/50"
  )}
>
```

**CSS Applied:**
- OFF: `gap-[2px]` (2px spacing, less visible)
- ON: `gap-0.5 border border-slate-600/50` (0.5px spacing + border)

**User Impact:**
- OFF: Clean board without grid
- ON: Visible grid helps with piece alignment

---

### 4. Particle Effects

**Location:** `GameBoard.tsx`

**How it works:**
```typescript
const { settings } = useGameSettings();

// In getCellClasses
const clearingClass = (isClearing && settings.enableParticles) 
  ? " animate-line-clear" 
  : "";

// In render
{isClearing && settings.enableParticles && (
  <div className="absolute inset-0 bg-white rounded-sm animate-line-clear" />
)}
```

**CSS Animation:**
```css
@keyframes line-clear-fast {
  0% { 
    transform: scaleX(1) translateZ(0);
    opacity: 1; 
  }
  50% { 
    transform: scaleX(1.05) translateZ(0);
    opacity: 0.8; 
  }
  100% { 
    transform: scaleX(0) translateZ(0);
    opacity: 0; 
  }
}

.animate-line-clear {
  animation: line-clear-fast 0.3s ease-out forwards;
}
```

**User Impact:**
- OFF: No animation (faster, cleaner)
- ON: Smooth 0.3s line-clear animation

**Performance:** Animations consume CPU; disabling helps on lower-end devices

---

## Integration Points

### App.tsx (Provider Setup)
```typescript
const App = () => (
  <GameSettingsProvider>
    <QueryClientProvider>
      {/* All routes and components */}
    </QueryClientProvider>
  </GameSettingsProvider>
);
```

### GameBoard.tsx (Consumer)
```typescript
export const GameBoard = memo(({ ... }) => {
  const { settings } = useGameSettings();
  
  // Use settings for rendering decisions
  const { displayBoard, ghostBoard } = useMemo(() => {
    // showGhost setting
  }, [..., settings.showGhost]);
  
  // Use settings for class names
  className={cn("...", settings.showGrid && "...")}
  
  // Use settings for animations
  {isClearing && settings.enableParticles && ...}
});
```

### SettingsPanel.tsx (Editor)
```typescript
export const SettingsPanel = ({ onClose }) => {
  const { settings, updateSetting, resetToDefaults } = useGameSettings();
  
  return (
    <Switch
      checked={settings.autoRepeat}
      onCheckedChange={(checked) => updateSetting('autoRepeat', checked)}
    />
  );
};
```

---

## localStorage Format

**Key:** `'gameSettings'`

**Value (JSON):**
```json
{
  "soundVolume": 70,
  "musicVolume": 50,
  "enableSounds": true,
  "enableMusic": true,
  "autoRepeat": true,
  "showGhost": true,
  "showGrid": false,
  "enableParticles": true
}
```

**Accessing:**
```typescript
// Read
const saved = JSON.parse(localStorage.getItem('gameSettings') || '{}');

// Write
localStorage.setItem('gameSettings', JSON.stringify(settings));

// Clear
localStorage.removeItem('gameSettings');
```

---

## Performance Optimization

### Memoization
- `GameBoard` is memoized with `React.memo()`
- `useMemo` used for ghost board calculation
- Only re-renders when relevant settings change

### Dependency Arrays
```typescript
// Good - only recalculate when these change
useMemo(() => {
  // expensive calculation
}, [board, currentPiece, ghostPiece, boardWidth, settings.showGhost]);
```

### Conditional Rendering
```typescript
// Good - avoids rendering if not needed
if (settings.showGhost && ghostPiece && ...) {
  // render ghost
}
```

---

## Error Handling

### localStorage Unavailable
```typescript
try {
  const savedSettings = localStorage.getItem('gameSettings');
  if (savedSettings) {
    const parsed = JSON.parse(savedSettings);
    setSettings({ ...DEFAULT_SETTINGS, ...parsed });
  }
} catch (error) {
  console.error('Failed to parse saved settings:', error);
  // Fall back to defaults
}
```

### Invalid JSON
- Try/catch around JSON.parse
- Falls back to DEFAULT_SETTINGS
- Error logged but doesn't crash app

---

## Adding New Settings

### Step 1: Update Interface
```typescript
export interface GameSettings {
  // ... existing
  newSetting: boolean;  // Add your setting
}
```

### Step 2: Update Defaults
```typescript
const DEFAULT_SETTINGS: GameSettings = {
  // ... existing
  newSetting: true,  // Set default value
};
```

### Step 3: Add to SettingsPanel
```typescript
<Switch
  checked={settings.newSetting}
  onCheckedChange={(checked) => updateSetting('newSetting', checked)}
/>
```

### Step 4: Use in Components
```typescript
const { settings } = useGameSettings();
if (settings.newSetting) {
  // Apply your feature
}
```

---

## Testing Settings

### Manual Testing Checklist
- [ ] Settings persist after page refresh
- [ ] Settings apply in all 4 gamemodes
- [ ] Auto-repeat works/disables correctly
- [ ] Ghost piece shows/hides correctly
- [ ] Grid lines show/hide correctly
- [ ] Particle effects show/hide correctly
- [ ] Reset to Defaults restores all settings
- [ ] No console errors
- [ ] Settings apply without lag
- [ ] localStorage data is valid JSON

### Browser DevTools
```javascript
// Check localStorage
localStorage.getItem('gameSettings')

// Manually set
localStorage.setItem('gameSettings', JSON.stringify({...}))

// Clear
localStorage.clear()
```

---

## Browser Support

| Browser | Version | localStorage | Status |
|---------|---------|-------------|--------|
| Chrome | 4+ | ✅ | Fully supported |
| Firefox | 3.5+ | ✅ | Fully supported |
| Safari | 4+ | ✅ | Fully supported |
| Edge | All | ✅ | Fully supported |
| IE | 8+ | ✅ | Fully supported |
| Opera | 10.5+ | ✅ | Fully supported |

---

## Debugging Tips

### Enable all animations
```javascript
localStorage.setItem('gameSettings', JSON.stringify({
  autoRepeat: true,
  showGhost: true,
  showGrid: true,
  enableParticles: true
}))
```

### Disable all visual effects
```javascript
localStorage.setItem('gameSettings', JSON.stringify({
  autoRepeat: false,
  showGhost: false,
  showGrid: false,
  enableParticles: false
}))
```

### Monitor settings changes
```typescript
// In component
useEffect(() => {
  console.log('Settings changed:', settings);
}, [settings]);
```

---

## Known Limitations

1. **No Cloud Sync** - Settings only stored locally
2. **No Profile System** - Single settings profile per browser
3. **No Keyboard Customization** - Only affects auto-repeat behavior
4. **No Audio Volume Implementation** - UI exists but not connected to audio system
5. **No Theme Selection** - Only affects ghost piece and grid visibility

---

## Future Improvements

1. Implement actual audio volume control
2. Add export/import settings feature
3. Add preset profiles (casual, competitive, speedrun)
4. Add setting for rotation system
5. Add setting for ghost piece opacity
6. Add setting for grid line color/brightness
7. Cloud sync with user accounts
