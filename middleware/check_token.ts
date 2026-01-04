import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/error/appError";
import { TokenModel } from "../models/user/user_profile_model";
import { log } from "../app";

const CheckTokenMiddlewate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 从请求头中获取Token, 格式-> "Authorization: Bearer <token>"
  const authHeader = req.headers.authorization;
  // 使用空格分割字符串将token内容取出
  const token = authHeader?.split(" ")[1] || "Bearer error_token";
  // 使用token去数据库查询此token是否有效
  try {
    log.info("正在联网->验证token真实性");
    const f_data = await TokenModel.findOne({ token: token, is_active: true });
    // 如果数据库中查不到数据就认为token已过期
    if (!f_data) {
      log.error("数据库报告->token无效/已过期");
      return next(new AppError(401, "验证错误, Token已过期"));
    }
    // 放行
    log.debug(`数据库报告->token有效, token属于用户: ${f_data.email}`);
    next();
  } catch (e) {
    if (e) return next(new AppError(500, "验证错误, 服务器内部错误"));
  }
};

export { CheckTokenMiddlewate };
