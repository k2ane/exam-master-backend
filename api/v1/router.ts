import { Router } from "express";
import { AuthRouter } from "./auth/auth_route";
import { MailRouter } from "./mail";
const router = Router();
// v1 主路由
router.get("/", (req, res) => {
  const success_message = [
    { status: 200, content: { message: "✅ - 服务端运行正常 :)" } },
  ];
  res.status(200).send(success_message);
});
// 身份验证-登录 路由
router.use("/auth", AuthRouter); //登录路由
router.use("/mail", MailRouter); //邮件发送路由

export { router as v1Router };
