import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const taskRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string(),
        status: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETE"]),
        due: z.date().optional(),
        priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
        notes: z.string().optional(),
        projectId: z.string().optional(),
      }),
    )
    .mutation(
      async ({
        ctx,
        input: { id, name, due, status, priority, notes, projectId },
      }) => {
        let task = await ctx.db.task.create({
          data: {
            id,
            status,
            name,
            priority,
            notes,
            user: {
              connect: {
                id: ctx.userId,
              },
            },
          },
        });

        // Link to project if it exists
        if (projectId) {
          task = await ctx.db.task.update({
            where: {
              id: task.id,
            },
            data: {
              project: {
                connect: {
                  id: projectId,
                },
              },
            },
            include: {
              project: true,
            },
          });
        }

        // Add due date if it exists
        if (due) {
          task = await ctx.db.task.update({
            where: {
              id: task.id,
            },
            data: {
              due,
            },
          });
        }

        return task;
      },
    ),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string(),
        notes: z.string(),
        due: z.date().optional(),
        priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
        projectId: z.string().optional(),
      }),
    )
    .mutation(
      async ({ ctx, input: { id, name, notes, due, priority, projectId } }) => {
        const task = await ctx.db.task.update({
          where: { id },
          data: {
            name,
            notes,
            due,
            priority,
            projectId,
          },
        });

        return task;
      },
    ),
  getAllUserTasks: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.task.findMany({
      where: {
        userId: ctx.userId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }),
});
