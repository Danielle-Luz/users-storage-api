import { errorHandler } from "./error";
import "express-async-errors";
import { Application } from "express";

const express = require("express");

const app: Application = express();

app.use(express.json());

app.use(errorHandler);

export { app };
