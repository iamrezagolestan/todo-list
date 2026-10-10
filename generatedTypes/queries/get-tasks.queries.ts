/** Types generated for queries found in "db/queries/get-tasks.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type NumberOrString = number | string;

export type numberArray = (number)[];

/** 'GetTasks' parameters type */
export interface IGetTasksParams {
  day: number;
  limit: number;
  mode: string;
  offset: number;
  parent_id?: NumberOrString | null | void;
  user_id: NumberOrString;
}

/** 'GetTasks' return type */
export interface IGetTasksResult {
  completed_days: numberArray;
  created_at: Date;
  days: numberArray;
  description: string | null;
  has_children: boolean;
  id: string;
  is_done: boolean;
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

const getTasksIR: any = {"usedParamSet":{"user_id":true,"mode":true,"day":true,"parent_id":true,"limit":true,"offset":true},"params":[{"name":"user_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":286,"b":294}]},{"name":"mode","required":true,"transform":{"type":"scalar"},"locs":[{"a":307,"b":312},{"a":384,"b":389},{"a":452,"b":457},{"a":518,"b":523}]},{"name":"day","required":true,"transform":{"type":"scalar"},"locs":[{"a":346,"b":350}]},{"name":"parent_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":490,"b":499}]},{"name":"limit","required":true,"transform":{"type":"scalar"},"locs":[{"a":600,"b":606}]},{"name":"offset","required":true,"transform":{"type":"scalar"},"locs":[{"a":624,"b":631}]}],"statement":"SELECT t.*, ARRAY(\n    SELECT c.day FROM task_completions c WHERE c.task_id = t.id AND c.is_done ORDER BY c.day\n) AS \"completed_days!\", EXISTS (\n    SELECT 1 FROM tasks child WHERE child.parent_id = t.id AND child.user_id = t.user_id\n) AS \"has_children!\"\nFROM tasks t\nWHERE t.user_id = :user_id!\nAND (\n    (:mode! = 'day' AND NOT t.is_parent AND :day!::integer = ANY(t.days))\n    OR (:mode! = 'parents' AND t.is_parent AND t.parent_id IS NULL)\n    OR (:mode! = 'children' AND t.parent_id = :parent_id::bigint)\n    OR (:mode! = 'choices' AND t.is_parent)\n)\nORDER BY t.created_at DESC, t.id DESC\nLIMIT :limit!::integer OFFSET :offset!::integer"};

/**
 * Query generated from SQL:
 * ```
 * SELECT t.*, ARRAY(
 *     SELECT c.day FROM task_completions c WHERE c.task_id = t.id AND c.is_done ORDER BY c.day
 * ) AS "completed_days!", EXISTS (
 *     SELECT 1 FROM tasks child WHERE child.parent_id = t.id AND child.user_id = t.user_id
 * ) AS "has_children!"
 * FROM tasks t
 * WHERE t.user_id = :user_id!
 * AND (
 *     (:mode! = 'day' AND NOT t.is_parent AND :day!::integer = ANY(t.days))
 *     OR (:mode! = 'parents' AND t.is_parent AND t.parent_id IS NULL)
 *     OR (:mode! = 'children' AND t.parent_id = :parent_id::bigint)
 *     OR (:mode! = 'choices' AND t.is_parent)
 * )
 * ORDER BY t.created_at DESC, t.id DESC
 * LIMIT :limit!::integer OFFSET :offset!::integer
 * ```
 */
export const getTasks = new PreparedQuery<IGetTasksParams,IGetTasksResult>(getTasksIR);


/** 'FindTask' parameters type */
export interface IFindTaskParams {
  id: NumberOrString;
  user_id: NumberOrString;
}

/** 'FindTask' return type */
export interface IFindTaskResult {
  created_at: Date;
  days: numberArray;
  description: string | null;
  id: string;
  is_done: boolean;
  is_parent: boolean;
  parent_id: string | null;
  title: string;
  user_id: string;
}

/** 'FindTask' query type */
export interface IFindTaskQuery {
  params: IFindTaskParams;
  result: IFindTaskResult;
}

const findTaskIR: any = {"usedParamSet":{"id":true,"user_id":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":31,"b":34}]},{"name":"user_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":50,"b":58}]}],"statement":"SELECT * FROM tasks WHERE id = :id! AND user_id = :user_id!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM tasks WHERE id = :id! AND user_id = :user_id!
 * ```
 */
export const findTask = new PreparedQuery<IFindTaskParams,IFindTaskResult>(findTaskIR);


/** 'GetTaskAncestors' parameters type */
export interface IGetTaskAncestorsParams {
  id: NumberOrString;
  user_id: NumberOrString;
}

/** 'GetTaskAncestors' return type */
export interface IGetTaskAncestorsResult {
  id: string;
}

/** 'GetTaskAncestors' query type */
export interface IGetTaskAncestorsQuery {
  params: IGetTaskAncestorsParams;
  result: IGetTaskAncestorsResult;
}

const getTaskAncestorsIR: any = {"usedParamSet":{"id":true,"user_id":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":89,"b":92}]},{"name":"user_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":108,"b":116},{"a":252,"b":260}]}],"statement":"WITH RECURSIVE ancestors AS (\n    SELECT id, parent_id, 0 AS depth FROM tasks WHERE id = :id! AND user_id = :user_id!\n    UNION ALL\n    SELECT t.id, t.parent_id, a.depth + 1\n    FROM tasks t JOIN ancestors a ON t.id = a.parent_id\n    WHERE t.user_id = :user_id!\n)\nSELECT id AS \"id!\" FROM ancestors ORDER BY depth"};

/**
 * Query generated from SQL:
 * ```
 * WITH RECURSIVE ancestors AS (
 *     SELECT id, parent_id, 0 AS depth FROM tasks WHERE id = :id! AND user_id = :user_id!
 *     UNION ALL
 *     SELECT t.id, t.parent_id, a.depth + 1
 *     FROM tasks t JOIN ancestors a ON t.id = a.parent_id
 *     WHERE t.user_id = :user_id!
 * )
 * SELECT id AS "id!" FROM ancestors ORDER BY depth
 * ```
 */
export const getTaskAncestors = new PreparedQuery<IGetTaskAncestorsParams,IGetTaskAncestorsResult>(getTaskAncestorsIR);


/** 'SyncParent' parameters type */
export interface ISyncParentParams {
  id: NumberOrString;
  user_id: NumberOrString;
}

/** 'SyncParent' return type */
export type ISyncParentResult = void;

/** 'SyncParent' query type */
export interface ISyncParentQuery {
  params: ISyncParentParams;
  result: ISyncParentResult;
}

const syncParentIR: any = {"usedParamSet":{"id":true,"user_id":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":178,"b":181}]},{"name":"user_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":199,"b":207}]}],"statement":"UPDATE tasks t SET is_done = (\n    SELECT count(*) > 0 AND bool_and(child.is_done)\n    FROM tasks child WHERE child.parent_id = t.id AND child.user_id = t.user_id\n)\nWHERE t.id = :id! AND t.user_id = :user_id! AND t.is_parent"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE tasks t SET is_done = (
 *     SELECT count(*) > 0 AND bool_and(child.is_done)
 *     FROM tasks child WHERE child.parent_id = t.id AND child.user_id = t.user_id
 * )
 * WHERE t.id = :id! AND t.user_id = :user_id! AND t.is_parent
 * ```
 */
export const syncParent = new PreparedQuery<ISyncParentParams,ISyncParentResult>(syncParentIR);


/** 'SetTaskDone' parameters type */
export interface ISetTaskDoneParams {
  day: number;
  id: NumberOrString;
  is_done: boolean;
  user_id: NumberOrString;
}

/** 'SetTaskDone' return type */
export type ISetTaskDoneResult = void;

/** 'SetTaskDone' query type */
export interface ISetTaskDoneQuery {
  params: ISetTaskDoneParams;
  result: ISetTaskDoneResult;
}

const setTaskDoneIR: any = {"usedParamSet":{"day":true,"is_done":true,"id":true,"user_id":true},"params":[{"name":"day","required":true,"transform":{"type":"scalar"},"locs":[{"a":64,"b":68},{"a":163,"b":167}]},{"name":"is_done","required":true,"transform":{"type":"scalar"},"locs":[{"a":80,"b":88}]},{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":112,"b":115}]},{"name":"user_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":131,"b":139}]}],"statement":"INSERT INTO task_completions (task_id, day, is_done)\nSELECT id, :day!::integer, :is_done! FROM tasks\nWHERE id = :id! AND user_id = :user_id! AND NOT is_parent AND :day!::integer = ANY(days)\nON CONFLICT (task_id, day) DO UPDATE SET is_done = EXCLUDED.is_done"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO task_completions (task_id, day, is_done)
 * SELECT id, :day!::integer, :is_done! FROM tasks
 * WHERE id = :id! AND user_id = :user_id! AND NOT is_parent AND :day!::integer = ANY(days)
 * ON CONFLICT (task_id, day) DO UPDATE SET is_done = EXCLUDED.is_done
 * ```
 */
export const setTaskDone = new PreparedQuery<ISetTaskDoneParams,ISetTaskDoneResult>(setTaskDoneIR);


/** 'SyncTaskDone' parameters type */
export interface ISyncTaskDoneParams {
  id: NumberOrString;
  user_id: NumberOrString;
}

/** 'SyncTaskDone' return type */
export type ISyncTaskDoneResult = void;

/** 'SyncTaskDone' query type */
export interface ISyncTaskDoneQuery {
  params: ISyncTaskDoneParams;
  result: ISyncTaskDoneResult;
}

const syncTaskDoneIR: any = {"usedParamSet":{"id":true,"user_id":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":241,"b":244}]},{"name":"user_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":262,"b":270}]}],"statement":"UPDATE tasks t SET is_done = NOT EXISTS (\n    SELECT 1 FROM unnest(t.days) AS scheduled(day)\n    WHERE NOT EXISTS (\n        SELECT 1 FROM task_completions c WHERE c.task_id = t.id AND c.day = scheduled.day AND c.is_done\n    )\n)\nWHERE t.id = :id! AND t.user_id = :user_id! AND NOT t.is_parent"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE tasks t SET is_done = NOT EXISTS (
 *     SELECT 1 FROM unnest(t.days) AS scheduled(day)
 *     WHERE NOT EXISTS (
 *         SELECT 1 FROM task_completions c WHERE c.task_id = t.id AND c.day = scheduled.day AND c.is_done
 *     )
 * )
 * WHERE t.id = :id! AND t.user_id = :user_id! AND NOT t.is_parent
 * ```
 */
export const syncTaskDone = new PreparedQuery<ISyncTaskDoneParams,ISyncTaskDoneResult>(syncTaskDoneIR);


