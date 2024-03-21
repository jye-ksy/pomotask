import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const taskRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2).max(250, {
          message: "Project needs a name",
        }),
        status: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETE"]),
        due: z.date().optional(),
        priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
        notes: z.string().optional(),
        projectId: z.string(),
      }),
    )
    .mutation(
      async ({
        ctx,
        input: { name, due, status, priority, notes, projectId },
      }) => {
        let task = await ctx.db.task.create({
          data: {
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

  getAllUserTasks: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.task.findMany({
      where: {
        userId: ctx.userId,
      },
    });
  }),
});
