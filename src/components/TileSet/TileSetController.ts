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
          error: `Scrabble tile set not found for language '${language}'.`,
        });
      }
    });

    return this.router;
  }
}
