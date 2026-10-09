/* @name GetTasks */
SELECT t.*, ARRAY(
    SELECT c.day FROM task_completions c WHERE c.task_id = t.id AND c.is_done ORDER BY c.day
) AS "completed_days!", EXISTS (
    SELECT 1 FROM tasks child WHERE child.parent_id = t.id AND child.user_id = t.user_id
) AS "has_children!"
FROM tasks t
WHERE t.user_id = :user_id!
AND (
    (:mode! = 'day' AND :day!::integer = ANY(t.days))
    OR (:mode! = 'parents' AND t.is_parent AND t.parent_id IS NULL)
    OR (:mode! = 'children' AND t.parent_id = :parent_id::bigint)
    OR (:mode! = 'choices' AND t.is_parent)
)
ORDER BY t.created_at DESC, t.id DESC
LIMIT :limit!::integer OFFSET :offset!::integer;

/* @name FindTask */
SELECT * FROM tasks WHERE id = :id! AND user_id = :user_id!;

/* @name GetTaskAncestors */
WITH RECURSIVE ancestors AS (
    SELECT id, parent_id, 0 AS depth FROM tasks WHERE id = :id! AND user_id = :user_id!
    UNION ALL
    SELECT t.id, t.parent_id, a.depth + 1
    FROM tasks t JOIN ancestors a ON t.id = a.parent_id
    WHERE t.user_id = :user_id!
)
SELECT id AS "id!" FROM ancestors ORDER BY depth;

/* @name SyncParent */
UPDATE tasks t SET is_done = (
    SELECT count(*) > 0 AND bool_and(child.is_done)
    FROM tasks child WHERE child.parent_id = t.id AND child.user_id = t.user_id
)
WHERE t.id = :id! AND t.user_id = :user_id! AND t.is_parent;

/* @name SetTaskDone */
INSERT INTO task_completions (task_id, day, is_done)
SELECT id, :day!::integer, :is_done! FROM tasks
WHERE id = :id! AND user_id = :user_id! AND NOT is_parent AND :day!::integer = ANY(days)
ON CONFLICT (task_id, day) DO UPDATE SET is_done = EXCLUDED.is_done;

/* @name SyncTaskDone */
UPDATE tasks t SET is_done = NOT EXISTS (
    SELECT 1 FROM unnest(t.days) AS scheduled(day)
    WHERE NOT EXISTS (
        SELECT 1 FROM task_completions c WHERE c.task_id = t.id AND c.day = scheduled.day AND c.is_done
    )
)
WHERE t.id = :id! AND t.user_id = :user_id! AND NOT t.is_parent;
