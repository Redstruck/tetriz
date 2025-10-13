# Consecutive Piece Prevention System

## Overview
Enhanced the Tetris piece generation system to prevent the same piece type from spawning too many times in a row, improving gameplay variety and reducing frustration.

## Changes Made

### Enhanced PieceBag Class (`src/utils/tetrisShapes.ts`)

#### New Properties:
- `recentPieces`: Array tracking the last 4 pieces generated
- `MAX_CONSECUTIVE`: Maximum allowed consecutive occurrences (set to 2)
- `RECENT_HISTORY_SIZE`: Size of the recent pieces history (set to 4)

#### New Methods:
- `countConsecutiveSamePieces()`: Counts how many consecutive pieces of the same type have been generated
- `getFilteredBag()`: Returns available pieces, filtering out pieces that would exceed the consecutive limit

#### Enhanced Logic:
1. **Consecutive Tracking**: The system now tracks the last few pieces generated
2. **Smart Filtering**: When generating a new piece, if the last piece type has already appeared consecutively for the maximum allowed times, it's temporarily filtered out from selection
3. **Fallback Safety**: If filtering would remove all available pieces (edge case), the system falls back to the full bag to ensure gameplay continues
4. **History Management**: Maintains a rolling window of recent pieces to make intelligent decisions

## Benefits

### Improved Gameplay Experience:
- **Reduced Frustration**: Players won't get stuck with the same piece type repeatedly
- **Better Variety**: More diverse piece sequences create more interesting gameplay
- **Maintained Randomness**: Still uses the proven bag-based system for fair distribution
- **Performance**: Minimal computational overhead

### Technical Advantages:
- **Configurable**: Easy to adjust `MAX_CONSECUTIVE` value if needed
- **Mode Support**: Works seamlessly with regular, extra, and speedrun game modes
- **Backward Compatible**: No breaking changes to existing game logic

## Configuration

To adjust the consecutive piece prevention:

```typescript
private readonly MAX_CONSECUTIVE = 2; // Change this to allow more/fewer consecutive pieces
private readonly RECENT_HISTORY_SIZE = 4; // Adjust history tracking window
```

## Example Behavior

**Before**: I, I, I, I, T, S, I, I, I (too many I pieces in a row)
**After**: I, I, T, S, Z, L, I, J, O (maximum 2 consecutive I pieces)

This enhancement maintains the fair distribution of the bag system while ensuring a more enjoyable and varied playing experience.
