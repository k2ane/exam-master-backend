import { SignJWT, jwtVerify, type JWTPayload } from "jose";
// 获取密匙
const secretKey = process.env.SECRET_KEY;
const secret = new TextEncoder().encode(secretKey);
// 定义算法
const alg = process.env.ALG || "HS256";
const expireTime = process.env.SECRET_KEY_EXPIRE_DATE || "24h";

// 定义payload结构体
interface userPayload extends JWTPayload {
  email: string;
  role: string;
}

// 登录->签发Token
const signToken = async (payload: any) => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg }) // 设置算法
    .setIssuedAt() // 设置Token签发时间
    .setExpirationTime(expireTime) // Token过期时间
    .sign(secret); // 使用密匙进行签发
};

// 认证->检验Token
const verifyToken = async <T extends JWTPayload>(token: string) => {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as T;
  } catch (error) {
    // 验证失败, token过期或者被篡改,抛出异常
    return null;
  }
};

export { signToken, verifyToken };
export type { userPayload };
