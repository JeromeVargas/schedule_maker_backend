import { NextFunction, Request, Response } from "express";

import CustomAPIError from "../errors/custom-error";
import { StatusCodes } from "http-status-codes";
import { ValidationError } from "express-validator";

interface ExpressError extends Error {
  statusCode?: number;
  type?: string;
  errors?: ValidationError;
  code?: number;
}

export default function errorHandlerMiddleware(
  err: ExpressError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // The error is part of the set custom error
  if (err instanceof CustomAPIError) {
    return res
      .status(err.statusCode)
      .json({ msg: err.message, success: false });
  }
  // The error is part express-validator error
  if (err?.errors && Array.isArray(err.errors)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: err?.errors, success: false });
  }
  // The error is part of a JSON badly formatted req body
  if (
    err instanceof SyntaxError &&
    err.statusCode === 400 &&
    err.type === "entity.parse.failed" &&
    "body" in err
  ) {
    return res.status(400).json({
      msg: "Please make sure the submission is properly formatted",
      success: false,
    });
  }
  // Fall out error
  return res.status(StatusCodes.CONFLICT).json({
    msg: "Something unexpected happened, please try again",
    info: process.env.NODE_ENV === "production" ? "Internal error" : err,
    success: false,
  });
}
