import { postRouter } from "~/server/api/routers/post";
import { projectRouter } from "./routers/project";
import { createTRPCRouter } from "~/server/api/trpc";
import { pomodoroRouter } from "./routers/pomodoro";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  project: projectRouter,
  pomodoro: pomodoroRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
