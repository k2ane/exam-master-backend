import { Router } from "express";

const router = Router();
router.get("/", (req, res) => {
  console.log(`🟢 - 接受到GET请求`);
  res.send({ message: "you send a GET request :)" });
});

router.post("/", async (req, res) => {
  console.log(`🟢 - 接受到POST请求`);
  res.send({ message: "you send a POST request :)" });
});

export { router as LoginRouter };
