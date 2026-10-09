/* @name DeleteTasks */

DELETE FROM tasks
WHERE id = :id
  AND user_id = :user_id
RETURNING id;
