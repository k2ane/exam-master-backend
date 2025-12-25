import * as z from "zod";

// 定义从客户端接收到的用户数据结构体
const RegisterUser = z.object({
  email: z.email("邮箱格式不正确"),
  name: z.string("提交的数据格式有误"),
  pass_hash: z.hash("sha256", { error: "密码格式错误" }),
});
// 创建类型
type RegisterUser = z.infer<typeof RegisterUser>;

export { RegisterUser };
