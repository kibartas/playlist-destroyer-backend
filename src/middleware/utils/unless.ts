import { Request, Response, NextFunction } from 'express';

export const unless = (
  path: string,
  middleware: (req: Request, res: Response, next: NextFunction) => void,
): ((req: Request, res: Response, next: NextFunction) => void
) => (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (path === req.path) {
    next();
  }
  return middleware(req, res, next);
};

export default unless;
