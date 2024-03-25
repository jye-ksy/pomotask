"use client";

import { Project, Task } from "@prisma/client";
import NewProjectCard from "~/app/_components/NewProjectCard";
import ProjectCard from "~/app/_components/ProjectCard";
import { Button } from "~/components/ui/button";
import { useSidebarContext } from "~/lib/useSidebarContext";
import Projects from "./Projects";
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
