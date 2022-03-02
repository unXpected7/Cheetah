import * as express from "express";

export const err404 = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (!req.route) {
    return res.status(404).json({
      msg: "Route not found",
    });
  }
  next();
};

export const invalidJson = (
  err: any,
  _: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (err.status === 400)
    return res.status(err.status).json({
      msg: "Invalid JSON",
    });
  return next(err);
};
