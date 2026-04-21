import request from 'supertest';
import { app } from '../src/server';

describe('GET /api/health', () => {
  it('should return ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('GET /api/game/:sessionId', () => {
  it('should create and return a new game', async () => {
    const res = await request(app).get('/api/game/test-session-1');
    expect(res.status).toBe(200);
    expect(res.body.state.board).toHaveLength(9);
    expect(res.body.state.currentPlayer).toBe('X');
  });
});

describe('POST /api/game/:sessionId/move', () => {
  it('should accept a valid move', async () => {
    const session = 'test-move-1';
    await request(app).get(`/api/game/${session}`);
    const res = await request(app)
      .post(`/api/game/${session}/move`)
      .send({ cellIndex: 4 });
    expect(res.status).toBe(200);
    expect(res.body.state.board[4]).toBe('X');
  });

  it('should reject invalid cellIndex type', async () => {
    const res = await request(app)
      .post('/api/game/test-bad-type/move')
      .send({ cellIndex: 'abc' });
    expect(res.status).toBe(400);
  });

  it('should reject out of range cell', async () => {
    const session = 'test-range-1';
    await request(app).get(`/api/game/${session}`);
    const res = await request(app)
      .post(`/api/game/${session}/move`)
      .send({ cellIndex: 9 });
    expect(res.status).toBe(400);
  });
});

describe('POST /api/game/:sessionId/reset', () => {
  it('should reset game to initial state', async () => {
    const session = 'test-reset-1';
    await request(app).post(`/api/game/${session}/move`).send({ cellIndex: 0 });
    const res = await request(app).post(`/api/game/${session}/reset`);
    expect(res.status).toBe(200);
    expect(res.body.state.board.every((c: unknown) => c === null)).toBe(true);
    expect(res.body.state.currentPlayer).toBe('X');
  });
});
