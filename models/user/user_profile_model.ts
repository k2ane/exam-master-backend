import mongoose, { Schema } from "mongoose";

// 部门模型
const DepartmentSchema = new Schema({
  dept_name: { type: String, required: true }, // 部门名称 - 必须
  created_by: { type: String, required: true }, // 部门创建者 - 用户uuid - 必须
  is_active: { type: Boolean, default: false }, // 部门是否可用 - 必须
  create_at: { type: Date, default: Date.now }, // 部门创建日期
  update_at: { type: Date, default: Date.now }, // 部门更新日期
});

// Token模型
const TokenSchema = new Schema({
  token: { type: String, required: true }, // 用户Bearer Token - 必须
  email: { type: String, required: true }, // token所属用户邮箱 - 必须
  expires: { type: Date, required: true }, // token过期日期 - 必须
  is_active: { type: Boolean, default: false, required: true }, // token 是否有效 0为无效 1为有效 - 必须
  create_at: { type: Date, default: Date.now }, // token创建日期
});

// 题目模型
const QuestionSchema = new Schema({
  q_title: { type: String, required: true }, // 题目 - 必须
  q_subtitle: String, // 题目副标题 可选?
  bank_id: { type: "UUID", required: true }, // 题目所属题库uuid - 必须
  q_format: {
    type: String,
    enum: ["text", "markdown", "html"],
    required: true,
  }, // 题目格式, [纯文字, MarkDown格式, 网页格式] - 必须
  type: {
    type: String,
    enum: ["single", "mutiple", "boolean", "fill"],
    required: true,
  }, // 题目类型, [单选题, 多选题, 判断题, 填空题] - 必须
  answer: { type: String, required: true }, // 题目答案 - 必须
  explanation: String, // 答案解析 可选?
  difficulty: { type: String, enum: ["esay, medium", "hard"], required: true }, // 题目难度 [简单, 中等, 困难] - 必须
  tags: [String], // 题目标签 可选?
  resources: [
    { type: { type: String, enmu: ["image", "video"] }, url: String }, // 题目所需资源 可选? 类型[图片, 视频]
  ],
  created_at: { type: Date, default: Date.now }, // 题目创建日期 - 必须
  updated_at: { type: Date, default: Date.now }, // 题目更新日期 - 必须
});

// 题库模型
const QBankSchema = new Schema({
  bank_title: { type: String, required: true }, // 题库标题 - 必须
  bank_subtitle: String, // 题库副标题 可选?
  bank_label: String, // 题库标签 可选?
  total_questions: { type: Number, required: true }, // 题库中所有题目的数量 - 必须
  created_by: { type: "UUID", required: true }, // 题库创建者 - 用户uuid - 必须
  created_at: { type: Date, default: Date.now }, // 题库创建日期 - 必须
  updated_at: { type: Date, default: Date.now }, // 题库更新日期 - 必须
});

// 用户资料模型
const UserProfileSchema = new Schema({
  nick_name: String, // 用户昵称
  email: { type: String, default: null, required: true }, // 用户邮箱 - 必须 - 唯一
  phone: String, // 用户手机号 - 唯一 | 可选?
  dept: { type: ["UUID"] }, // 用户所属部门 - 部门id - 必须
  role: {
    type: String,
    default: ["employee"],
    enum: ["employee", "dept_manager", "admin"],
  }, // 用户权限 - 默认为员工 [员工, 部门主管, 超级管理员] - 必须
  is_active: { type: Boolean, default: false, required: true }, // 用户是否启用 0为不启用，1为启用
  created_at: { type: Date, default: Date.now }, // 账户创建日期 - 必须
  update_at: { type: Date, default: Date.now }, // 账户更新日期 - 必须
});

// 验证码模型
const VerificationCodeSchema = new Schema({
  code: { type: String, required: true }, // 验证码 - 必须
  email: { type: String, require: true }, // 使用此验证码的邮箱 - 必须
  expires_at: { type: Date, required: true }, // 验证码过期日期 - 必须
  created_at: { type: Date, default: Date.now }, // 验证码创建日期 - 自动
  is_used: { type: Boolean, default: false }, // 验证码是否已使用 - 默认未使用
});

const UserProfileModel = mongoose.model("Users", UserProfileSchema);
const DepartmentModel = mongoose.model("Departments", DepartmentSchema);
const TokenModel = mongoose.model("Tokens", TokenSchema);
const QuestionModel = mongoose.model("Questions", QuestionSchema);
const QBankModel = mongoose.model("QBanks", QBankSchema);
const VerificationCodeModel = mongoose.model(
  "VerificationCode",
  VerificationCodeSchema
);

export {
  UserProfileModel,
  DepartmentModel,
  TokenModel,
  QBankModel,
  QuestionModel,
  VerificationCodeModel,
};
