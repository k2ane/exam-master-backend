import { Router } from "express";
import { log } from "../../../../app";
import { AppError } from "../../../../utils/error/appError";

const router = Router();
// 处理登录请求
router.post("/", (req, res, next) => {
  log.debug(
    `来自客户端的${req.method}请求, 请求地址：${req.host}:${req.baseUrl}`
  );
  var user = null;
  try {
    user = req.body.user;
  } catch (err) {
    if (err) return next(new AppError(400, "请输入用户名或密码"));
  }
  // 检查请求体中是否有user项，且是否提供了用户名与密码
  if (!user || !user.account || !user.password)
    return next(new AppError(400, "账户或密码错误"));
  res.status(200).json(user);
});

export { router as LoginRouter };
