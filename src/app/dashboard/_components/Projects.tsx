"use client";

import { useContext } from "react";
import { DashboardContext } from "../_context/DashboardContext";
import { v4 as uuid } from "uuid";
import ProjectColumn from "./ProjectColumn";
import { api } from "~/trpc/react";

export default function Projects() {
  const { dashboard, dispatch } = useContext(DashboardContext)!;
  const { projects } = dashboard;
  const createProject = api.project.create.useMutation().mutate;

  // Filter the projects based on their status
  const notStartedProjects = projects.filter(
    (project) => project.status === "NOT_STARTED",
  );
  const inProgressProjects = projects.filter(
    (project) => project.status === "IN_PROGRESS",
  );
  const completedProjects = projects.filter(
    (project) => project.status === "COMPLETE",
  );

  const handleAddNewProject = (
    status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETE",
  ) => {
    const newProjectId = uuid();
    dispatch({
      type: "create-project",
      payload: {
        id: newProjectId,
        status,
      },
    });

    createProject({
      id: newProjectId,
      name: "",
      status,
    });
  };

  return (
    <div className="mx-8  flex flex-col items-center lg:mx-14">
      <div className="flex w-full max-w-7xl justify-center  md:justify-start">
        <h1 className="mb-12  flex justify-center text-3xl font-bold">
          My Projects
        </h1>
      </div>
      <div className="flex w-full flex-col  items-center md:flex-row md:items-start md:justify-center ">
        <div className="flex w-56 max-w-7xl flex-col  md:w-full md:flex-row md:justify-between md:gap-4">
          <div className="md:min-w-auto mb-8 flex min-w-56 flex-col">
            <span className="mb-4 w-28 rounded-xl bg-gray-100 pl-3 text-base font-semibold">
              Not Started
            </span>
            <ProjectColumn
              title="Not Started"
              projects={notStartedProjects}
              handleAddNewProject={handleAddNewProject}
            />
          </div>
          <div className="md:min-w-auto mb-8 flex min-w-56 flex-col">
            <span className="mb-4 w-28 rounded-xl bg-amber-100 pl-3 text-base font-semibold">
              In Progress
            </span>
            <ProjectColumn
              title="In Progress"
              projects={inProgressProjects}
              handleAddNewProject={handleAddNewProject}
            />
          </div>
          <div className="md:min-w-auto mb-8 flex min-w-56 flex-col">
            <span className="mb-4 w-28 rounded-xl bg-green-100 pl-3 text-base font-semibold">
              Completed
            </span>
            <ProjectColumn
              title="Completed"
              projects={completedProjects}
              handleAddNewProject={handleAddNewProject}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
