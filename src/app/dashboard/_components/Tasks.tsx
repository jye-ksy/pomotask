"use client";

import { useContext } from "react";
import { DashboardContext } from "../_context/DashboardContext";
import { Button } from "~/components/ui/button";
import { PlusIcon } from "lucide-react";
import Task from "./Task";

export default function Tasks() {
  const { dashboard, dispatch } = useContext(DashboardContext)!;
  const { tasks } = dashboard;

  const handleNewTaskClick = () => {
    dispatch({ type: "create-task" });
  };

  return (
    <div className="mt-16 flex w-full flex-col items-center">
      <h1 className="mb-8 text-3xl font-bold">My Task List</h1>
      <div>
        {tasks?.map((task) => {
          return (
            <Task
              key={task.id}
              id={task.id}
              name={task.name}
              priority={task.priority}
              due={task.due}
              projectId={task.projectId}
            />
          );
        })}
        <Button
          onClick={handleNewTaskClick}
          variant="outline"
          className="flex h-16 w-full"
        >
          <PlusIcon className="h-4 w-4" />
          <span className="pl-2">New Task</span>
        </Button>
      </div>
    </div>
  );
}

{
  /* {tasks?.map((task) => {
          return (
            <ProjectCard
              key={task.id}
              name={task.name}
              projectId={task.id.toString()}
            />
          );
        })} */
}
