-- migrate:up
CREATE TABLE tasks (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description VARCHAR(900),
    is_parent BOOLEAN NOT NULL DEFAULT FALSE,
    parent_id BIGINT REFERENCES tasks(id),
    user_id BIGINT NOT NULL REFERENCES users(id),
    days INTEGER[] NOT NULL CHECK (
        cardinality(days) > 0
        AND 0 <= ALL(days)
        AND 6 >= ALL(days)
    ),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)

-- migrate:down

DROP TABLE tasks;