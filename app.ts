import "dotenv/config";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { v1Router } from "./api/v1/router";
import { Log } from "./utils/log/helper";
import { globalErrorHandler } from "./middleware/error";
import { AppError } from "./utils/error/appError";
import { db } from "./utils/database/db";

// 引入express
const app = express();
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

// 连接mongoDB数据库
await db.connect();

// 监听服务端口
const server = app.listen(port, async () => {
  log.info(`服务启动成功,运行在: http://localhost:${port} :)`);
  // 服务端创建成功后开始连接数据库
});

// 处理所有未知路由状态错误
app.all(/(.*)/, (req, res, next) => {
  log.debug(`错误, 请求路径不存在`);
  next(new AppError(404, `无法在服务器上找到 ${req.originalUrl}`));
});

// 全局错误处理中间件
app.use(globalErrorHandler);

// 处理退出事件，比如按下Ctrl+C或意外关闭的时候优雅退出
const handleShutdown = async (signal: string) => {
  log.info(`收到 ${signal} 信号，准备关闭服务器`);

  // 关闭HTTP服务，不再接受新请求
  server.close(() => {
    log.info("HTTP 服务器 已关闭");
  });
  // 关闭数据库连接
  log.info(`准备断开数据库连接`);
  await db.disconnect();
  log.info("服务器已关闭");
  process.exit(0);
};

// 监听关闭信号
process.on("SIGINT", () => handleShutdown("SIGINT"));
process.on("SIGTERM", () => handleShutdown("SIGTERM"));

// 导出dal操作层以供其他功能
export { log };
