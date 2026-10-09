# Next.js template

This is a Next.js template with shadcn/ui.

## Task behavior

Tasks can be scheduled for multiple weekdays (Saturday = 0, Friday = 6).
Completion is stored independently for each scheduled weekday in `task_completions`.
The daily view filters tasks by the signed-in user and the selected weekday.
It opens on today's weekday in `Asia/Tehran` unless a valid `day` query parameter
selects another day. The explicit selection is preserved on reload.
Deleting a task removes it from every weekday; deleting a parent also removes all descendants.

Parents may belong to another parent. The parent view initially shows root parents,
then loads direct children when a branch is opened. A parent's completion is automatic:
every scheduled weekday of every child must be complete. An empty parent remains incomplete.
Creating, deleting, or changing a child recalculates its ancestors in the same transaction.

Apply database migrations and regenerate pgTyped queries before running the application:

```bash
bun run db:up
bun run db:generate
```

## Task integration checks

Start a local server in one terminal:

```bash
bun run dev -- --port 3100
```

Run the checks in another terminal:

```bash
bunx dotenv -e .env -- bun test tests/tasks.integration.test.ts
```

The checks use temporary users and tasks in the configured PostgreSQL database and
remove those fixtures afterward. Set `TASK_TEST_URL` to use a different local server.
They cover independent weekday completion, ownership, validation, concurrent updates,
nested parent completion, cascade deletion, and bounded pagination.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button";
```
