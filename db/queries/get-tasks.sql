/* @name GetTasks */
SELECT * FROM tasks 
    WHERE user_id = :user_id
    AND is_parent = false;