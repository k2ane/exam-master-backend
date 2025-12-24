import { Pool } from "pg";

// 创建数据库连接池配置文件
const pool_config = {
  user: process.env.DATABASE_USER, // 数据库用户名
  password: process.env.DATABASE_PASSWORD, //数据库密码
  host: process.env.DATABASE_HOST, // 数据库地址
  port: Number(process.env.DATABASE_PORT), // 数据库端口
  database: process.env.DATABASE, // 数据库库名
};

function createPgPool() {
  // 创建数据库连接池
  const pool = new Pool(pool_config);

  // 监听客户端错误事件
  pool.on("error", (err, client) => {
    console.log("🚨🤖 - 错误，连接池客户端错误 :(");
    process.exit(-1);
  });

  // 监听客户端连接事件
  pool.on("connect", (client) => {
    console.log("🟢🖥️ - 客户端已连接到数据库 :)");
  });

  // 监听客户端加入连接池事件
  pool.on("acquire", (client) => {
    console.log("🟢🖥️ - 新的客户端已加入连接池中 :)");
  });

  // 监听客户端释放回连接池事件
  pool.on("release", (err, client) => {
    if (err) {
      console.log(err);
      process.exit(-1);
    }
    console.log("🟢🖥️ - 客户端已释放回连接池中 :)");
  });

  // 监听客户端释移除连接池事件
  pool.on("remove", (client) => {
    console.log("🟢🖥️ - 客户端已从连接池中移除 :)");
  });

  return pool;
}

export default createPgPool;
