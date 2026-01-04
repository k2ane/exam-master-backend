import { Router } from "express";
import { randomInt } from "node:crypto";
import { AppError } from "../../../../utils/error/appError";
import { zVerificationInput } from "../../../../models/api/api_request_model";
import { Sendemail } from "../../../../utils/auth/email";
import { log } from "../../../../app";
import { VerificationCodeModel } from "../../../../models/user/user_profile_model";

const router = Router();
router.post("/", async (req, res, next) => {
  // 获取用户传入的数据
  const req_data = req.body;
  // 检查用户传入的数据是否符合要求
  const v_data = zVerificationInput.safeParse(req_data);
  // 如果传入的数据有误，抛出错误
  if (v_data.error) {
    log.error("发送邮件->发送邮件失败");
    return next(new AppError(400, "邮件发送错误, 检查数据是否正确"));
  }
  // 数据正确，获取用户邮箱并生成随机验证码
  const v_code = generateSecureOTP();
  // 检查是否已经获取过验证码
  let f_data;
  try {
    f_data = await VerificationCodeModel.findOne({
      email: v_data.data.email,
      is_used: false,
      expires_at: { $gt: new Date() },
    });
  } catch (err) {
    log.error("发送邮件->发送邮件失败");
    return next(new AppError(500, "邮件发送错误, 服务器内部错误"));
  }
  log.debug("发送验证码->检查数据库中是否有未过期的验证码");
  // 检查验证码是否过期
  if (f_data) {
    // 存在未过期的验证码，直接发送此验证码到用户邮箱
    log.debug("发送验证码->存在未过期的验证码");
    await Sendemail(v_data.data.email, f_data.code, next);
    log.debug("发送验证码->验证码发送成功");
    // 发送成功
    res.status(200).json({ status: "success", message: "邮件发送成功" });
  } else {
    log.debug("发送验证码->发送新的验证码");
    // 发送新的验证码
    // 设置验证码过期时间 默认为5分钟
    // 公式：天 * 小时 * 分钟 * 秒 * 毫秒
    const v_expiresInMs = 5 * 60 * 1000;
    // 创建过期时间对象
    const v_expireDate = new Date(Date.now() + v_expiresInMs);
    // 将验证码写入数据库
    VerificationCodeModel.create({
      code: v_code,
      email: v_data.data.email,
      is_used: false,
      expires_at: v_expireDate,
    });
    // 发送邮件
    await Sendemail(v_data.data.email, v_code, next);
    log.debug("发送验证码->验证码发送成功");
    // 发送成功
    res.status(200).json({ status: "success", message: "邮件发送成功" });
  }
});

function generateSecureOTP() {
  const code = randomInt(100000, 1000000);
  return code.toString();
}

export { router as VerificationRouter };
