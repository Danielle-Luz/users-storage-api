import { Client } from "pg";
import "dotenv/config";

export const connection = new Client({
  user: process.env.USER,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  database: process.env.DATABASE,
  port: parseInt(process.env.PORT || "5432")
})