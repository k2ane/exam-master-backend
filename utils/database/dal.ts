import type { Pool, PoolClient } from "pg";
import createPgPool from "./pg_pool";

class Dal {
  private pg_pool = createPgPool();
  // 创建连接池客户端
  /**创建连接池中的客户端
   * @return 连接池客户端
   */
  public async getClient() {
    return await this.pg_pool.connect();
  }
}

export { Dal };
