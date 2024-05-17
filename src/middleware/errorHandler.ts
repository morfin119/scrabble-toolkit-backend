import {Request, Response, NextFunction} from 'express';

function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction // eslint-disable-line
) {
  console.log(err.stack);
  res.status(500).json({error: 'Internal Server Error'});
}

export default errorHandler;
