import { computersRouter } from "./computers";
import { router } from "@/lib/server/trpc";
import { usersRouter } from "./users";
import { leadersRouter } from "./leaders";
import { votersRouter } from "./voters";

export const appRouter = router({
  computers: computersRouter,
  users: usersRouter,
  leaders: leadersRouter,
  voters: votersRouter,
});

export type AppRouter = typeof appRouter;
