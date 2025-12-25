import "dotenv/config";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { v1Router } from "./api/v1/router";
import { Dal } from "./utils/database/dal";
import { Log } from "./utils/log/helper";
import { globalErrorHandler } from "./middleware/error";
import { AppError } from "./utils/error/appError";

// 引入express
const app = express();
// 创建数据库操作层
const dal = new Dal();
// 创建log
const log = new Log();
// 引入环境变量
const port = process.env.PORT;
// 引入 CORS 处理跨域问题，使用express.json()来仅接受客户端传入的json格式数据, helmet安全处理返回的Http Header
app.use(helmet());
app.use(cors());
app.use(express.json());

// 处理 CORS 预检请求
app.options(/(.*)/, cors());

// 挂载路由
app.use("/api/v1", v1Router);

// 基本路由
app.get("/", (req, res) => {
  res.status(200).send({ message: "All Good! 😀" });
});

// 监听服务端口

app.listen(port, async () => {
  log.info(`服务启动成功,运行在: http://localhost:${port} :)`);
  // 服务端创建成功后开始连接数据库
});

// 处理所有未知路由状态错误🔴
app.all(/(.*)/, (req, res, next) => {
  log.debug(`错误, 请求路径不存在`);
  next(new AppError(404, `无法在服务器上找到 ${req.originalUrl}`));
});

app.use(globalErrorHandler);

// 导出dal操作层以供其他功能
export { dal, log };
