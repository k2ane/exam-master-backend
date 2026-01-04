import { Router } from "express";
import { AppError } from "../../../utils/error/appError";
import { UserProfileModel } from "../../../models/user/user_profile_model";

const router = Router();

// 获取用户个人信息
router.get("/", async (req, res, next) => {
  // 获取payload中的用户信息
  const email = req.user?.email;
  if (!email) return next(new AppError(500, "服务器内部错误"));
  // 去数据库中查询此用户数据
  try {
    const r_data = await UserProfileModel.findOne({ email: email });
    if (!r_data) {
      return next(new AppError(500, "无法获取用户信息, 服务器内部错误"));
    }
    return res.status(200).json({ status: "success", content: r_data });
  } catch (e) {
    if (e) return next(new AppError(500, "服务器内部错误"));
  }
});

export { router as UserRouter };
