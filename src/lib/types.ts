import { Prisma } from "@prisma/client";

// Include tasks relation in prisma Project type
const projectWithTasks = Prisma.validator<Prisma.ProjectDefaultArgs>()({
  include: { tasks: true },
});

export type ProjectWithTasks = Prisma.ProjectGetPayload<
  typeof projectWithTasks
>;
