# Speed Testing Instructions

## Testing Speed Selection Functionality

### 1. **Visual Test in Browser**
1. Open http://localhost:8107
2. Open browser Developer Tools (F12)
3. Go to Console tab

### 2. **Test Speed Selection Before Game Starts**
1. Click on different speed buttons (Slow/Normal/Fast)
2. Check console for messages like:
   ```
   🎮 Speed changed to: 1500ms (Slow)
   🎯 Updated dropTime: 1500ms (level: 1)
   ```

### 3. **Test Speed During Game**
1. Start the game by clicking "START GAME"
2. Check console for:
   ```
   🚀 Starting game with baseDropSpeed: [current speed]ms
   ```
3. Observe pieces falling at different speeds:
   - **Slow (1500ms)**: Pieces fall every ~1.5 seconds
   - **Normal (1000ms)**: Pieces fall every ~1 second  
   - **Fast (500ms)**: Pieces fall every ~0.5 seconds

### 4. **Test Speed Change During Game**
1. During gameplay, pause the game (P key or PAUSE button)
2. Try changing speed - buttons should be enabled during pause
3. Resume game and observe new speed

### 5. **Console Log Verification**
Watch for these console messages:
- `⏱️ Piece dropped! Time since last drop: [X]ms, Required: [Y]ms`
- The time between drops should match the selected speed

### 6. **Expected Behavior**
- ✅ Speed buttons work before game starts
- ✅ Speed buttons show correct active state (highlighted when selected)
- ✅ Game starts with selected speed
- ✅ Pieces fall at visually different speeds for each setting
- ✅ Speed can be changed during pause
- ✅ Level progression still affects speed (gets faster as level increases)

### 7. **Debug Console Commands**
In browser console, you can also test:
```javascript
// Check current game state (if exposed)
console.log("Testing speed functionality");
```
