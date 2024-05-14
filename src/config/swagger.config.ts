import {Express} from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '@src/docs/swagger.json';

/**
 * Configures Swagger for the application.
 * Sets up Swagger UI middleware to serve API documentation.
 * @param app Express application instance.
 */
export default function configureSwagger(app: Express) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log('API documentation available at {root_url}/api-docs');
}
