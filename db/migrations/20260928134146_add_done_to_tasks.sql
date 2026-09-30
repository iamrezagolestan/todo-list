-- migrate:up
ALTER TABLE tasks
ADD COLUMN is_done BOOLEAN NOT NULL DEFAULT false; 

-- migrate:down

ALTER TABLE tasks;
DROP COLUMN is_done;