import crypto from "crypto";
// import dotenv from "dotenv";
// dotenv.config();

export function generateSalt(length: number) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
}
