import 'dotenv/config';

import createApp from './app';
import { disconnectDatabase } from './infrastructure/database/prismaClient';

const PORT = Number(process.env.PORT) || 3000;

const server = createApp().listen(PORT, () => {
  console.log(`StudyManager API listening on http://localhost:${PORT}/api`);
});

function shutdown(signal: NodeJS.Signals): void {
  console.log(`\n${signal} received, shutting down.`);
  server.close(() => {
    void disconnectDatabase().then(() => process.exit(0));
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
