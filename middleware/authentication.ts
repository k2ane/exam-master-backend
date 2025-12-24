import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/auth/jwt";
import type { userPayload } from "../utils/auth/jwt";

// 扩展 Express 的 Request 类型，以便在后续处理中使用 user 信息
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
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
    return res
      .status(401)
      .json({ message: ":( 您似乎还未登录, 请先登录再尝试访问" });
  }
  // 用户请求头包含token信息, 获取token字符串
  // 使用空格将 "Bearer <token>" 进行分割,取出真正的token
  const token = authHeader.split(" ")[1] || "Bearer error_token";
  const payload = await verifyToken<userPayload>(token);

  if (!payload) {
    return res.status(401).json({ message: ":( 看来您并没有权限访问此页面" });
  }
  // 将用户信息挂载到req对象上
  req.user = payload;
  // 放行
  next();
};

export default authenticationMiddleware;
