import { Router } from "express";
import { LoginRouter } from "./login";
import { VerificationRouter } from "./verification";

const router = Router();
// Auth 路由汇总
router.use("/login", LoginRouter); // 登录处理
router.use("/verification", VerificationRouter); // 验证码处理

export { router as AuthRouter };
