import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const projectRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        date: z.date(),
      }),
    )
    .mutation(async ({ ctx, input: { name, date } }) => {
      return await ctx.db.project.create({
        data: {
          name,
          completeByDate: date,
          user: {
            connect: {
              id: ctx.userId,
            },
          },
        },
      });
    }),

  getAllProjects: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.project.findMany({
      where: {
        userId: ctx.userId,
      },
    });
  }),

  getProjectById: protectedProcedure
    .input(
      z.object({
        id: z.string(), // Correct, since `id` is a string in your Prisma schema
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.project.findUnique({
        where: {
          id: input.id,
        },
      });
    }),

  getAllProjectTasks: protectedProcedure
    .input(
      z.string(
        z.object({
          projectId: z.string(),
        }),
      ),
    )
    .query(async ({ ctx, input: { projectId } }) => {
      return await ctx.db.project.findFirst({
        where: {
          projectId,
        },
        include: {
          tasks: true,
        },
      });
    }),
});
