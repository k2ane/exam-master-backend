import { Router } from "express";
import { dal, log } from "../../../../app";
import { AppError } from "../../../../utils/error/appError";
import { RegisterUser } from "../../../../utils/auth/user_data_schema";
import { signToken, type userPayload } from "../../../../utils/auth/jwt";

const router = Router();

router.post("/", async (req, res, next) => {
  // 获取用户传入的数据
  var req_data = undefined;
  // 检测客户端是否提供数据
  try {
    req_data = req.body.email;
  } catch (err) {
    return next(new AppError(400, "错误, 提供的数据不完整"));
  }
  // 验证用户传入的数据
  const validationResult = RegisterUser.safeParse(req_data);
  if (!validationResult.success) {
    // 传入数据不完整, 抛出错误
    const errorMsg = validationResult.error.issues[0]?.message;
    return next(new AppError(400, errorMsg || "提交的数据有误"));
  }
  // 初始化数据库操作客户端
  let dal_client = null;
  // 数据正确,开始注册流程
  try {
    // 获取数据库操作客户端
    dal_client = await dal.getClient();
    // 检查数据库中是否存在已注册用户
    const dal_result = await dal_client.query(
      'SELECT * FROM "em_user" WHERE "name" = $1 OR "email" = $2',
      [req_data.name, req_data.email]
    );
    // 判断数据库中是否已存在该用户
    if (dal_result.rows.length > 0) {
      log.debug("用户已存在");
      return next(new AppError(409, "用户名或邮箱已被使用,请重试"));
    }
    // 插入用户
    await dal_client.query(
      'INSERT INTO "em_user" (email, name, pass_hash) VALUES ($1, $2, $3)',
      [req_data.email, req_data.name, req_data.pass_hash]
    );
    // 成功插入用户,准备签署jwt token
    // 获取用户id
    const dal_result_s = await dal_client.query(
      'SELECT "uid", "name", "email", "role" FROM "em_user" WHERE "name" = $1 AND "email" = $2',
      [req_data.name, req_data.email]
    );
    // 初始payload
    const payload: userPayload = {
      userId: dal_result_s.rows[0].uid,
      email: dal_result_s.rows[0].email,
      role: dal_result_s.rows[0].role,
    };
    // 签署token
    const token = await signToken(payload);
    // 将token写入数据库
    const dal_result_i2 = await dal_client.query(
      'INSERT INTO "em_token" (token, in_use, token_user) VALUES ($1, $2, $3)',
      [token, true, payload.userId]
    );
    // 返回成功消息
    log.debug("注册成功");
    res.status(200).json({ status: "success", toekn: token });
  } catch (err) {
    // 注册失败
    log.debug("注册失败");
    return next(new AppError(500, "服务器内部错误,注册失败"));
  } finally {
    if (dal_client) {
      // 释放数据库操作客户端
      dal_client.release();
    }
  }
});

export { router as RegisterRouter };
