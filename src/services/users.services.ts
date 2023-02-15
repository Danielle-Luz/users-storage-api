import { connection } from "./../database/database.config";
import { format } from "node-pg-format";
import { iId, iUser } from "../interfaces/users.interfaces";
import { QueryResult } from "pg";
import { hash } from "bcryptjs";

export namespace service {
  export const createUser = async (newUser: iUser) => {
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

    const createdUser: QueryResult<iUser> = await connection.query(
      formattedQueryString
    );

    const { password, ...dataWithoutPassword } = createdUser.rows[0];

    return dataWithoutPassword;
  };

  export const getUserIdByEmail = async (searchedEmail: string) => {
    const queryString = `SELECT id FROM users WHERE email = %L`;

    const formattedQueryString = format(queryString, searchedEmail);

    const foundUser: QueryResult<iId> = await connection.query(
      formattedQueryString
    );

    return foundUser.rows[0];
  };

  export const login = () => {};
}
