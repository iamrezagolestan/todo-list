/** Types generated for queries found in "db/queries/get-tasks.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type NumberOrString = number | string;

export type numberArray = (number)[];

/** 'GetTasks' parameters type */
export interface IGetTasksParams {
  user_id?: NumberOrString | null | void;
}

/** 'GetTasks' return type */
export interface IGetTasksResult {
  created_at: Date;
  days: numberArray;
  description: string | null;
  id: string;
  is_parent: boolean;
  parent_id: string | null;
  title: string;
  user_id: string;
}

/** 'GetTasks' query type */
export interface IGetTasksQuery {
  params: IGetTasksParams;
  result: IGetTasksResult;
}

const getTasksIR: any = {"usedParamSet":{"user_id":true},"params":[{"name":"user_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":41,"b":48}]}],"statement":"SELECT * FROM tasks \n    WHERE user_id = :user_id\n    AND is_parent = false"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM tasks 
 *     WHERE user_id = :user_id
 *     AND is_parent = false
 * ```
 */
export const getTasks = new PreparedQuery<IGetTasksParams,IGetTasksResult>(getTasksIR);


