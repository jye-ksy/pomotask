"use client";

import { useContext } from "react";
import { DashboardContext } from "../_context/DashboardContext";
import ProjectCard from "~/app/_components/ProjectCard";
import NewProjectCard from "~/app/_components/NewProjectCard";
import { Button } from "~/components/ui/button";
import { useSidebarContext } from "~/lib/useSidebarContext";

export default function Projects() {
  const { dashboard } = useContext(DashboardContext)!;
  const { projects } = dashboard;
  const { toggleSideBar } = useSidebarContext();

  return (
    <>
      <h1 className="mb-8 text-xl font-bold">My Projects</h1>
      <div className="container flex w-full flex-col gap-8 md:flex-row md:flex-wrap md:gap-8">
        {projects?.map((project) => {
          return (
            <ProjectCard
              key={project.id}
              name={project.name}
              projectId={project.id.toString()}
            />
          );
        })}
        <NewProjectCard />
        <Button variant="outline" onClick={toggleSideBar}>
          Add Task
        </Button>
      </div>
    </>
  );
}
