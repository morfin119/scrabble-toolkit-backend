const express = require('express');
const morgan = require('morgan');
const configureSwagger = require('./config/swagger.config');

/**
 * Starts the sever by listening on the specified port or a default port if not
 * provided.
 *
 * @param {Express} app The express app instance to start the server with.
 * @returns {void}
 */
function startServer (app) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

// Create an instance of an express app
const app = express();

// Configure Swagger documentation
configureSwagger(app);

// Register morgan middleware
app.use(morgan('tiny'));

// Define routes

// Start the server
startServer(app);
