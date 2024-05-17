// External imports for server setup and dependencies
import express, {Express} from 'express';
import morgan from 'morgan';
import 'reflect-metadata'; // tsyringe
import {container} from 'tsyringe';
import errorHandler from '@src/middleware/errorHandler';

// Configuration imports
import configureSwagger from '@config/swagger.config';

// Custom types imports
import {ScrabbleTileSet} from '@src/types';

// Data imports
import availableTileSets from '@utils/availableTileSets';

// Controllers imports
import TileSetController from '@components/TileSet/TileSetController';

/**
 * Starts the sever by listening on the specified port or a default port if not
 * provided.
 *
 * @param app
 * The express app instance to start the server with.
 * @returns
 */
function startServer(app: Express): void {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

// Register providers
container.register<ScrabbleTileSet[]>('AVAILABLE_TILESETS', {
  useValue: availableTileSets,
});

// Create an instance of an express app
const app: Express = express();

// Configure Swagger documentation
configureSwagger(
  app,
  process.env.SWAGGER_DOCS_PATH || './src/docs/swagger.yaml'
);

// Register morgan middleware
app.use(morgan('tiny'));

// Define routes
app.use('/api/tileSets', container.resolve(TileSetController).routes());

// Register the error handler middleware
app.use(errorHandler);

// Start the server
startServer(app);
