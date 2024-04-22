const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Scrabble Toolkit RESTful API',
      version: '0.1.0'
    }
  },
  apis: ['./src/**/*.js']
};

/**
 * Configures Swagger for the application.
 * Sets up Swagger UI middleware to serve API documentation.
 *
 * @param {Express} app Express application instance.
 * @returns {void}
 */
function configureSwagger (app) {
  // Initialize swagger-jsdoc -> returns validated swagger spec in json format
  const swaggerSpec = swaggerJSDoc(swaggerOptions);

  // Configure Swagger UI middleware
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  console.log('API documentation available at {root_url}/api-docs');
}

module.exports = configureSwagger;
