-- migrate:up
ALTER TABLE tasks ADD CONSTRAINT tasks_id_user_unique UNIQUE (id, user_id);
ALTER TABLE tasks ADD CONSTRAINT tasks_parent_owner_fkey
    FOREIGN KEY (parent_id, user_id) REFERENCES tasks (id, user_id) ON DELETE CASCADE;
ALTER TABLE tasks ADD CONSTRAINT tasks_not_self_parent CHECK (parent_id IS DISTINCT FROM id);
CREATE INDEX tasks_user_parent_created_idx ON tasks (user_id, parent_id, created_at DESC, id DESC);
CREATE INDEX tasks_days_idx ON tasks USING gin (days);

-- migrate:down
DROP INDEX tasks_days_idx;
DROP INDEX tasks_user_parent_created_idx;
ALTER TABLE tasks DROP CONSTRAINT tasks_not_self_parent;
ALTER TABLE tasks DROP CONSTRAINT tasks_parent_owner_fkey;
ALTER TABLE tasks DROP CONSTRAINT tasks_id_user_unique;
