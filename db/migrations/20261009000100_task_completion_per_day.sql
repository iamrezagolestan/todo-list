-- migrate:up
CREATE TABLE task_completions (
    task_id BIGINT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    day INTEGER NOT NULL CHECK (day BETWEEN 0 AND 6),
    is_done BOOLEAN NOT NULL DEFAULT false,
    PRIMARY KEY (task_id, day)
);
INSERT INTO task_completions (task_id, day, is_done)
SELECT DISTINCT t.id, day, t.is_done FROM tasks t CROSS JOIN unnest(t.days) day
WHERE NOT t.is_parent AND day IS NOT NULL;

-- migrate:down
DROP TABLE task_completions;
