"use client";

import { useContext } from "react";
import { DashboardContext } from "../_context/DashboardContext";
import { v4 as uuid } from "uuid";
import ProjectColumn from "./ProjectColumn";
import { api } from "~/trpc/react";
import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext, closestCorners } from "@dnd-kit/core";

export default function Projects() {
  const { dashboard, dispatch } = useContext(DashboardContext)!;
  const { projects } = dashboard;
  const createProject = api.project.create.useMutation().mutate;
  const updateProject = api.project.update.useMutation().mutate;
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

  //Helper function to get task object to update
  const findProjectById = (id: string, parentContainer: string) => {
    const projects =
      parentContainer === "Not Started"
        ? notStartedProjects
        : parentContainer === "In Progress"
          ? inProgressProjects
          : completedProjects;
    return projects.find((project) => project.id === id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    //Need to use active and over to compare positioning between two elements
    const { active, over } = event;
    //container is destination container
    const container = over?.id;
    const id = active.data.current?.id ?? "";
    const name = active.data.current?.name ?? "";
    const index = active.data.current?.index ?? "";
    //parent is where the task is moved from
    const parent = active.data.current?.parent ?? "Not Started";

    console.log("Project ID:", id);
    console.log("Parent Container", parent);
    console.log("Destination Container", container);
    //Update new container with moved item

    const project = findProjectById(id, parent);
    const status =
      container === "Not Started"
        ? "NOT_STARTED"
        : container === "In Progress"
          ? "IN_PROGRESS"
          : "COMPLETE";

    if (project) {
      dispatch({
        type: "update-project",
        payload: {
          id: project.id,
          name: project.name,
          due: project.due,
          status: status,
        },
      });

      updateProject({
        id: project.id,
        name: project.name,
        due: project.due,
        status: status,
      });
    }
  };

  return (
    <div className="mx-8  flex flex-col items-center lg:mx-14">
      <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
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
      </DndContext>
    </div>
  );
}
