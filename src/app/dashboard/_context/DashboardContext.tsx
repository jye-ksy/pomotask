"use client";

import { Project, Task } from "@prisma/client";
import {
  Dispatch,
  ReactNode,
  createContext,
  useReducer,
  useState,
} from "react";

type ProjectState = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  completeByDate: Date;
  completed: boolean;
  tasksId: string | null;
  userId: string;
};

type TaskState = {
  id: string;
  name: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  createdAt: Date;
  due: Date | null;
  updatedAt: Date;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETE";
  completed: boolean;
  notes: string | null;
  projectId: string | null;
  userId: string;
};

interface DashboardState {
  projects: ProjectState[];
  tasks: TaskState[];
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
  const [dashboard, dispatch] = useReducer(dashboardReducer, {
    projects,
    tasks,
  });

  return (
    <DashboardContext.Provider value={{ dispatch, dashboard }}>
      {children}
    </DashboardContext.Provider>
  );
}

// Reducer actions
export type DashboardAction =
  | {
      type: "add-task";
      payload: {
        project: string;
        status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETE";
        name: string;
        priority: "LOW" | "MEDIUM" | "HIGH";
        notes: string;
        due?: Date | undefined;
      };
    }
  | { type: "add-project"; payload: { project: Project } };

export function dashboardReducer(
  state: DashboardState,
  action: DashboardAction,
) {
  switch (action.type) {
    case "add-project":
      console.log("added project");
      return state;
    case "add-task":
      console.log("added task");
      return state;
    default:
      return state;
  }
}
