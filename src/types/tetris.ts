export type PieceType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';
export type ExtraPieceType = 'I5' | 'L3' | 'L4' | 'J3' | 'J4' | 'T3' | 'T4' | 'U' | 'Y' | 'F' | 'P' | 'N' | 'H' | 'W';

export type Board = string[][];

export interface Piece {
  type: PieceType | ExtraPieceType;
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
  // Speedrun mode specific
  greyBlocks?: { x: number; y: number }[];
  wavesCleared?: number;
  waveStartTime?: number;
  totalTime?: number;
}