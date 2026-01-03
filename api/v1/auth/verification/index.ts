import { Router } from "express";
import nodemailer from "nodemailer";
import { randomInt } from "node:crypto";
import { promises as fs } from "fs";
import path from "node:path";
import { log } from "../../../../app";
import { AppError } from "../../../../utils/error/appError";

const router = Router();
router.post("/", async (req, res, next) => {
  try {
    // 读取文件夹内容
    const templatePath = path.join(
      process.cwd(),
      "templates",
      "mail_template.html"
    );
    // 读取文件内容
    let htmlContent = await fs.readFile(templatePath, "utf-8");
    // 生成随机验证码
    const verificationCode = generateSecureOTP();
    // 替换邮件模版中的占位符
    htmlContent = htmlContent.replace("{{code}}", verificationCode);
    // 创建传输器
    const transporter = nodemailer.createTransport({
      host: "smtp.qq.com",
      port: 465,
      secure: true,
      tls: { servername: "smtp.qq.com" },
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    // 发送邮件
    await transporter.sendMail({
      from: '"Bondex训练场" mint1944@foxmail.com',
      to: req.body.email, // 接受人
      subject: "身份认证 - 验证码", // 标题
      html: htmlContent, // 内容
    });
    log.debug(`邮件发送成功, 发送地址: ${req.body.email}`);
    return res
      .status(200)
      .json({ status: "success", message: "验证码发送成功" });
  } catch (error) {
    log.debug(`邮件发送失败, 原因: ${error}`);
    return next(new AppError(500, "验证码发送失败，服务器内部错误"));
  }
});

function generateSecureOTP() {
  const code = randomInt(100000, 1000000);
  return code.toString();
}

export { router as VerificationRouter };
