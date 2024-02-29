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
    .mutation(async ({ ctx, input }) => {

      return ctx.db.project.create({
        data: {
          name: input.name,
          completeByDate: input.date,
          userId: ctx.userId
        },
      });
    }),

  getAllProjects: protectedProcedure
    .query(async ({ctx}) => {
      return ctx.db.project.findMany({
        where: {
          userId: ctx.userId
        }
      })
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
});
