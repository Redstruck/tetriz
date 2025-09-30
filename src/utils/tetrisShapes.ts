import { PieceType } from '../types/tetris';

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

export const PIECE_TYPES: PieceType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

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

// 7-bag random piece generator for better distribution
class PieceBag {
  private bag: PieceType[] = [];
  
  private shuffleBag(): void {
    this.bag = [...PIECE_TYPES];
    // Fisher-Yates shuffle algorithm
    for (let i = this.bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
    }
  }
  
  getNextPiece(): PieceType {
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

export const getRandomPieceType = (): PieceType => {
  return pieceBag.getNextPiece();
};

export const resetPieceBag = (): void => {
  pieceBag.reset();
};