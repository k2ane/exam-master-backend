import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/error/appError";
import { log } from "../app";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  log.debug(`错误, ${err}`);
  // 处理JSON格式错误
  if (err.message === "Unexpected end of JSON input")
    err = new AppError(400, "提交的数据有误，请修改后重试");
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    // stack: err.stack, // 生产环境建议隐藏 stack
  });
};

export { globalErrorHandler };
