import CustomAPIError from "./custom-error";
import { StatusCodes } from "http-status-codes";

export default class UnauthenticatedError extends CustomAPIError {
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}
