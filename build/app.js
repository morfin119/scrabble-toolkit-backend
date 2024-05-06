"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_config_1 = __importDefault(require("@config/swagger.config"));
/**
 * Starts the sever by listening on the specified port or a default port if not
 * provided.
 *
 * @param app
 * The express app instance to start the server with.
 * @returns
 */
function startServer(app) {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
}
// Create an instance of an express app
const app = (0, express_1.default)();
// Configure Swagger documentation
(0, swagger_config_1.default)(app);
// Register morgan middleware
app.use((0, morgan_1.default)('tiny'));
// Define routes
// Start the server
startServer(app);
//# sourceMappingURL=app.js.map