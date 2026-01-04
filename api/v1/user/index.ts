import { Router } from "express";
import { AppError } from "../../../utils/error/appError";
import { UserProfileModel } from "../../../models/user/user_profile_model";

const router = Router();

router.get("/", (req, res, next) => {
  try {
    const return_data = new UserProfileModel({
      name: "Jhon",
      nick_name: "Jhonason_k",
      email: "jhon35@icloud.com",
      phone: "13500000000",
      dept: ["dafault_dept"],
    });
    res.status(200).json({ status: "success", content: return_data });
  } catch (e) {
    return next(new AppError(400, "请求的数据有误"));
  }
});

export { router as UserRouter };
