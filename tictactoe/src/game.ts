export type Player = 'X' | 'O';
export type Cell = Player | null;
export type Board = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell];

export interface GameState {
  board: Board;
  currentPlayer: Player;
  winner: Player | null;
  isDraw: boolean;
  isOver: boolean;
  winLine: number[] | null;
}

export interface MoveResult {
  success: boolean;
  error?: string;
  state: GameState;
}

const WIN_LINES: number[][] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

export function createInitialState(): GameState {
  return {
    board: [null, null, null, null, null, null, null, null, null],
    currentPlayer: 'X',
    winner: null,
    isDraw: false,
    isOver: false,
    winLine: null,
  };
}

export function checkWinner(board: Board): { winner: Player; line: number[] } | null {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as Player, line: [a, b, c] };
    }
  }
  return null;
}

export function checkDraw(board: Board): boolean {
  return board.every((cell) => cell !== null) && !checkWinner(board);
}

export function applyMove(state: GameState, cellIndex: number): MoveResult {
  if (state.isOver) {
    return { success: false, error: 'Game is already over', state };
  }
  if (cellIndex < 0 || cellIndex > 8) {
    return { success: false, error: 'Invalid cell index (must be 0–8)', state };
  }
  if (state.board[cellIndex] !== null) {
    return { success: false, error: 'Cell is already taken', state };
  }

  const newBoard = [...state.board] as Board;
  newBoard[cellIndex] = state.currentPlayer;

  const winResult = checkWinner(newBoard);
  const isDraw = !winResult && checkDraw(newBoard);

  const newState: GameState = {
    board: newBoard,
    currentPlayer: state.currentPlayer === 'X' ? 'O' : 'X',
    winner: winResult ? winResult.winner : null,
    isDraw,
    isOver: !!winResult || isDraw,
    winLine: winResult ? winResult.line : null,
  };

  return { success: true, state: newState };
}
