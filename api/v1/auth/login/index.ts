import { Router } from "express";
import { log } from "../../../../app";
import { zLoginInput } from "../../../../utils/auth/verify_data_schema";
import { AppError } from "../../../../utils/error/appError";
import { LoginResponse } from "../../../../utils/auth/db_schema";

const router = Router();
// 处理登录请求
router.post("/", (req, res, next) => {
  // 打印log
  log.debug(
    `来自客户端的${req.method}请求, 请求地址：${req.host}:${req.baseUrl}`
  );
  // 获取用户传递的数据
  const res_data = req.body;
  // 验证用户传递的数据是否完整
  const user = zLoginInput.safeParse(res_data);
  // 数据有误,抛出错误
  if (!user.success) {
    return next(new AppError(400, "请检查你提交的数据类型是否正确"));
  }
  // 数据正确, 执行下一步的逻辑
  const response = new LoginResponse({
    status: "success",
    token: "KJH*Y*(F&TS&*A^*F&H)(UF(ASUF)(JF)(HNA)SF(U",
  });
  // 返回结果
  res.status(200).json(response);
});

export { router as LoginRouter };
