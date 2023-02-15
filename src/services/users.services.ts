import { connection } from "./../database/database.config";
import { format } from "node-pg-format";
import { iUser } from "../interfaces/users.interfaces";
import { QueryResult } from "pg";

export namespace service {
  export const createUser = async (newUser: iUser) => {
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
  
    return createdUser.rows[0];
  };
}
