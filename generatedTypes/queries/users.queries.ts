/** Types generated for queries found in "db/queries/users.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type NumberOrString = number | string;

/** 'FindUserByEmail' parameters type */
export interface IFindUserByEmailParams {
  email?: string | null | void;
}

/** 'FindUserByEmail' return type */
export interface IFindUserByEmailResult {
  created_at: Date;
  email: string;
  id: string;
  password: string;
}

/** 'FindUserByEmail' query type */
export interface IFindUserByEmailQuery {
  params: IFindUserByEmailParams;
  result: IFindUserByEmailResult;
}

const findUserByEmailIR: any = {"usedParamSet":{"email":true},"params":[{"name":"email","required":false,"transform":{"type":"scalar"},"locs":[{"a":80,"b":85}]}],"statement":"SELECT\n    id,\n    email,\n    password,\n    created_at\nFROM users\nWHERE email = :email"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *     id,
 *     email,
 *     password,
 *     created_at
 * FROM users
 * WHERE email = :email
 * ```
 */
export const findUserByEmail = new PreparedQuery<IFindUserByEmailParams,IFindUserByEmailResult>(findUserByEmailIR);


/** 'CreateUser' parameters type */
export interface ICreateUserParams {
  email?: string | null | void;
  password?: string | null | void;
}

/** 'CreateUser' return type */
export interface ICreateUserResult {
  created_at: Date;
  email: string;
  id: string;
}

/** 'CreateUser' query type */
export interface ICreateUserQuery {
  params: ICreateUserParams;
  result: ICreateUserResult;
}

const createUserIR: any = {"usedParamSet":{"email":true,"password":true},"params":[{"name":"email","required":false,"transform":{"type":"scalar"},"locs":[{"a":59,"b":64}]},{"name":"password","required":false,"transform":{"type":"scalar"},"locs":[{"a":71,"b":79}]}],"statement":"INSERT INTO users (\n    email,\n    password\n)\nVALUES (\n    :email,\n    :password\n)\nRETURNING\n    id,\n    email,\n    created_at"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO users (
 *     email,
 *     password
 * )
 * VALUES (
 *     :email,
 *     :password
 * )
 * RETURNING
 *     id,
 *     email,
 *     created_at
 * ```
 */
export const createUser = new PreparedQuery<ICreateUserParams,ICreateUserResult>(createUserIR);


/** 'FindUserById' parameters type */
export interface IFindUserByIdParams {
  id?: NumberOrString | null | void;
}

/** 'FindUserById' return type */
export interface IFindUserByIdResult {
  created_at: Date;
  email: string;
  id: string;
}

/** 'FindUserById' query type */
export interface IFindUserByIdQuery {
  params: IFindUserByIdParams;
  result: IFindUserByIdResult;
}

const findUserByIdIR: any = {"usedParamSet":{"id":true},"params":[{"name":"id","required":false,"transform":{"type":"scalar"},"locs":[{"a":63,"b":65}]}],"statement":"SELECT\n    id,\n    email,\n    created_at\nFROM users\nWHERE id = :id"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *     id,
 *     email,
 *     created_at
 * FROM users
 * WHERE id = :id
 * ```
 */
export const findUserById = new PreparedQuery<IFindUserByIdParams,IFindUserByIdResult>(findUserByIdIR);


