import {Router, Request, Response} from 'express';
import {injectable} from 'tsyringe';
import {check, validationResult} from 'express-validator';
import TileSetService from '@components/TileSet/TileSetService';

// Middleware for language validation
const validateLanguage = [
  check('language')
    .exists()
    .withMessage('Language parameter is required.')
    .isISO6391()
    .withMessage('Language parameter must be a valid ISO 639-1 code.'),
];

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
      return res.status(200).json(tileSets);
    });

    this.router.get(
      '/:language',
      validateLanguage,
      (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({
            message: errors.array()[0].msg,
          });
        }

        const {language} = req.params;
        const tileSet = this.tileSetService.getTileSet(language.toLowerCase());

        if (tileSet) {
          return res.status(200).json(tileSet);
        } else {
          return res.status(404).json({
            message: `Scrabble tile set not found for language '${language}.`,
          });
        }
      }
    );

    return this.router;
  }
}
