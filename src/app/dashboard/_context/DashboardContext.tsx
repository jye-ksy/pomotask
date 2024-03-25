"use client";

import type { Project, Task } from "@prisma/client";
import type { Dispatch, ReactNode } from "react";
import { createContext, useReducer } from "react";

interface ProjectState {
  id: string;
  name: string;
  completeByDate: Date;
  completed: boolean;
  tasksId: string | null;
}

interface TaskState {
  id: string;
  name: string;
  priority?: "LOW" | "MEDIUM" | "HIGH";
  due?: Date;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETE";
  completed: boolean;
  notes: string;
  projectId?: string;
}

interface DashboardState {
  projects: ProjectState[];
  tasks: TaskState[];
}
// Reducer actions
export type DashboardAction =
  | {
      type: "create-task";
      payload: {
        id: string;
        status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETE";
      };
    }
  | {
      type: "update-task";
      payload: {
        id: string;
        name: string;
        priority: "LOW" | "MEDIUM" | "HIGH";
        projectId: string | undefined;
        notes: string;
        due?: Date | undefined;
        status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETE";
      };
    }
  | { type: "add-project"; payload: { project: Project } };

export function dashboardReducer(
  state: DashboardState,
  action: DashboardAction,
) {
  switch (action.type) {
    case "create-task":
      const newTask = {
        id: action.payload.id,
        name: "",
        completed: false,
        notes: "",
        status: action.payload.status,
      } as TaskState;

      return {
        ...state,
        tasks: [...state.tasks, newTask],
      };
    case "add-project":
      console.log("added project");
      return state;
    case "update-task":
      const newState = { ...state };
      const indexOfTaskToUpdate = state.tasks.findIndex(
        (task) => task.id === action.payload.id,
      );

      if (indexOfTaskToUpdate !== -1) {
        newState.tasks[indexOfTaskToUpdate] = {
          id: action.payload.id,
          name: action.payload.name,
          priority: action.payload.priority,
          projectId: action.payload.projectId,
          due: action.payload.due,
          completed: false,
          notes: action.payload.notes,
          status: action.payload.status,
        };
      }

      return newState;
    default:
      return state;
  }
}

export type DashboardContextType = {
  dashboard: DashboardState;
  dispatch: Dispatch<DashboardAction>;
};

export const DashboardContext = createContext<DashboardContextType | null>(
  null,
);

export function DashboardProvider({
  children,
  projects,
  tasks,
}: {
  children: ReactNode;
  projects: Project[];
  tasks: Task[];
}) {
  const initialDashboardState = {
    // Filter out the db related fields
    projects: projects.map((project) => {
      return {
        id: project.id,
        name: project.name,
        completeByDate: project.completeByDate,
        completed: project.completed,
        tasksId: project.tasksId,
      };
    }),
    tasks: tasks.map((task) => {
      return {
        id: task.id,
        name: task.name,
        priority: task.priority,
        due: task.due,
        status: task.status,
        completed: task.completed,
        notes: task.notes,
        projectId: task.projectId,
      };
    }),
  } as DashboardState;

  const [dashboard, dispatch] = useReducer(
    dashboardReducer,
    initialDashboardState,
  );
  return (
    <DashboardContext.Provider value={{ dispatch, dashboard }}>
      {children}
    </DashboardContext.Provider>
  );
}
