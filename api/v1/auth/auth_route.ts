import { Router } from "express";
import { LoginRouter } from "./login";
import { RegisterRouter } from "./register";
import { LogoutRouter } from "./logout";
import { Account_ClosureRouter } from "./accout_closure";
import authenticationMiddleware from "../../../middleware/authentication";

const router = Router();
// Auth 路由汇总
router.use("/login", LoginRouter); // 登录处理
router.use("/register", RegisterRouter); // 注册处理
router.use("/logout", authenticationMiddleware, LogoutRouter); // 登出处理
router.use("/accout_closure", authenticationMiddleware, Account_ClosureRouter); // 销户处理

export { router as AuthRouter };
