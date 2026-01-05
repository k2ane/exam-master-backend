import { Router } from "express";
import { AuthRouter } from "./auth/auth_route";
import { UserRouter } from "./user";
import authenticationMiddleware from "../../middleware/authentication";
import { CheckTokenMiddlewate } from "../../middleware/check_token";
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
// 用户路由，二次验证token是否有效
router.use("/user", authenticationMiddleware, CheckTokenMiddlewate, UserRouter); // 用户路由

export { router as v1Router };
