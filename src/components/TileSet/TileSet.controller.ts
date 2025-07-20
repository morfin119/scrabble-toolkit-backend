import {Router, Request, Response} from 'express';
import {autoInjectable} from 'tsyringe';
import {param, validationResult} from 'express-validator';
import TileSetService from '@components/TileSet/TileSet.service';

// Middleware for language validation
const validateLanguage = [
  param('language')
    .exists()
    .withMessage('Language parameter is required.')
    .isISO6391()
    .withMessage('Language parameter must be a valid ISO 639-1 code.'),
];

// Middleware for name validation
const validateName = [
  param('name').exists().withMessage('Name parameter is required.'),
];

@autoInjectable()
export default class TileSetController {
  private tileSetService: TileSetService;
  private router: Router;

  constructor(tileSetService: TileSetService) {
    this.tileSetService = tileSetService;
    this.router = Router();
  }

  routes(): Router {
    this.router.get('/', async (req: Request, res: Response) => {
      const tileSets = await this.tileSetService.findAll();
      return res.status(200).json(tileSets);
    });

    this.router.get(
      '/name/:name',
      validateName,
      async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({
            message: errors.array()[0].msg,
          });
        }

        const {name} = req.params;
        const tileSet = await this.tileSetService.findByName(
          name.toLowerCase()
        );

        if (tileSet) {
          return res.status(200).json(tileSet);
        } else {
          return res.status(404).json({
            message: `No Scrabble tile set found with name '${name}'.`,
          });
        }
      }
    );

    this.router.get(
      '/language/:language',
      validateLanguage,
      async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({
            message: errors.array()[0].msg,
          });
        }

        const {language} = req.params;
        const tileSets = await this.tileSetService.findByLanguage(
          language.toLowerCase()
        );

        return res.status(200).json(tileSets);
      }
    );

    return this.router;
  }
}
