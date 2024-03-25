"use client";

import type { Pomodoro } from "@prisma/client";
import React, { createContext, useReducer } from "react";
import type { Dispatch, ReactNode } from "react";

// Context state
interface PomodoroState {
  id: string;
  taskId: string;
  focusLength: number;
  restLength: number;
  currentFocusTime: number;
  currentRestTime: number;
  totalFocusTime: number;
  totalRestTime: number;
  pomodorosCompleted: number;
  isResting: boolean;
}

export type PomodoroContextType = {
  pomodoro: PomodoroState;
  dispatch: Dispatch<PomodoroAction>;
};

// Reducer actions
export type PomodoroAction =
  | { type: "update-timer-mode" }
  | {
      type: "complete-pomodoro";
      payload: { timeSpentFocusing: number };
    }
  | {
      type: "complete-break-time";
      payload: { timeSpentResting: number };
    }
  | {
      type: "update-timer-length";
      payload: { newFocusLength: number; newRestLength: number };
    }
  | {
      type: "update-current-time";
      payload: { newCurrentFocusTime: number; newCurrentRestTime: number };
    };

export function pomodoroReducer(state: PomodoroState, action: PomodoroAction) {
  switch (action.type) {
    case "update-timer-mode": // Switch the tab from 'Pomodoro' or 'Break'
      return { ...state, isResting: !state.isResting };
    case "complete-pomodoro":
      return {
        ...state,
        pomodorosCompleted:
          // Only increment if time is greater than 0
          action.payload.timeSpentFocusing > 0
            ? state.pomodorosCompleted + 1
            : state.pomodorosCompleted,
        isResting: true,
        currentFocusTime: state.focusLength,
        totalFocusTime: state.totalFocusTime + action.payload.timeSpentFocusing,
      };
    case "complete-break-time":
      return {
        ...state,
        isResting: false,
        currentRestTime: state.currentRestTime,
        totalRestTime: state.totalRestTime + action.payload.timeSpentResting,
      };
    case "update-timer-length":
      return {
        ...state,
        currentFocusTime: action.payload.newFocusLength,
        currentRestTime: action.payload.newRestLength,
        focusLength: action.payload.newFocusLength,
        restLength: action.payload.newRestLength,
      };
    case "update-current-time":
      return {
        ...state,
        currentFocusTime: action.payload.newCurrentFocusTime,
        currentRestTime: action.payload.newCurrentRestTime,
      };
    default:
      return state;
  }
}
export const PomodoroContext = createContext<PomodoroContextType | null>(null);

export function PomodoroProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: Pomodoro;
}) {
  const initialPomodoroState = {
    id: value.id,
    taskId: value.taskId,
    focusLength: value.focusLength,
    restLength: value.restLength,
    currentFocusTime: value.currentFocusTime,
    currentRestTime: value.currentRestTime,
    totalFocusTime: value.totalFocusTime,
    totalRestTime: value.totalRestTime,
    pomodorosCompleted: value.pomodorosCompleted,
    isResting: value.isResting,
  };

  const [pomodoro, dispatch] = useReducer(
    pomodoroReducer,
    initialPomodoroState,
  );
  return (
    <PomodoroContext.Provider value={{ dispatch, pomodoro }}>
      {children}
    </PomodoroContext.Provider>
  );
}
