import path from "path";
import { promises as fs } from "fs";
import nodemailer from "nodemailer";
import { randomInt } from "crypto";
import { AppError } from "../error/appError";
import type { NextFunction } from "express";
import { log } from "../../app";

async function Sendemail(email: string, code: string, next: NextFunction) {
  let htmlContent;
  try {
    // 读取文件夹内容
    const templatePath = path.join(
      process.cwd(),
      "templates",
      "mail_template.html"
    );
    log.debug("发送邮件->读取文件夹内容成功");
    // 读取文件内容
    htmlContent = await fs.readFile(templatePath, "utf-8");
    log.debug("发送邮件->读取文件内容成功");
    // 生成随机验证码
    const verificationCode = code;
    log.debug("发送邮件->生成随机验证码成功");
    // 替换邮件模版中的占位符
    htmlContent = htmlContent.replace("{{code}}", verificationCode);
    log.debug("发送邮件->替换邮件模版占位符成功");
  } catch (e) {
    log.error("发送邮件->发送邮件失败");
    if (e) return next(new AppError(500, "服务器内容错误, 验证码发送失败"));
  }
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
  log.debug("发送邮件->创建邮件传输器成功");
  try {
    log.debug(`发送邮件->正在发送邮件至 ${email}`);
    await transporter.sendMail({
      from: '"Bondex训练场" mint1944@foxmail.com',
      to: email, // 接受人
      subject: "身份认证 - 验证码", // 标题
      html: htmlContent, // 内容
    });
  } catch (e) {
    log.error("发送邮件->发送邮件失败");
    if (e) return next(new AppError(500, "服务器内容错误, 验证码发送失败"));
  }
  log.debug("发送邮件->发送邮件成功");
}

// 生成随验证码
function generateSecureOTP() {
  const code = randomInt(100000, 1000000); // 生成6位数字验证码
  return code.toString(); // 将数字验证码转换为字符串
}

export { generateSecureOTP, Sendemail };
