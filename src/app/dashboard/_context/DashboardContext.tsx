"use client";

import type { Task } from "@prisma/client";
import type { Dispatch, ReactNode } from "react";
import { createContext, useReducer } from "react";
import type { ProjectWithTasks } from "~/lib/types";

export interface TaskState {
  id: string;
  name: string;
  notes: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETE";
  completed: boolean;
  priority?: "LOW" | "MEDIUM" | "HIGH";
  due?: Date;
  projectId?: string;
}

export interface ProjectState {
  id: string;
  name: string;
  due?: Date;
  completed: boolean;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETE";
  tasks: TaskState[];
}

// The state for our context
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
        notes: string;
        status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETE";
        priority?: "LOW" | "MEDIUM" | "HIGH";
        projectId?: string;
        due?: Date;
      };
    }
  | {
      type: "update-project";
      payload: {
        id: string;
        name: string;
        status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETE";
        due?: Date;
      };
    }
  | {
      type: "create-project";
      payload: {
        id: string;
        status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETE";
      };
    }
  | {
      type: "delete-task";
      payload: { id: string };
    }
  | {
      type: "delete-project";
      payload: {
        id: string;
      };
    };

export function dashboardReducer(
  state: DashboardState,
  action: DashboardAction,
) {
  switch (action.type) {
    case "create-task":
      // Create empty task
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
    case "create-project":
      // Create empty project
      const newProject = {
        id: action.payload.id,
        name: "",
        completed: false,
        status: action.payload.status,
      } as ProjectState;

      return {
        ...state,
        projects: [...state.projects, newProject],
      };
    case "update-task":
      // Get the index of the task to update
      const indexOfTaskToUpdate = state.tasks.findIndex(
        (task) => task.id === action.payload.id,
      );

      // Update that task
      if (indexOfTaskToUpdate !== -1) {
        const newState = { ...state };

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

        return newState;
      }

      return state;
    case "update-project":
      // Get the index of the project to update
      const indexOfProjectToUpdate = state.projects.findIndex(
        (project) => project.id === action.payload.id,
      );

      // Update that project
      if (indexOfProjectToUpdate !== -1) {
        const newState = { ...state };

        newState.projects[indexOfProjectToUpdate] = {
          id: action.payload.id,
          name: action.payload.name,
          status: action.payload.status,
          due: action.payload.due,
          completed: false,
          tasks: newState.projects[indexOfProjectToUpdate]?.tasks ?? [],
        };

        return newState;
      }

      return state;
    case "delete-task":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload.id),
      };
    case "delete-project":
      return {
        ...state,
        projects: state.projects.filter(
          (project) => project.id !== action.payload.id,
        ),
      };
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
  projects: ProjectWithTasks[];
  tasks: Task[];
}) {
  const initialDashboardState = {
    // Filter out the db related fields
    projects: projects.map((project) => {
      return {
        id: project.id,
        name: project.name,
        due: project.due,
        status: project.status,
        completed: project.completed,
        tasks: project.tasks,
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
