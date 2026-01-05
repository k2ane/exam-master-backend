import { Router } from "express";
import { log } from "../../../../app";
import { zLoginInput } from "../../../../models/api/api_request_model";
import { AppError } from "../../../../utils/error/appError";
import {
  TokenModel,
  UserProfileModel,
  VerificationCodeModel,
} from "../../../../models/user/user_profile_model";
import { signToken } from "../../../../utils/auth/jwt";

const router = Router();
// 处理登录请求
router.post("/", async (req, res, next) => {
  // 打印log
  log.debug(
    `来自客户端的${req.method}请求, 请求地址：${req.host}:${req.baseUrl}`
  );
  // 获取用户传递的数据
  const user_data = req.body;
  // 验证用户传递的数据是否完整
  const v_data = zLoginInput.safeParse(user_data);
  // 数据有误,抛出错误
  if (!v_data.success) {
    return next(new AppError(400, "请检查你提交的数据类型是否正确"));
  }
  // 数据正确, 开始提交用户数据进行验证
  const post_data = new UserProfileModel({
    email: v_data.data.email,
    is_active: true,
    role: "employee",
    update_at: Date.now(),
  });
  // 检查用户提交的验证码是否正确
  let f_data;
  try {
    f_data = await VerificationCodeModel.findOne({
      email: v_data.data.email,
      is_used: false,
      expires_at: { $gt: new Date() },
    });
  } catch (err) {
    log.error("检查验证码->检查失败");
    return next(new AppError(500, "服务器内部错误"));
  }
  // 如果没有查询到有用的验证码
  if (!f_data) return next(new AppError(500, "验证码错误, 服务器内部错误"));
  // 比较验证码
  if (
    f_data.code === v_data.data.passcode &&
    f_data.email === v_data.data.email
  ) {
    // 正确，将此验证码标记为已使用
    await f_data.updateOne({ is_used: true });
    // 检查用户是否已经存在
    const u_data = await UserProfileModel.find({
      email: v_data.data.email,
      is_active: true,
    });
    log.debug(
      "======================================================================================="
    );
    console.log("查询到的用户资料如下:");
    console.log(u_data);
    log.debug(
      "======================================================================================="
    );
    if (u_data[0] == null || !u_data[0]) {
      // 用户不存在
      // 将用户写入数据库
      log.info(`新用户: ${v_data.data.email}，正在写入数据库`);
      await UserProfileModel.create(post_data);
      // 创建token payload
      const payload = {
        email: post_data.email,
        role: post_data.role,
      };

      // 确认数据库中是否有未过期的token
      const ft_data = await TokenModel.findOne({
        is_active: true,
        // token: token,
        email: post_data.email,
        expires: { $gt: new Date() },
      });
      if (!ft_data) {
        log.info(`为用户: ${v_data.data.email} 签发新的Token`);
        // 签发新token
        const token = await signToken(payload);
        // 设置token过期时间 默认为7天
        // 公式：天 * 小时 * 分钟 * 秒 * 毫秒
        const v_expiresInMs = 7 * 24 * 60 * 60 * 1000;
        // 创建过期时间对象
        const v_expireDate = new Date(Date.now() + v_expiresInMs);
        // 将token写入数据库
        const t_data = await TokenModel.create({
          token: token,
          email: post_data.email,
          expires: v_expireDate,
          is_active: true,
        });
        // 如果存储失败
        if (!t_data)
          return next(new AppError(500, "签发token失败, 服务器内部错误"));
        // 返回token

        res.status(200).json({ status: "success", token: token });
      } else {
        // 返回旧token、
        log.info(`用户: ${v_data.data.email} 拥有可用的token, 已返回`);
        res.status(200).json({ status: "success", token: ft_data.token });
      }
    } else {
      // 用户存在, 查询用户信息无误后,检查是否有已存在的token
      // 确认数据库中是否有未过期的token
      // 创建token payload
      log.info(`用户存在: ${v_data.data.email}`);
      const payload = {
        email: post_data.email,
        role: post_data.role,
      };
      // 查询是否有已经存在的token
      const ft_data = await TokenModel.findOne({
        is_active: true,
        // token: token,
        email: post_data.email,
        expires: { $gt: new Date() },
      });
      if (!ft_data) {
        log.info(`为用户: ${v_data.data.email} 签发新的Token`);
        // 签发新token
        const token = await signToken(payload);
        // 设置token过期时间 默认为7天
        // 公式：天 * 小时 * 分钟 * 秒 * 毫秒
        const v_expiresInMs = 7 * 24 * 60 * 60 * 1000;
        // 创建过期时间对象
        const v_expireDate = new Date(Date.now() + v_expiresInMs);
        // 将token写入数据库
        const t_data = await TokenModel.create({
          token: token,
          email: post_data.email,
          expires: v_expireDate,
          is_active: true,
        });
        // 如果存储失败
        if (!t_data)
          return next(new AppError(500, "签发token失败, 服务器内部错误"));
        // 返回token
        res.status(200).json({ status: "success", token: token });
      } else {
        // 返回旧token
        log.info(`用户: ${v_data.data.email} 拥有可用的token, 已返回`);
        res.status(200).json({ status: "success", token: ft_data.token });
      }
    }
  } else {
    // 错误, 请重试
    return next(new AppError(401, "验证码错误, 请重试"));
  }
});

export { router as LoginRouter };
