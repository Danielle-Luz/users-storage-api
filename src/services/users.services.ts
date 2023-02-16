import { iToken } from "./../interfaces";
import { connection } from "./../database/database.config";
import { format } from "node-pg-format";
import { tCreateUser, tLoginData, tUser } from "../interfaces/users.interfaces";
import { QueryResult } from "pg";
import { compare, hash } from "bcryptjs";
import { InactiveUserError, InvalidLoginDataError } from "../error";
import { sign } from "jsonwebtoken";

export namespace service {
  export const createUser = async (newUser: tCreateUser) => {
    const encryptedPassword = await hash(newUser.password, 10);

    newUser.password = encryptedPassword;
    const newUserKeys = Object.keys(newUser);
    const newUserData = Object.values(newUser);

    const queryString = `
    INSERT INTO users (%I)
    VALUES (%L)
    RETURNING *
    `;

    const formattedQueryString = format(queryString, newUserKeys, newUserData);

    const createdUser: QueryResult<tUser> = await connection.query(
      formattedQueryString
    );

    const { password, ...dataWithoutPassword } = createdUser.rows[0];

    return dataWithoutPassword;
  };

  export const getUserDataByField = async (
    searchedValue: string,
    selectedFields: string[],
    comparedField: string
  ): Promise<any> => {
    const queryString = `SELECT %I FROM users WHERE %I = %L`;

    const formattedQueryString = format(
      queryString,
      selectedFields,
      comparedField,
      searchedValue
    );

    const foundUser: QueryResult<any> = await connection.query(
      formattedQueryString
    );

    return foundUser.rows[0];
  };

  export const login = async (userData: tLoginData): Promise<iToken> => {
    const { email: loginEmail, password: loginPassword } = userData;

    const userWithSameEmail = await getUserDataByField(
      loginEmail,
      ["email", "password", "active"],
      "email"
    );

    const userIsNotActive = !userWithSameEmail?.active;
    const userWasNotFound = !userWithSameEmail;
    const userDontHasSamePassword = !compare(
      loginPassword,
      String(userWithSameEmail?.password)
    );

    if (userWasNotFound || userDontHasSamePassword) {
      throw new InvalidLoginDataError("E-mail or password are wrong", 401);
    } else if (userIsNotActive) {
      throw new InactiveUserError("The user is not active", 401);
    }

    const token = sign({ email: loginEmail }, String(process.env.SECRET_KEY), {
      expiresIn: "24h",
      subject: loginEmail,
    });

    return { token };
  };
}
