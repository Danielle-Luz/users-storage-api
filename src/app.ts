import { errorHandler } from "./error";
import "express-async-errors";
import { Application } from "express";

const express = require("express");

export const app: Application = express();

app.use(express.json());

app.use(errorHandler);