/** Types generated for queries found in "db/queries/delete-tasks.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type NumberOrString = number | string;

/** 'DeleteTasks' parameters type */
export interface IDeleteTasksParams {
  id?: NumberOrString | null | void;
  user_id?: NumberOrString | null | void;
}

/** 'DeleteTasks' return type */
export interface IDeleteTasksResult {
  id: string;
}

/** 'DeleteTasks' query type */
export interface IDeleteTasksQuery {
  params: IDeleteTasksParams;
  result: IDeleteTasksResult;
}

const deleteTasksIR: any = {"usedParamSet":{"id":true,"user_id":true},"params":[{"name":"id","required":false,"transform":{"type":"scalar"},"locs":[{"a":29,"b":31}]},{"name":"user_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":49,"b":56}]}],"statement":"DELETE FROM tasks\nWHERE id = :id\n  AND user_id = :user_id\nRETURNING id"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM tasks
 * WHERE id = :id
 *   AND user_id = :user_id
 * RETURNING id
 * ```
 */
export const deleteTasks = new PreparedQuery<IDeleteTasksParams,IDeleteTasksResult>(deleteTasksIR);


