/** Types generated for queries found in "db/queries/sessions.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type DateOrString = Date | string;

export type NumberOrString = number | string;

/** 'CreateSession' parameters type */
export interface ICreateSessionParams {
  expires_at?: DateOrString | null | void;
  id?: string | null | void;
  user_id?: NumberOrString | null | void;
}

/** 'CreateSession' return type */
export interface ICreateSessionResult {
  created_at: Date;
  expires_at: Date;
  id: string;
  user_id: string;
}

/** 'CreateSession' query type */
export interface ICreateSessionQuery {
  params: ICreateSessionParams;
  result: ICreateSessionResult;
}

const createSessionIR: any = {"usedParamSet":{"id":true,"user_id":true,"expires_at":true},"params":[{"name":"id","required":false,"transform":{"type":"scalar"},"locs":[{"a":74,"b":76}]},{"name":"user_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":83,"b":90}]},{"name":"expires_at","required":false,"transform":{"type":"scalar"},"locs":[{"a":97,"b":107}]}],"statement":"INSERT INTO sessions (\n    id,\n    user_id,\n    expires_at\n)\nVALUES (\n    :id,\n    :user_id,\n    :expires_at\n)\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO sessions (
 *     id,
 *     user_id,
 *     expires_at
 * )
 * VALUES (
 *     :id,
 *     :user_id,
 *     :expires_at
 * )
 * RETURNING *
 * ```
 */
export const createSession = new PreparedQuery<ICreateSessionParams,ICreateSessionResult>(createSessionIR);


/** 'GetSession' parameters type */
export interface IGetSessionParams {
  id?: string | null | void;
}

/** 'GetSession' return type */
export interface IGetSessionResult {
  created_at: Date;
  expires_at: Date;
  id: string;
  user_id: string;
}

/** 'GetSession' query type */
export interface IGetSessionQuery {
  params: IGetSessionParams;
  result: IGetSessionResult;
}

const getSessionIR: any = {"usedParamSet":{"id":true},"params":[{"name":"id","required":false,"transform":{"type":"scalar"},"locs":[{"a":84,"b":86}]}],"statement":"SELECT\n    id,\n    user_id,\n    expires_at,\n    created_at\nFROM sessions\nWHERE id = :id"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *     id,
 *     user_id,
 *     expires_at,
 *     created_at
 * FROM sessions
 * WHERE id = :id
 * ```
 */
export const getSession = new PreparedQuery<IGetSessionParams,IGetSessionResult>(getSessionIR);


/** 'DeleteSession' parameters type */
export interface IDeleteSessionParams {
  id?: string | null | void;
}

/** 'DeleteSession' return type */
export type IDeleteSessionResult = void;

/** 'DeleteSession' query type */
export interface IDeleteSessionQuery {
  params: IDeleteSessionParams;
  result: IDeleteSessionResult;
}

const deleteSessionIR: any = {"usedParamSet":{"id":true},"params":[{"name":"id","required":false,"transform":{"type":"scalar"},"locs":[{"a":32,"b":34}]}],"statement":"DELETE FROM sessions\nWHERE id = :id"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM sessions
 * WHERE id = :id
 * ```
 */
export const deleteSession = new PreparedQuery<IDeleteSessionParams,IDeleteSessionResult>(deleteSessionIR);


