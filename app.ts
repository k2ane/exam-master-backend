import "dotenv/config";
import cors from "cors";
import express from "express";
import authenticationMiddleware from "./middleware/authentication";
import { v1Router } from "./api/v1/router";
import { Dal } from "./utils/database/dal";

// 引入express
const app = express();
// 创建数据库操作层
const dal = new Dal();
// 引入环境变量
const port = process.env.PORT;
// 引入 CORS 处理跨域问题，使用express.json()来仅接受客户端传入的json格式数据
app.use(cors());
app.use(express.json());

// 处理 CORS 预检请求
app.options(/(.*)/, cors());

// 挂载路由
app.use("/api/v1", authenticationMiddleware, v1Router);

// 基本路由
app.get("/", (req, res) => {
  res.status(200).send({ message: "All Good! 😀" });
});

// 监听服务端口

app.listen(port, async () => {
  console.log(`🟢 - 服务启动成功,运行在: http://localhost:${port} :)`);
  // 服务端创建成功后开始连接数据库
});

// 处理所有未知路由状态错误🔴
app.use((req, res, next) => {
  const error_message = [
    { status: 404, content: { message: "🔴 - 错误，无法找到所需的资源 :(" } },
  ];
  res.status(404).send(error_message);
});

// 导出dal操作层以供其他功能
export { dal };
