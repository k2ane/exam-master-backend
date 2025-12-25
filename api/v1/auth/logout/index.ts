import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  console.log(
    `🟢 - 来自客户端的${req.method}请求, 请求地址：${req.host}:${req.baseUrl}`
  );
  res.status(200).json({
    message: `you send ${req.method} request to ${req.host}:${req.baseUrl}`,
  });
});

router.post("/", (req, res) => {
  console.log(
    `🟢 - 来自客户端的${req.method}请求, 请求地址：${req.host}:${req.baseUrl}`
  );
  res.status(200).json({
    message: `you send ${req.method} request to ${req.host}:${req.baseUrl}`,
  });
});

export { router as LogoutRouter };
