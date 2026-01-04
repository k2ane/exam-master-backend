import mongoose from "mongoose";
import { log } from "../../app";

// 获取数据库配置
const DB_URI =
  process.env.MONGODBURL ||
  "mongodb://admin:admin123@127.0.0.1:27017/exam_master-mongodb-t?authSource=admin";

class DataBase {
  private static instance: DataBase;
  // 注册监听器
  private constructor() {
    this._registerConnectionEvents();
  }
  // 单例模式，保证全局只有一个DataBase实例
  public static getInstance(): DataBase {
    if (!DataBase.instance) {
      DataBase.instance = new DataBase();
    }
    return DataBase.instance;
  }
  // 连接数据库方法
  public async connect(): Promise<void> {
    try {
      await mongoose.connect(DB_URI, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
      });
    } catch (error) {
      log.error(`mongoDB 初始化连接失败: ${error}`);
      process.exit(1); // 初始化连接失败后退出服务器
    }
  }
  // 关闭数据库方法
  public async disconnect(): Promise<void> {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      log.info("mongoDB 连接已主动关闭");
    }
  }
  // 内部方法，注册监听事件
  private _registerConnectionEvents() {
    // 连接成功
    mongoose.connection.on("connected", () => {
      log.info(`mongoDB 连接成功 ${DB_URI}`);
    });
    // 连接报错
    mongoose.connection.on("error", (err) => {
      log.error(`mongoDB 运行时发生错误: ${err}`);
    });
    // 断开连接
    mongoose.connection.on("disconnected", () => {
      log.error("mongoDB 连接断开, mongoose 正在尝试重新连接...");
    });
  }
}

export const db = DataBase.getInstance();
