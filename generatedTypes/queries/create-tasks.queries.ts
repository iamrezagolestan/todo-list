/** Types generated for queries found in "db/queries/create-tasks.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type NumberOrString = number | string;

export type numberArray = (number)[];

/** 'CreateTask' parameters type */
export interface ICreateTaskParams {
  days?: numberArray | null | void;
  description?: string | null | void;
  is_parent?: boolean | null | void;
  parent_id?: NumberOrString | null | void;
  title?: string | null | void;
  user_id?: NumberOrString | null | void;
}

/** 'CreateTask' return type */
export interface ICreateTaskResult {
  created_at: Date;
  days: numberArray;
  description: string | null;
  id: string;
  is_parent: boolean;
  parent_id: string | null;
  title: string;
  user_id: string;
}

/** 'CreateTask' query type */
export interface ICreateTaskQuery {
  params: ICreateTaskParams;
  result: ICreateTaskResult;
}

const createTaskIR: any = {"usedParamSet":{"title":true,"description":true,"is_parent":true,"parent_id":true,"user_id":true,"days":true},"params":[{"name":"title","required":false,"transform":{"type":"scalar"},"locs":[{"a":116,"b":121}]},{"name":"description","required":false,"transform":{"type":"scalar"},"locs":[{"a":128,"b":139}]},{"name":"is_parent","required":false,"transform":{"type":"scalar"},"locs":[{"a":146,"b":155}]},{"name":"parent_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":162,"b":171}]},{"name":"user_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":178,"b":185}]},{"name":"days","required":false,"transform":{"type":"scalar"},"locs":[{"a":192,"b":196}]}],"statement":"INSERT INTO tasks (\n    title,\n    description,\n    is_parent,\n    parent_id,\n    user_id,\n    days\n) \nVALUES (\n    :title,\n    :description,\n    :is_parent,\n    :parent_id,\n    :user_id,\n    :days\n)\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO tasks (
 *     title,
 *     description,
 *     is_parent,
 *     parent_id,
 *     user_id,
 *     days
 * ) 
 * VALUES (
 *     :title,
 *     :description,
 *     :is_parent,
 *     :parent_id,
 *     :user_id,
 *     :days
 * )
 * RETURNING *
 * ```
 */
export const createTask = new PreparedQuery<ICreateTaskParams,ICreateTaskResult>(createTaskIR);


