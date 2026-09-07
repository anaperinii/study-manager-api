import express from 'express';
import type { Express } from 'express';
import buildContainer from './container';
import errorHandler from './presentation/middlewares/errorHandler';
import notFoundHandler from './presentation/middlewares/notFoundHandler';
import buildRoutes from './presentation/routes';

function createApp(): Express {
  const app = express();

  app.use(express.json());
  app.use('/api', buildRoutes(buildContainer()));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export default createApp;
