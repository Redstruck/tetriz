import { PieceType, ExtraPieceType } from '../types/tetris';

export const PIECES: Record<PieceType, { shape: number[][], color: string }> = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    color: 'tetris-i'
  },
  O: {
    shape: [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0]
    ],
    color: 'tetris-o'
  },
  T: {
    shape: [
      [0, 0, 0, 0],
      [0, 1, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0]
    ],
    color: 'tetris-t'
  },
  S: {
    shape: [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0]
    ],
    color: 'tetris-s'
  },
  Z: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0]
    ],
    color: 'tetris-z'
  },
  J: {
    shape: [
      [0, 0, 0, 0],
      [1, 0, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0]
    ],
    color: 'tetris-j'
  },
  L: {
    shape: [
      [0, 0, 0, 0],
      [0, 0, 1, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0]
    ],
    color: 'tetris-l'
  }
};

// Extra mode pieces based on the provided image
export const EXTRA_PIECES: Record<ExtraPieceType, { shape: number[][], color: string }> = {
  // Long I piece (5 blocks)
  I5: {
    shape: [
      [0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0]
    ],
    color: 'tetris-i'
  },
  // Large L shapes
  L3: {
    shape: [
      [0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0]
    ],
    color: 'tetris-l'
  },
  L4: {
    shape: [
      [0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0]
    ],
    color: 'tetris-l'
  },
  // Large J shapes
  J3: {
    shape: [
      [0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0]
    ],
    color: 'tetris-j'
  },
  J4: {
    shape: [
      [0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0]
    ],
    color: 'tetris-j'
  },
  // Large T shapes
  T3: {
    shape: [
      [0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0],
      [1, 1, 1, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0]
    ],
    color: 'tetris-t'
  },
  T4: {
    shape: [
      [0, 0, 0, 0, 0],
      [1, 1, 1, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0]
    ],
    color: 'tetris-t'
  },
  // U shape
  U: {
    shape: [
      [0, 0, 0, 0, 0],
      [1, 0, 1, 0, 0],
      [1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
    ],
    color: 'tetris-o'
  },
  // Y shape
  Y: {
    shape: [
      [0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0],
      [1, 1, 0, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 1, 0, 0, 0]
    ],
    color: 'tetris-z'
  },
  // F shape
  F: {
    shape: [
      [0, 0, 0, 0, 0],
      [0, 1, 1, 0, 0],
      [1, 1, 0, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0]
    ],
    color: 'tetris-s'
  },
  // P shape
  P: {
    shape: [
      [0, 0, 0, 0, 0],
      [1, 1, 0, 0, 0],
      [1, 1, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
    ],
    color: 'tetris-p'
  },
  // N shape
  N: {
    shape: [
      [0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 1, 0, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 1, 0, 0, 0]
    ],
    color: 'tetris-z'
  },
  // W shape
  W: {
    shape: [
      [0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 1, 0, 0, 0],
      [0, 1, 1, 0, 0],
      [0, 0, 0, 0, 0]
    ],
    color: 'tetris-s'
  },
  // B shape (Brown short L-shape)
  B: {
    shape: [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0]
    ],
    color: 'tetris-b'
  }
};

export const PIECE_TYPES: PieceType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
export const EXTRA_PIECE_TYPES: ExtraPieceType[] = ['I5', 'L3', 'L4', 'J3', 'J4', 'T3', 'T4', 'U', 'Y', 'F', 'P', 'N', 'W', 'B'];

export const rotatePiece = (shape: number[][]): number[][] => {
  const size = shape.length;
  const rotated = Array(size).fill(null).map(() => Array(size).fill(0));
  
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      rotated[j][size - 1 - i] = shape[i][j];
    }
  }
  
  return rotated;
};

// Bag random piece generator for better distribution
class PieceBag {
  private bag: (PieceType | ExtraPieceType)[] = [];
  private gameMode: 'regular' | 'extra' = 'regular';
  
  setGameMode(mode: 'regular' | 'extra'): void {
    this.gameMode = mode;
    this.bag = []; // Reset bag when mode changes
  }
  
  private shuffleBag(): void {
    if (this.gameMode === 'extra') {
      // Mix regular and extra pieces for extra mode
      this.bag = [...PIECE_TYPES, ...EXTRA_PIECE_TYPES];
    } else {
      this.bag = [...PIECE_TYPES];
    }
    
    // Fisher-Yates shuffle algorithm
    for (let i = this.bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
    }
  }
  
  getNextPiece(): PieceType | ExtraPieceType {
    if (this.bag.length === 0) {
      this.shuffleBag();
    }
    return this.bag.pop()!;
  }
  
  reset(): void {
    this.bag = [];
  }
}

// Global piece bag instance
const pieceBag = new PieceBag();

export const getRandomPieceType = (gameMode: 'regular' | 'extra' | 'speedrun' = 'regular'): PieceType | ExtraPieceType => {
  // Speedrun mode uses the same pieces as regular mode
  const effectiveMode = gameMode === 'speedrun' ? 'regular' : gameMode;
  pieceBag.setGameMode(effectiveMode);
  return pieceBag.getNextPiece();
};

export const resetPieceBag = (gameMode: 'regular' | 'extra' | 'speedrun' = 'regular'): void => {
  // Speedrun mode uses the same pieces as regular mode
  const effectiveMode = gameMode === 'speedrun' ? 'regular' : gameMode;
  pieceBag.setGameMode(effectiveMode);
  pieceBag.reset();
};

// Helper function to get piece data
export const getPieceData = (pieceType: PieceType | ExtraPieceType): { shape: number[][], color: string } => {
  if (pieceType in PIECES) {
    return PIECES[pieceType as PieceType];
  } else {
    return EXTRA_PIECES[pieceType as ExtraPieceType];
  }
};