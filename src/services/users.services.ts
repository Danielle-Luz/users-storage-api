import {
  iId,
  iStatus,
  tActive,
  tValidateUser,
} from "./../interfaces/users.interfaces";
import { iToken } from "./../interfaces";
import { connection } from "./../database/database.config";
import { format } from "node-pg-format";
import {
  tCreateUser,
  tLoginData,
  tUser,
  tSelectUser,
  tUpdateUser,
} from "../interfaces/users.interfaces";
import { QueryResult } from "pg";
import { compare, hash } from "bcryptjs";
import { UserStatusError, InvalidLoginDataError } from "../error";
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

  export const updateUser = async (
    updatedData: tUpdateUser | iStatus,
    updatedUserId: number
  ) => {
    const updatedPassword = updatedData["password"];

    if (updatedPassword) {
      const encryptedPassword = await hash(String(updatedPassword), 10);

      updatedData.password = encryptedPassword;
    }

    const updatedUserKeys = Object.keys(updatedData);
    const updatedUserValues = Object.values(updatedData);

    const queryString = `
    UPDATE users 
    SET (%I) = ROW(%L) 
    WHERE id = %L
    RETURNING id, "name", email, "admin", active
    `;

    const formattedQueryString = format(
      queryString,
      updatedUserKeys,
      updatedUserValues,
      updatedUserId
    );

    const queryResult: QueryResult<tSelectUser> = await connection.query(
      formattedQueryString
    );

    return queryResult.rows[0];
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

    const foundUser: QueryResult<iId | tSelectUser | tValidateUser | tActive> =
      await connection.query(formattedQueryString);

    return foundUser.rows[0];
  };

  export const getAllUsers = async () => {
    const queryResult: QueryResult<tSelectUser> = await connection.query(
      'SELECT id, "name", email, "admin", active FROM users'
    );

    return queryResult.rows;
  };

  export const login = async (userData: tLoginData): Promise<iToken> => {
    const { email: loginEmail, password: loginPassword } = userData;

    const userWithSameEmail = (await getUserDataByField(
      loginEmail,
      ["email", "password", "active"],
      "email"
    )) as tValidateUser;

    const userIsNotActive = !userWithSameEmail?.active;
    const userWasNotFound = !userWithSameEmail;
    const userDontHasSamePassword = !(await compare(
      loginPassword,
      String(userWithSameEmail?.password)
    ));

    if (userWasNotFound || userDontHasSamePassword) {
      throw new InvalidLoginDataError("Wrong email/password", 401);
    } else if (userIsNotActive) {
      throw new UserStatusError("The user is not active", 401);
    }

    const token = sign({ email: loginEmail }, String(process.env.SECRET_KEY), {
      expiresIn: "24h",
      subject: loginEmail,
    });

    return { token };
  };

  export const recoverUser = async (recoveredUserId: number) => {
    const recoveredUserData: iStatus = (await getUserDataByField(
      String(recoveredUserId),
      ["active"],
      "id"
    )) as tActive;

    if (recoveredUserData.active) {
      throw new UserStatusError("User already active", 400);
    }

    const newActiveStatus: iStatus = { active: true };

    const recoveredUser = await updateUser(newActiveStatus, recoveredUserId);

    return recoveredUser;
  };
}
