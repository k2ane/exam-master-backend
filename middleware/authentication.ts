import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/auth/jwt";
import type { userPayload } from "../utils/auth/jwt";
import { AppError } from "../utils/error/appError";
import { log } from "../app";

// 扩展 Express 的 Request 类型，以便在后续处理中使用 user 信息
declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        role: string;
      };
    }
  }
}

const authenticationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 从请求头中获取Token, 格式-> "Authorization: Bearer <token>"
  const authHeader = req.headers.authorization;
  // 判断请求头中是否包含token信息, 格式-> "Bearer <token>", 若没有则返回401错误让用户先登录
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next(new AppError(401, "您似乎还未登录, 请先登录再尝试访问"));
  }
  // 用户请求头包含token信息, 获取token字符串
  // 使用空格将 "Bearer <token>" 进行分割,取出真正的token
  const token = authHeader?.split(" ")[1] || "Bearer error_token";
  var payload;
  try {
    log.info("正在本地检查token有效性");
    // 验证payload
    payload = await verifyToken<userPayload>(token);
    log.info("正在本地检查payload");
    // 检查payload数据
    if (!payload) {
      log.error("本地检查返回->payload有误/无效");
      return next(new AppError(401, "你没有权利访问此页面"));
    } else {
      // 挂载到req.user
      log.debug(`本地检查返回->payload正确: ${JSON.stringify(payload)}`);
      req.user = payload;
    }
  } catch (e: any) {
    // 枚举错误类型
    if (e.code === "ERR_JWT_EXPIRE") {
      // token 正确,但是过期请求前段重新登录
      return res
        .status(200)
        .json({ status: "success", message: "Token 已到期请刷新" });
    } else if (e.code === "ERR_JWS_INVALID") {
      // token被篡改
      return next(new AppError(401, "token被篡改或无效"));
    } else {
      // 其他错误
      return next(new AppError(401, "你没有权利访问此页面"));
    }
  }

  // 放行
  next();
};

export default authenticationMiddleware;
