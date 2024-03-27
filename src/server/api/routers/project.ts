import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const projectRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string(),
        status: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETE"]),
        due: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input: { id, name, status, due } }) => {
      const project = await ctx.db.project.create({
        data: {
          id,
          name,
          due,
          status,
          user: {
            connect: {
              id: ctx.userId,
            },
          },
        },
      });

      return project;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input: { id } }) => {
      const project = await ctx.db.project.delete({
        where: { id },
      });

      return project;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string(),
        due: z.date().optional(),
        status: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETE"]).optional(),
      }),
    )
    .mutation(async ({ ctx, input: { id, name, due, status } }) => {
      const project = await ctx.db.project.update({
        where: { id },
        data: {
          name,
          due,
          status,
          updatedAt: new Date(),
        },
      });

      return project;
    }),
  getAllProjects: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.project.findMany({
      where: {
        userId: ctx.userId,
      },
      include: {
        tasks: true,
      },
      orderBy: {
        createdAt: "asc",
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
});
