import { Router } from "express";
import { dal, log } from "../../../../app";
import { AppError } from "../../../../utils/error/appError";

const router = Router();

router.post("/", async (req, res, next) => {
  log.debug(
    `来自客户端的${req.method}请求, 请求地址：${req.host}:${req.baseUrl}`
  );
  // 获取请求体中的注册信息
  var user = null;
  // 检查数据结构是否存在
  try {
    user = req.body.user;
  } catch (err) {
    log.debug(user);
    if (err) return next(new AppError(400, "请检查输入的信息是否完整"));
  }
  // 检查数据是否完整
  log.debug("开始检查数据");
  if (!user || !user.account || !user.password)
    return next(new AppError(400, "账户或密码错误"));
  // 开始提交注册
  // 获取数据库操作客户端
  log.debug("开始获取数据库操作客户端");
  const dal_clieant = await dal.getClient();
  // 检查库中是否已经存在相同的邮箱
  log.debug("开始检查库中是否已经存在相同的邮箱");
  const dal_res = await dal_clieant.query(
    `SELECT * FROM "user" WHERE email = '${user.account}'`
  );
  // 确定查询到的账户数量，若为0则表示账户未被注册
  log.debug("开始确定查询到的账户数量");
  if (dal_res.rows.length != 0) {
    log.debug("有存在的账户，释放数据库访问客户端，返回");
    dal_clieant.release(); // 释放数据库访问客户端
    return next(new AppError(200, "邮箱已被注册，请找回密码或使用新邮箱注册"));
  }
  // 将账户写入数据库
  log.debug("开始将账户写入数据库");
  dal_clieant
    .query(
      `INSERT INTO "user" (email, password) VALUES ('${user.account}', '${user.password}')`
    )
    .then(() => {})
    .catch((err) => {
      if (err) {
        log.debug("注册失败，释放数据库访问客户端，返回");
        dal_clieant.release();
        return new AppError(400, "注册失败，请重试");
      }
    });

  log.debug("注册成功，释放数据库访问客户端，返回");
  dal_clieant.release();
  res.status(200).json({ status: "success", message: "注册成功 :)" });
});

export { router as RegisterRouter };
