import { createInitialState, applyMove, checkWinner, checkDraw, Board } from '../src/game';

describe('createInitialState', () => {
  it('should create an empty board', () => {
    const state = createInitialState();
    expect(state.board.every(c => c === null)).toBe(true);
    expect(state.currentPlayer).toBe('X');
    expect(state.isOver).toBe(false);
    expect(state.winner).toBeNull();
    expect(state.isDraw).toBe(false);
  });
});

describe('checkWinner', () => {
  it('should detect row win', () => {
    const board: Board = ['X','X','X', null,null,null, null,null,null];
    expect(checkWinner(board)?.winner).toBe('X');
    expect(checkWinner(board)?.line).toEqual([0,1,2]);
  });

  it('should detect column win', () => {
    const board: Board = ['O',null,null, 'O',null,null, 'O',null,null];
    expect(checkWinner(board)?.winner).toBe('O');
    expect(checkWinner(board)?.line).toEqual([0,3,6]);
  });

  it('should detect diagonal win', () => {
    const board: Board = ['X',null,null, null,'X',null, null,null,'X'];
    expect(checkWinner(board)?.winner).toBe('X');
  });

  it('should return null for no winner', () => {
    const board: Board = ['X','O','X', 'X','O','O', 'O','X',null];
    expect(checkWinner(board)).toBeNull();
  });
});

describe('checkDraw', () => {
  it('should detect a draw', () => {
    const board: Board = ['X','O','X', 'X','O','O', 'O','X','X'];
    expect(checkDraw(board)).toBe(true);
  });

  it('should return false if board is not full', () => {
    const board: Board = ['X','O','X', 'X','O','O', 'O','X',null];
    expect(checkDraw(board)).toBe(false);
  });

  it('should return false if there is a winner', () => {
    const board: Board = ['X','X','X', 'O','O',null, null,null,null];
    expect(checkDraw(board)).toBe(false);
  });
});

describe('applyMove', () => {
  it('should place a piece on valid move', () => {
    const state = createInitialState();
    const result = applyMove(state, 4);
    expect(result.success).toBe(true);
    expect(result.state.board[4]).toBe('X');
    expect(result.state.currentPlayer).toBe('O');
  });

  it('should reject move on taken cell', () => {
    const state = createInitialState();
    const after = applyMove(state, 0);
    const result = applyMove(after.state, 0);
    expect(result.success).toBe(false);
    expect(result.error).toContain('already taken');
  });

  it('should reject invalid cell index', () => {
    const state = createInitialState();
    expect(applyMove(state, -1).success).toBe(false);
    expect(applyMove(state, 9).success).toBe(false);
  });

  it('should reject move when game is over', () => {
    let state = createInitialState();
    [0,3,1,4,2].forEach(i => { state = applyMove(state, i).state; });
    expect(state.isOver).toBe(true);
    expect(applyMove(state, 5).success).toBe(false);
  });

  it('should detect win after move', () => {
    let state = createInitialState();
    [0,3,1,4,2].forEach(i => { state = applyMove(state, i).state; });
    expect(state.winner).toBe('X');
    expect(state.winLine).toEqual([0,1,2]);
  });

  it('should detect draw after move', () => {
    let state = createInitialState();
    [0,1,2,4,3,5,7,6,8].forEach(i => { state = applyMove(state, i).state; });
    expect(state.isDraw).toBe(true);
    expect(state.winner).toBeNull();
  });
});
