/* @name GetParentTasks */
SELECT
    id,
    title
FROM tasks 
WHERE is_parent = true
    AND user_id = :user_id
ORDER BY created_at DESC;