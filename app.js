const express = require('express');

const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

// Function to configure Swagger
function configureSwagger (app) {
  const swaggerOptions = {
    definition: {
      openapi: '3.1.0',
      info: {
        title: 'Scrabble Toolkit Backend',
        version: '0.1.0'
      }
    },
    apis: ['./routes/*.js']
  };

  // Initialize swagger-jsdoc -> returns validated swagger spec in json format.
  const swaggerSpec = swaggerJSDoc(swaggerOptions);

  // Configure Swagger UI middleware
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// Function to initialize Express app
function initializeApp () {
  const app = express();
  configureSwagger(app);
  return app;
}

// Function to start the server
function startServer (app) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

// Initialize the Express app
const app = initializeApp();

// Start the server
startServer(app);
