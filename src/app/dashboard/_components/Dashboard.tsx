"use client";

import type { Task } from "@prisma/client";
import { DashboardProvider } from "../_context/DashboardContext";
import Tasks from "./Tasks";
import Projects from "./Projects";
import type { ProjectWithTasks } from "~/lib/types";

export default function Dashboard({
  projects,
  tasks,
}: {
  projects: ProjectWithTasks[];
  tasks: Task[];
}) {
  return (
    <DashboardProvider projects={projects} tasks={tasks}>
      <Tasks />
      <Projects />
    </DashboardProvider>
  );
}
