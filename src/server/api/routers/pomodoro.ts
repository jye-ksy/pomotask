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
        isResting: z.boolean(),
      }),
    )
    .mutation(
      async ({ ctx, input: { taskId, focusTime, restTime, isResting } }) => {
        const pomodoro = await ctx.db.pomodoro.update({
          where: { taskId },
          data: {
            currentFocusTime: focusTime,
            currentRestTime: restTime,
            isResting,
          },
        });

        return pomodoro;
      },
    ),
  completePomodoro: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        focusLength: z.number(),
        timeSpentFocusing: z.number(),
      }),
    )
    .mutation(
      async ({ ctx, input: { taskId, focusLength, timeSpentFocusing } }) => {
        const pomodoro =
          timeSpentFocusing > 0
            ? await ctx.db.pomodoro.update({
                where: {
                  taskId,
                },
                data: {
                  currentFocusTime: focusLength,
                  pomodorosCompleted: {
                    increment: 1,
                  },
                  totalFocusTime: {
                    increment: timeSpentFocusing,
                  },
                  isResting: true,
                },
              })
            : await ctx.db.pomodoro.update({
                where: {
                  taskId,
                },
                data: {
                  currentFocusTime: focusLength,
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
        restLength: z.number(),
        timeSpentResting: z.number(),
      }),
    )
    .mutation(
      async ({ ctx, input: { taskId, restLength, timeSpentResting } }) => {
        const pomodoro = await ctx.db.pomodoro.update({
          where: {
            taskId,
          },
          data: {
            currentRestTime: restLength,
            isResting: false,
            totalRestTime: {
              increment: timeSpentResting,
            },
          },
        });

        return pomodoro;
      },
    ),
  updateTimerLength: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        focusLength: z.number(),
        restLength: z.number(),
        currentFocusTime: z.number(),
        currentRestTime: z.number(),
      }),
    )
    .mutation(
      async ({
        ctx,
        input: {
          taskId,
          focusLength,
          restLength,
          currentFocusTime,
          currentRestTime,
        },
      }) => {
        const pomodoro = await ctx.db.pomodoro.update({
          where: {
            taskId,
          },
          data: {
            focusLength,
            restLength,
            currentFocusTime,
            currentRestTime,
          },
        });

        return pomodoro;
      },
    ),
});
