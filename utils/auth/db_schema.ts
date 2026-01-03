import mongoose, { Schema } from "mongoose";
import { string } from "zod";

const verification_response_schema = new Schema({
  status: string,
  message: string,
});

const login_response_schema = new Schema({
  status: string,
  token: string,
});

const VerificationResponse = mongoose.model(
  "VerificationResponse",
  verification_response_schema
);

const LoginResponse = mongoose.model("LoginResponse", login_response_schema);

export { VerificationResponse, LoginResponse };
