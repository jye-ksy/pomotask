import { z } from "zod";

import {
  createTRPCRouter,
  // protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const projectRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        date: z.date(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {

      return ctx.db.project.create({
        data: {
          name: input.name,
          completeByDate: input.date,
          userId: input.userId,
        },
      });
    }),
});
