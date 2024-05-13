import {Router, Request, Response} from 'express';
import {injectable} from 'tsyringe';
import TileSetService from '@components/TileSet/TileSetService';

@injectable()
export default class TileSetController {
  private tileSetService: TileSetService;
  private router: Router;

  constructor(tileSetService: TileSetService) {
    this.tileSetService = tileSetService;
    this.router = Router();
  }

  routes(): Router {
    this.router.get('/', (req: Request, res: Response) => {
      const tileSets = this.tileSetService.getAllTileSets();
      return res.status(200).json({
        status: 'success',
        data: tileSets,
      });
    });

    this.router.get('/:language', (req: Request, res: Response) => {
      const {language} = req.params;

      if (!/^[a-zA-Z]{2}$/.test(language)) {
        return res.status(400).json({
          error: 'Language parameter must be a valid ISO 3166-1 alpha-2 code.',
        });
      }

      const tileSet = this.tileSetService.getTileSet(language.toLowerCase());

      if (tileSet) {
        return res.json({
          status: 'success',
          data: tileSet,
        });
      } else {
        return res.status(404).json({
          error: `Scrabble tile set not found for language '${language}'`,
        });
      }
    });

    return this.router;
  }
}

/**
 * @swagger
 * tags:
 *   name: Tile Sets
 *
 * components:
 *   schemas:
 *     TileSet:
 *       type: object
 *       properties:
 *         language:
 *           type: string
 *           required: true
 *         tiles:
 *           type: object
 *           required: true
 *           additionalProperties:
 *             type: object
 *             required: true
 *             properties:
 *               points:
 *                 type: integer
 *               count:
 *                 type: integer
 *           minProperties: 1
 *
 * paths:
 *   /api/tilesets:
 *     get:
 *       summary: Retrieve all available Scrabble tile sets.
 *       description: |
 *         Retrieve the available Scrabble tile sets.
 *
 *         A tile set refers
 *         to the collection of individual letter tiles used in the game.
 *         Each tile has specific attributes like points and count.
 *         "points" represent the numerical value assigned to each tile,
 *         determining the score when placed on the game board.
 *         The "count" indicates how many of each letter tile are available for
 *         players to use during the game.
 *       tags:
 *         - Tile Sets
 *       responses:
 *         200:
 *           description: |
 *             Successful response. Returns an array of Scrabble tile sets.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                   data:
 *                     type: array
 *                     minItems: 1
 *                     uniqueItems: true
 *                     items:
 *                       $ref: '#/components/schemas/TileSet'
 *               example:
 *                 - status: success
 *                   data:
 *                     - language: en
 *                       tiles:
 *                         A:
 *                           points: 1
 *                           count: 9
 *                     - language: es
 *                       tiles:
 *                         A:
 *                           points: 1
 *                           count: 12
 *
 *   /api/tilesets/{language}:
 *     get:
 *       summary: Retrieves a Scrabble tile set based on the specified language.
 *       description: |
 *         Returns the Scrabble tile set for the specified language, if available.
 *       tags:
 *         - Tile Sets
 *       parameters:
 *         - in: path
 *           name: language
 *           required: true
 *           type: string
 *           description: The language code for the desired tile set.
 *       responses:
 *         200:
 *           description: |
 *             Successful response. Returns a single Scrabble tile set object.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                   data:
 *                     $ref: '#/components/schemas/TileSet'
 *               example:
 *                 language: en
 *                 tiles:
 *                   A:
 *                     points: 1
 *                     count: 9
 *         400:
 *           description: Invalid request. This error occurs when the language
 *             parameter is not a valid ISO 3166-1 alpha-2 code.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     description: A message indicating the error.
 *               example:
 *                 { "error": "Language parameter must be a valid ISO 3166-1 alpha-2 code." }
 *         404:
 *           description: Tile set not found for the provided language.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     description: A message indicating the error.
 *               example:
 *                 { "error": "Scrabble tile set not found for language 'en'" }
 *
 */
