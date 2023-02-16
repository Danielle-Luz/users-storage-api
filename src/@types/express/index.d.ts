import { tCreateUser, tSelectUser } from "./../../interfaces/users.interfaces";

declare global {
  namespace Express {
    interface Request {
      user: tCreateUser | tSelectUser;
    }
  }
}
