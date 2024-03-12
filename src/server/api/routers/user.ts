import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
    create: publicProcedure.input(
        z.object({
            id: z.string(),
            name: z.string(),
            email: z.string(),
        })
    ).mutation(async ({ctx, input :{id, email, name}}) => {
        const user = ctx.db.user.create({
            data: {
                id, 
                email, 
                name
            }
        })
    })
})