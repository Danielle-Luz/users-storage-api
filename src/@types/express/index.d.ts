import { tSelectUser } from "./../../interfaces/users.interfaces";

declare global {
  namespace Express {
    interface Request {
      user: tSelectUser;
      parsedParamId: number;
    }
  }
}
