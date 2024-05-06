"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swaggerOptions = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'Scrabble Toolkit RESTful API',
            version: '0.1.0',
        },
    },
    apis: ['./src/**/*.js', './src/**/*.ts'],
};
/**
 * Configures Swagger for the application.
 * Sets up Swagger UI middleware to serve API documentation.
 * @param {Express} app Express application instance.
 * @returns {void}
 */
function configureSwagger(app) {
    // Initialize swagger-jsdoc -> returns validated swagger spec in json format.
    const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
    // Configure Swagger UI middleware
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
    console.log('API documentation available at {root_url}/api-docs');
}
exports.default = configureSwagger;
//# sourceMappingURL=swagger.config.js.map