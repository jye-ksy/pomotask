// To-do:
// - Make Pomodoro router
// - Hook timer to backend
//   - need to create a random task since its linked to a task
//   - try doing client/server action combo
// - Check if page refresh works

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const pomodoroRouter = createTRPCRouter({
  createPomodoro: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        focusLength: z.number(),
        restLength: z.number(),
      }),
    )
    .mutation(async ({ ctx, input: { taskId, focusLength, restLength } }) => {
      const pomodoro = await ctx.db.pomodoro.create({
        data: {
          taskId,
          focusLength,
          restLength,
          currentFocusTime: focusLength,
          currentRestTime: restLength,
        },
      });

      return pomodoro;
    }),
  getPomodoro: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
      }),
    )
    .query(async ({ ctx, input: { taskId } }) => {
      const pomodoro = await ctx.db.pomodoro.findUnique({
        where: {
          taskId,
        },
      });
      return pomodoro;
    }),
  updateTimerState: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        focusTime: z.number(),
        restTime: z.number(),
      }),
    )
    .mutation(async ({ ctx, input: { taskId, focusTime, restTime } }) => {
      const pomodoro = await ctx.db.pomodoro.update({
        where: { taskId },
        data: {
          currentFocusTime: focusTime,
          currentRestTime: restTime,
        },
      });

      return pomodoro;
    }),
  completePomodoro: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        initialFocusTime: z.number(),
        timeSpentFocusing: z.number(),
      }),
    )
    .mutation(
      async ({
        ctx,
        input: { taskId, initialFocusTime, timeSpentFocusing },
      }) => {
        const pomodoro = await ctx.db.pomodoro.update({
          where: {
            taskId,
          },
          data: {
            currentFocusTime: initialFocusTime,
            pomodorosCompleted: {
              increment: 1,
            },
            totalFocusTime: {
              increment: timeSpentFocusing,
            },
            isResting: true,
          },
        });
        return pomodoro;
      },
    ),
  completeBreakTime: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        initialRestTime: z.number(),
        timeSpentResting: z.number(),
      }),
    )
    .mutation(
      async ({ ctx, input: { taskId, initialRestTime, timeSpentResting } }) => {
        const pomodoro = await ctx.db.pomodoro.update({
          where: {
            taskId,
          },
          data: {
            currentRestTime: initialRestTime,
            isResting: false,
            totalRestTime: {
              increment: timeSpentResting,
            },
          },
        });

        return pomodoro;
      },
    ),
});
