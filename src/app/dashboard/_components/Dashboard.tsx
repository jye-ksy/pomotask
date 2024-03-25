"use client";

import type { Project, Task } from "@prisma/client";
import { DashboardProvider } from "../_context/DashboardContext";
import Tasks from "./Tasks";

export default function Dashboard({
  projects,
  tasks,
}: {
  projects: Project[];
  tasks: Task[];
}) {
  return (
    <DashboardProvider projects={projects} tasks={tasks}>
      {/* <Projects /> */}
      <Tasks />
    </DashboardProvider>
  );
}
