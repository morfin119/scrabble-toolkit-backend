import express, {Express} from 'express';
import morgan from 'morgan';
import configureSwagger from '@config/swagger.config';

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

// Create an instance of an express app
const app: Express = express();

// Configure Swagger documentation
configureSwagger(app);

// Register morgan middleware
app.use(morgan('tiny'));

// Define routes

// Start the server
startServer(app);
