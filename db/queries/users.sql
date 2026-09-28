/* @name FindUserByEmail */
SELECT
    id,
    email,
    password,
    created_at
FROM users
WHERE email = :email;

/* @name CreateUser */
INSERT INTO users (
    email,
    password
)
VALUES (
    :email,
    :password
)
RETURNING
    id,
    email,
    created_at;

/* @name FindUserById */

SELECT
    id,
    email,
    created_at
FROM users
WHERE id = :id;