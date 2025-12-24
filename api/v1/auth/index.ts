import { Router } from "express";
import { dal } from "../../../app";

const router = Router();
router.get("/", async (req, res) => {
  console.log(`🟢 - 接受到GET请求`);
  const dal_client = await dal.getClient();
  try {
    const client_response = await dal_client.query("SELECT * FROM em_user");
    res.status(200).json(client_response.rows);
  } catch (err) {
    if (err) {
      console.log(err);
      res.status(404).json({ status: "❌", message: "请求数据错误" });
    }
  }
  dal_client.release();
});

router.post("/", async (req, res) => {
  console.log(`🟢 - 接受到POST请求`);
  res.send({ message: "you send a POST request :)" });
});

export { router as LoginRouter };
