/* @name CreateTask */
INSERT INTO tasks (
    title,
    description,
    is_parent,
    parent_id,
    user_id,
    days
) 
VALUES (
    :title,
    :description,
    :is_parent,
    :parent_id,
    :user_id,
    :days
)
RETURNING *;
