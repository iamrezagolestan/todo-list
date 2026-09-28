/* @name CreateSession */

INSERT INTO sessions (
    id,
    user_id,
    expires_at
)
VALUES (
    :id,
    :user_id,
    :expires_at
)
RETURNING *;

/* @name GetSession */

SELECT
    id,
    user_id,
    expires_at,
    created_at
FROM sessions
WHERE id = :id;

/* @name DeleteSession */

DELETE FROM sessions
WHERE id = :id;
