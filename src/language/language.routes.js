const express = require('express');
const router = express.Router();
const languagesController = require('./language.controller');

/**
 * @swagger
 * /api/languages:
 *   get:
 *     summary: Get available languages.
 *     description:
 *       Retrieve a list of available languages for use in the Scrabble toolkit
 *       API.
 *     responses:
 *       '200':
 *         description: A list of available languages.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description:
 *                     Indicates the status of the request.
 *                   example: "success"
 *                 data:
 *                   type: array
 *                   description:
 *                     A list of available languages represented by ISO 639-1
 *                     codes.
 *                   items:
 *                     type: string
 *                   example: ["en", "es", "fr"]
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Description of the error.
 *                   example:
 *                     Languages could not be loaded due to a server error.
 */
router.get('/', languagesController.getAvailableLanguages);

module.exports = router;
