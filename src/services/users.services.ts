import { connection } from "./../database/database.config";
import { format } from "node-pg-format";
import { iId, tCreateUser, tLoginData } from "../interfaces/users.interfaces";
import { QueryResult } from "pg";
import { compare, hash } from "bcryptjs";
import { InvalidLoginDataError } from "../error";

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

    const createdUser: QueryResult<tCreateUser> = await connection.query(
      formattedQueryString
    );

    const { password, ...dataWithoutPassword } = createdUser.rows[0];

    return dataWithoutPassword;
  };

  export const getUserDataByField = async (
    searchedValue: string,
    selectedFields: string[],
    comparedField: string
  ) => {
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

  export const login = async (userData: tLoginData) => {
    const userWithSameEmail = await getUserDataByField(
      userData.email,
      ["email", "password"],
      "email"
    );

    const userWasNotFound = !userWithSameEmail;
    const userDontHasSamePassword = !compare(
      userData.password,
      userWithSameEmail.password
    );

    if (userWasNotFound || userDontHasSamePassword) {
      throw new InvalidLoginDataError("Email or password are wrong", 401);
    }
  };
}
