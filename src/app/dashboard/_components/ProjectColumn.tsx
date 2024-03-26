import { useDroppable } from "@dnd-kit/core";
import type { ProjectState } from "../_context/DashboardContext";
import { Button } from "~/components/ui/button";
import { PlusIcon } from "lucide-react";
import Project from "./Project";

type ProjectColumnProps = {
  title: string;
  projects: ProjectState[];
  handleAddNewProject: (
    status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETE",
  ) => void;
};

export default function ProjectColumn({
  title,
  projects,
  handleAddNewProject,
}: ProjectColumnProps) {
  const { setNodeRef } = useDroppable({
    id: title,
  });
  const status =
    title === "Not Started"
      ? "NOT_STARTED"
      : title === "In Progress"
        ? "IN_PROGRESS"
        : "COMPLETE";

  return (
    <div ref={setNodeRef}>
      {projects?.map((project, index) => {
        return (
          <Project
            key={project.id}
            id={project.id}
            name={project.id}
            due={project.due}
            status={project.status}
            index={index}
          />
        );
      })}
      <Button
        onClick={() => handleAddNewProject(status)}
        variant="outline"
        className="flex h-10 w-full"
      >
        <PlusIcon className="h-4 w-4" />
        <span className="pl-2">New Project</span>
      </Button>
    </div>
  );
}
