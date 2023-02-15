import { iUser } from "./../../interfaces/users.interfaces";

declare global {
  namespace Express {
    interface Request {
      user: iUser;
    }
  }
}
