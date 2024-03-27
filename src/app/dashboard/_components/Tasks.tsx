"use client";

import { useContext } from "react";
import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext, closestCorners } from "@dnd-kit/core";
import { DashboardContext } from "../_context/DashboardContext";
import { api } from "~/trpc/react";
import { v4 as uuid } from "uuid";
import TaskColumns from "./TasksColumn";
import { Separator } from "~/components/ui/separator";

export default function Tasks() {
  const { dashboard, dispatch } = useContext(DashboardContext)!;
  const { tasks } = dashboard;
  const createTask = api.task.create.useMutation().mutate;
  const updateTask = api.task.update.useMutation().mutate;

  // Filter the tasks based on their status
  const notStartedTasks = tasks.filter((task) => task.status === "NOT_STARTED");
  const inProgressTasks = tasks.filter((task) => task.status === "IN_PROGRESS");
  const completedTasks = tasks.filter((task) => task.status === "COMPLETE");

  const handleAddNewTask = (
    status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETE",
  ) => {
    const newTaskId = uuid();
    dispatch({
      type: "create-task",
      payload: {
        id: newTaskId,
        status,
      },
    });

    createTask({
      id: newTaskId,
      name: "",
      status,
    });
  };

  //Helper function to get task object to update
  const findTaskById = (id: string, parentContainer: string) => {
    const tasks =
      parentContainer === "Not Started"
        ? notStartedTasks
        : parentContainer === "In Progress"
          ? inProgressTasks
          : completedTasks;
    return tasks.find((task) => task.id === id);
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

    console.log("Task ID:", id);
    console.log("Parent Container", parent);
    console.log("Destination Container", container);
    //Update new container with moved item

    const task = findTaskById(id, parent);
    const status =
      container === "Not Started"
        ? "NOT_STARTED"
        : container === "In Progress"
          ? "IN_PROGRESS"
          : "COMPLETE";

    if (task) {
      dispatch({
        type: "update-task",
        payload: {
          id: task.id,
          name: task.name,
          notes: task.notes,
          priority: task.priority,
          due: task.due,
          projectId: task.projectId,
          status,
        },
      });

      updateTask({
        ...task,
        status,
      });
    }
  };

  return (
    <div className="mx-8 flex flex-col items-center lg:mx-14">
      <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
        <div className="flex w-full max-w-7xl justify-center  md:justify-start">
          <h1 className="mb-12 mt-12 flex justify-center text-3xl font-bold">
            My Tasks
          </h1>
        </div>
        <div className="flex w-full flex-col  items-center md:flex-row md:items-start md:justify-center ">
          <div className="flex w-56 max-w-7xl flex-col  md:w-full md:flex-row md:justify-between md:gap-4">
            <div className="md:min-w-auto mb-8 flex min-w-56 flex-col">
              <span className="mb-4 w-28 rounded-xl bg-gray-100 pl-3 text-base font-semibold">
                Not Started
              </span>
              <TaskColumns
                title="Not Started"
                tasks={notStartedTasks}
                handleAddNewTask={handleAddNewTask}
              />
            </div>
            <div className="md:min-w-auto mb-8 flex min-w-56 flex-col">
              <span className="mb-4 w-28 rounded-xl  bg-amber-100 pl-3 text-base font-semibold">
                In Progress
              </span>
              <TaskColumns
                title="In Progress"
                tasks={inProgressTasks}
                handleAddNewTask={handleAddNewTask}
              />
            </div>
            <div className="md:min-w-auto mb-8 flex min-w-56 flex-col">
              <span className="mb-4 w-28 rounded-xl bg-green-100 pl-3 text-base font-semibold">
                Completed
              </span>
              <TaskColumns
                title="Completed"
                tasks={completedTasks}
                handleAddNewTask={handleAddNewTask}
              />
            </div>
          </div>
        </div>
      </DndContext>
      <Separator className="mb-12 mt-12 max-w-7xl" />
    </div>
  );
}
