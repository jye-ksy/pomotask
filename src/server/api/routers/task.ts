import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const taskRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
        z.object({
            name: z.string().min(2).max(250, {
              message: "Project needs a name",
            }),
            status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETE']),
            due: z.date(), 
            priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
            notes: z.union([z.string().length(0), z.string().min(4)])
            .optional()
            .transform(e => e === "" ? undefined : e)
          })
    )
    .mutation(async ({ ctx, input: {name, due, status, priority, notes } }) => {

      return ctx.db.task.create({
        data: {
            status,
            name,
            due,
            priority,
            notes,
            userId: ctx.userId
        },
      });
    }),


    getAllUserTasks: protectedProcedure
    .query(async ({ctx}) => {
      return ctx.db.task.findMany({
        where: {
          userId: ctx.userId
        }
      })
    }),

});
