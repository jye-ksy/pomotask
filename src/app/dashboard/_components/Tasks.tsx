"use client";

import { useContext } from "react";
import { DashboardContext } from "../_context/DashboardContext";
import { Button } from "~/components/ui/button";
import { PlusIcon } from "lucide-react";
import Task from "./Task";
import { api } from "~/trpc/react";
import { v4 as uuid } from "uuid";

export default function Tasks() {
  const { dashboard, dispatch } = useContext(DashboardContext)!;
  const { tasks } = dashboard;
  const notStartedTasks = tasks.filter((task) => task.status === "NOT_STARTED");
  const inProgressTasks = tasks.filter((task) => task.status === "IN_PROGRESS");
  const completedTasks = tasks.filter((task) => task.status === "COMPLETE");
  const createTask = api.task.create.useMutation().mutate;

  const handleNotStartedNewTaskClick = () => {
    const newTaskId = uuid();
    dispatch({
      type: "create-task",
      payload: { id: newTaskId, status: "NOT_STARTED" },
    });

    createTask({
      id: newTaskId,
      name: "",
      status: "NOT_STARTED",
    });
  };

  const handleInProgressNewTaskClick = () => {
    const newTaskId = uuid();
    dispatch({
      type: "create-task",
      payload: { id: newTaskId, status: "IN_PROGRESS" },
    });

    createTask({
      id: newTaskId,
      name: "",
      status: "IN_PROGRESS",
    });
  };

  const handleCompletedNewTaskClick = () => {
    const newTaskId = uuid();
    dispatch({
      type: "create-task",
      payload: { id: newTaskId, status: "COMPLETE" },
    });

    createTask({
      id: newTaskId,
      name: "",
      status: "COMPLETE",
    });
  };

  return (
    <div className="mx-14  flex flex-col items-center">
      <div className="flex w-full max-w-7xl justify-center  md:justify-start">
        <h1 className="mb-12 mt-12 flex justify-center text-3xl font-bold">
          My Task List
        </h1>
      </div>

      <div className="flex w-full flex-col items-center  md:flex-row md:items-start md:justify-center ">
        <div className="flex w-56 max-w-7xl flex-col  md:w-full md:flex-row md:justify-between md:gap-4">
          <div className="mb-8 flex flex-col">
            <span className="mb-4 w-28 rounded-xl bg-gray-100 pl-3 text-base font-semibold">
              Not Started
            </span>
            <div>
              {notStartedTasks?.map((task) => {
                return (
                  <Task
                    key={task.id}
                    id={task.id}
                    name={task.name}
                    notes={task.notes}
                    priority={task.priority}
                    due={task.due}
                    projectId={task.projectId}
                    status={task.status}
                  />
                );
              })}
              <Button
                onClick={handleNotStartedNewTaskClick}
                variant="outline"
                className="flex h-10 w-full"
              >
                <PlusIcon className="h-4 w-4" />
                <span className="pl-2">New Task</span>
              </Button>
            </div>
          </div>
          <div className="mb-8 flex flex-col">
            <span className="mb-4 w-28 rounded-xl bg-amber-100 pl-3 text-base font-semibold">
              In Progress
            </span>
            <div>
              {inProgressTasks?.map((task) => {
                return (
                  <Task
                    key={task.id}
                    id={task.id}
                    name={task.name}
                    notes={task.notes}
                    priority={task.priority}
                    due={task.due}
                    projectId={task.projectId}
                    status={task.status}
                  />
                );
              })}
              <Button
                onClick={handleInProgressNewTaskClick}
                variant="outline"
                className="flex h-10 w-full"
              >
                <PlusIcon className="h-4 w-4" />
                <span className="pl-2">New Task</span>
              </Button>
            </div>
          </div>
          <div className="mb-8 flex flex-col">
            <span className="mb-4 w-28 rounded-xl bg-green-100 pl-3 text-base font-semibold">
              Completed
            </span>
            <div>
              {completedTasks?.map((task) => {
                return (
                  <Task
                    key={task.id}
                    id={task.id}
                    name={task.name}
                    notes={task.notes}
                    priority={task.priority}
                    due={task.due}
                    projectId={task.projectId}
                    status={task.status}
                  />
                );
              })}
              <Button
                onClick={handleCompletedNewTaskClick}
                variant="outline"
                className="flex h-10 w-full"
              >
                <PlusIcon className="h-4 w-4" />
                <span className="pl-2">New Task</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
