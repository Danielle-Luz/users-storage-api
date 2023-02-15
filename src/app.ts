import { usersRouter } from "./routes/users.routes";
import { errorHandler } from "./error";
import { Application } from "express";

const express = require("express");

export const app: Application = express();

app.use(express.json());

app.use("/users", usersRouter);

app.use(errorHandler);
