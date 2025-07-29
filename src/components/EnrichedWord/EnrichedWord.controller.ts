import {Router, Request, Response, NextFunction} from 'express';
import {autoInjectable} from 'tsyringe';
import {param, validationResult} from 'express-validator';
import EnrichedWordService from '@components/EnrichedWord/EnrichedWord.service';

// Middleware for pattern param validation
const validatePattern = [
  param('pattern')
    .exists()
    .withMessage("'validatePattern' query parameter is required")
    .toUpperCase()
    .isString()
    .notEmpty()
    .withMessage("'validatePattern' query parameter must not be empty"),
];

// Middleware for word list name
const validateWordListName = [
  param('wordListName')
    .exists()
    .withMessage("'wordListName' query parameter is required")
    .toUpperCase()
    .isString()
    .notEmpty()
    .withMessage("'wordListName' query parameter must not be empty"),
];

// Middleware for tile-set name validation
const validateTileSetName = [
  param('tileSetName')
    .exists()
    .withMessage('tileSetName parameter is required.')
    .toUpperCase()
    .isString()
    .notEmpty()
    .withMessage("'tileSetName' query parameter must not be empty"),
];

// Middleware for filter validation
const validateFilters = [
  param('minLength')
    .optional()
    .isInt({min: 1})
    .withMessage("'minLength' query parameter must be a positive integer."),
  param('maxLength')
    .optional()
    .isInt({min: 1})
    .withMessage("'maxLength' query parameter must be a positive integer."),
  param('minPointValue')
    .optional()
    .isInt({min: 0})
    .withMessage(
      "'minPointValue' query parameter must be a non-negative integer."
    ),
  param('maxPointValue')
    .optional()
    .isInt({min: 0})
    .withMessage(
      "'maxPointValue' query parameter must be a non-negative integer."
    ),
];

@autoInjectable()
export default class EnrichedWordController {
  private enrichedWordService: EnrichedWordService;
  private router: Router;

  constructor(enrichedWordService: EnrichedWordService) {
    this.enrichedWordService = enrichedWordService;
    this.router = Router();
  }

  routes(): Router {
    this.router.get(
      '/:wordListName/:tileSetName/:pattern',
      validateWordListName,
      validateTileSetName,
      validatePattern,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            return res.status(400).json({
              message: errors.array()[0].msg,
            });
          }

          const {wordListName, tileSetName, pattern} = req.params;

          const result = await this.enrichedWordService.findWord(
            pattern as string,
            wordListName as string,
            tileSetName as string
          );

          if (!result) {
            return res.status(404).json({
              message: `Word '${pattern}' not found inside '${wordListName}' word list using '${tileSetName}' tile set.`,
            });
          } else {
            return res.status(200).json(result);
          }
        } catch (error: unknown) {
          if (error instanceof Error) {
            return next(error);
          }
        }
      }
    );

    this.router.get(
      '/anagrams/:wordListName/:tileSetName/:pattern',
      validateWordListName,
      validateTileSetName,
      validatePattern,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            return res.status(400).json({
              message: errors.array()[0].msg,
            });
          }

          const {wordListName, tileSetName, pattern} = req.params;

          const result = await this.enrichedWordService.findAnagrams(
            pattern as string,
            wordListName as string,
            tileSetName as string
          );

          return res.status(200).json(result);
        } catch (error: unknown) {
          return next(error);
        }
      }
    );
    return this.router;
  }
}
