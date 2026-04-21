# Tres en Raya — TypeScript + Node.js

Juego multisesión de Tres en Raya con backend en Express y TypeScript, listo para CI/CD.

## Tecnologías

- **TypeScript 5** — tipado estricto de extremo a extremo
- **Node.js 20 + Express** — servidor HTTP con API REST
- **Jest + Supertest** — tests unitarios e integración con cobertura ≥ 80 %
- **ESLint** — linting
- **Docker** — imagen lista para producción
- **GitHub Actions** — pipeline CI/CD automático

## Inicio rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Modo desarrollo (sin compilar)
npm run dev

# 3. Compilar y ejecutar producción
npm run build && npm start
```

Abre http://localhost:3000 en el navegador.

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor en modo desarrollo con ts-node |
| `npm run build` | Compila TypeScript a dist/ |
| `npm start` | Ejecuta el build compilado |
| `npm test` | Tests con cobertura |
| `npm run lint` | Linting con ESLint |
| `npm run ci` | Lint + build + tests (igual que el pipeline) |

## API REST

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/game/:sessionId` | Obtener estado de la partida |
| POST | `/api/game/:sessionId/move` | Realizar jugada `{ cellIndex: 0-8 }` |
| POST | `/api/game/:sessionId/reset` | Reiniciar partida |

Cada `sessionId` es una partida independiente, permitiendo múltiples partidas simultáneas.

## Docker

```bash
docker build -t tictactoe .
docker run -p 3000:3000 tictactoe
```

## CI/CD con GitHub Actions

El pipeline en `.github/workflows/ci.yml` ejecuta automáticamente en cada push:

1. **Lint** → `npm run lint`
2. **Build** → `npm run build`
3. **Test** → `npm test` (cobertura ≥ 80 %)
4. **Deploy** → (activar el proveedor de tu elección)

### Despliegue en Render (gratuito)

1. Crea una cuenta en [render.com](https://render.com)
2. "New Web Service" → conecta tu repositorio
3. Build command: `npm run build`
4. Start command: `npm start`
5. Copia el **Deploy Hook URL** de Render
6. Añade el secreto `RENDER_DEPLOY_HOOK_URL` en GitHub → Settings → Secrets
7. Descomenta el paso de Render en `ci.yml`

### Despliegue en Railway

1. Crea una cuenta en [railway.app](https://railway.app)
2. Conecta el repositorio
3. Copia el **RAILWAY_TOKEN**
4. Añádelo como secreto en GitHub
5. Descomenta el paso de Railway en `ci.yml`

## Estructura del proyecto

```
tictactoe/
├── src/
│   ├── game.ts          # Lógica pura del juego (sin dependencias)
│   └── server.ts        # Servidor Express + API REST
├── tests/
│   ├── game.test.ts     # Tests unitarios de la lógica
│   └── server.test.ts   # Tests de integración de la API
├── public/
│   └── index.html       # Frontend completo (vanilla JS)
├── .github/
│   └── workflows/
│       └── ci.yml       # Pipeline CI/CD
├── Dockerfile
├── tsconfig.json
├── jest.config.ts
└── .eslintrc.json
```
