// External imports for server setup and dependencies
import express, {Express} from 'express';
import morgan from 'morgan';
import 'reflect-metadata'; // tsyringe
import mongoose from 'mongoose';
import {container} from 'tsyringe';
import errorHandler from '@src/middleware/errorHandler';

// Configuration imports
import configureSwagger from '@config/swagger.config';

// Interfaces imports
import {ITileSet} from '@components/TileSet/interfaces/TileSet.interface';

// Schemas imports
import tileSetSchema from '@components/TileSet/schemas/TileSet.schema';

// Controllers imports
import TileSetController from '@src/components/TileSet/TileSet.controller';

// Open connection with database
const mongoURI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/scrabble_toolkit';

(async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Successfully connected to MongoDB');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('MongoDB connection failed: ' + error.message);
    } else {
      console.error('MongoDB connection failed with unknown error:', error);
    }
  }
})();

// Register models
const TileSetModel = mongoose.model<ITileSet>('TileSet', tileSetSchema);
container.register('TILESET_MODEL', {useValue: TileSetModel});

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
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
