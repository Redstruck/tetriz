export type PieceType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export type Board = string[][];

export interface Piece {
  type: PieceType;
  x: number;
  y: number;
  shape: number[][];
  rotation: number;
}

export interface GameState {
  board: Board;
  currentPiece: Piece | null;
  nextPiece: Piece | null;
  holdPiece: Piece | null;
  holdUsed: boolean;
  score: number;
  level: number;
  linesCleared: number;
  gameOver: boolean;
  gameStarted: boolean;
  paused: boolean;
  clearedRows: number[];
  dropTime: number;
  lastDrop: number;
}