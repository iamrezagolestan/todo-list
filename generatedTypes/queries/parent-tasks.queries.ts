/** Types generated for queries found in "db/queries/parent-tasks.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type NumberOrString = number | string;

/** 'GetParentTasks' parameters type */
export interface IGetParentTasksParams {
  user_id?: NumberOrString | null | void;
}

/** 'GetParentTasks' return type */
export interface IGetParentTasksResult {
  id: string;
  title: string;
}

/** 'GetParentTasks' query type */
export interface IGetParentTasksQuery {
  params: IGetParentTasksParams;
  result: IGetParentTasksResult;
}

const getParentTasksIR: any = {"usedParamSet":{"user_id":true},"params":[{"name":"user_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":78,"b":85}]}],"statement":"SELECT\n    id,\n    title\nFROM tasks \nWHERE is_parent = true\n    AND user_id = :user_id\nORDER BY created_at DESC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *     id,
 *     title
 * FROM tasks 
 * WHERE is_parent = true
 *     AND user_id = :user_id
 * ORDER BY created_at DESC
 * ```
 */
export const getParentTasks = new PreparedQuery<IGetParentTasksParams,IGetParentTasksResult>(getParentTasksIR);


