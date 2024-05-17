import {Express} from 'express';
import fs from 'fs';
import yaml from 'js-yaml';
import swaggerUi, {JsonObject} from 'swagger-ui-express';

/**
 * Configures Swagger for the application.
 * Sets up Swagger UI middleware to serve API documentation.
 * @param app Express application instance.
 */
export default function configureSwagger(app: Express, documentPath: string) {
  try {
    const yamlFile = fs.readFileSync(documentPath, 'utf-8');
    const parsedYaml = yaml.load(yamlFile) as JsonObject;

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(parsedYaml));
    console.log('API documentation available at {root_url}/api-docs');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error configuring Swagger:', error.message);
      console.error('Stack trace:', error.stack);
    }
  }
}
