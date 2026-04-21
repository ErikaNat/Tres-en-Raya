import express, { Request, Response } from 'express';
import path from 'path';
import { createInitialState, applyMove, GameState } from './game';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

const sessions = new Map<string, GameState>();

function getOrCreateSession(id: string): GameState {
  if (!sessions.has(id)) {
    sessions.set(id, createInitialState());
  }
  return sessions.get(id) as GameState;
}

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/game/:sessionId', (req: Request, res: Response) => {
  const state = getOrCreateSession(req.params.sessionId);
  res.json({ state });
});

app.post('/api/game/:sessionId/move', (req: Request, res: Response) => {
  const { cellIndex } = req.body as { cellIndex: unknown };

  if (typeof cellIndex !== 'number') {
    res.status(400).json({ error: 'cellIndex must be a number' });
    return;
  }

  const state = getOrCreateSession(req.params.sessionId);
  const result = applyMove(state, cellIndex);

  if (!result.success) {
    res.status(400).json({ error: result.error });
    return;
  }

  sessions.set(req.params.sessionId, result.state);
  res.json({ state: result.state });
});

app.post('/api/game/:sessionId/reset', (req: Request, res: Response) => {
  const newState = createInitialState();
  sessions.set(req.params.sessionId, newState);
  res.json({ state: newState });
});

app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

export { app };

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Tres en Raya running on http://localhost:${PORT}`);
  });
}
