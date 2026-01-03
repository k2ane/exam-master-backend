import * as z from "zod";

// 定义从客户端接收到的用户数据结构体
const RegisterUser = z.object({
  email: z.email("邮箱格式不正确"),
});
// 创建类型
type RegisterUser = z.infer<typeof RegisterUser>;

export { RegisterUser };
