"use client";

import React, { useState, useEffect } from "react";
import {
  PlayIcon,
  PauseIcon,
  RotateCcwIcon,
  AlarmClockCheckIcon,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import { updateTimerStateAction } from "~/app/timer/action";
import { api } from "~/trpc/react";

type TimerProps = {
  id: string;
  taskId: string;
  focusLength: number;
  restLength: number;
  currentFocusTime: number;
  currentRestTime: number;
  pomodorosCompleted: number;
  totalFocusTime: number;
  totalRestTime: number;
  isBreakTime: boolean;
};

export default function Timer({
  id,
  taskId,
  focusLength,
  restLength,
  currentFocusTime,
  currentRestTime,
  pomodorosCompleted,
  totalFocusTime,
  totalRestTime,
  isBreakTime,
}: TimerProps) {
  const [isActive, setIsActive] = useState(false);

  // To do: Implement a way to update focus/break times
  const [initialFocusTime, setInitialFocusTime] = useState(focusLength);
  const [initialRestTime, setInitialRestTime] = useState(restLength);

  const [isResting, setIsResting] = useState(isBreakTime);
  const [focusTime, setFocusTime] = useState(currentFocusTime);
  const [restTime, setRestTime] = useState(currentRestTime);
  const completePomodoroMutation =
    api.pomodoro.completePomodoro.useMutation().mutate;
  const completeBreakTimeMutation =
    api.pomodoro.completeBreakTime.useMutation().mutate;

  useEffect(() => {
    // Update state on page exit/refresh
    const handleBeforeUnload = (e: Event) => {
      e.preventDefault(); // prompt before reload
      void updateTimerStateAction({ taskId, focusTime, restTime });
    };

    // Event listener that fires after page exit/refresh
    window.addEventListener("beforeunload", handleBeforeUnload);

    let interval: NodeJS.Timeout | undefined;

    if (isActive && (focusTime >= 0 || restTime >= 0)) {
      interval = setInterval(() => {
        // Decrement rest timer by 1 second
        if (isResting) {
          setRestTime((prevRestTime) => {
            if (prevRestTime === 0) {
              setIsResting(false);
              setIsActive(false);
              completeBreakTimeMutation({
                taskId,
                initialRestTime,
                timeSpentResting: initialRestTime - restTime,
              });
              return initialRestTime;
            }
            return prevRestTime - 1;
          });
        } else {
          // Decrement focus timer by 1 second
          setFocusTime((prevFocusTime) => {
            if (prevFocusTime === 0) {
              setIsResting(true);
              setIsActive(false);

              completePomodoroMutation({
                taskId,
                initialFocusTime,
                timeSpentFocusing: initialFocusTime - focusTime,
              });
              return initialFocusTime;
            }
            return prevFocusTime - 1;
          });
        }
      }, 1000);
    } else {
      // Stop timer if not active
      clearInterval(interval);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      clearInterval(interval);
    };
  }, [
    focusTime,
    restTime,
    setRestTime,
    setFocusTime,
    isActive,
    setIsActive,
    setIsResting,
    initialFocusTime,
    initialRestTime,
    isResting,
    completePomodoroMutation,
    completeBreakTimeMutation,
    taskId,
  ]);

  const handleStartPauseClick = () => {
    setIsActive(!isActive);
  };

  const handleResetClick = () => {
    setIsActive(false);
    isResting ? setRestTime(initialRestTime) : setFocusTime(initialFocusTime);
  };

  const handleEndClick = () => {
    setIsActive(false);
    if (isResting) {
      setRestTime(initialRestTime);
      setIsResting(false);
      completeBreakTimeMutation({
        taskId,
        initialRestTime,
        timeSpentResting: initialRestTime - restTime,
      });
    } else {
      setFocusTime(initialFocusTime);
      setIsResting(true);
      completePomodoroMutation({
        taskId,
        initialFocusTime,
        timeSpentFocusing: initialFocusTime - focusTime,
      });
    }
  };

  return (
    <div className="mt-20 flex h-96 justify-center">
      <div className="flex-col">
        <div className="flex  justify-center  text-4xl font-bold">
          {isResting ? "Break Time" : "Focus Time"}
        </div>
        <div className=" mt-8 flex justify-center  pb-4 text-9xl  font-bold">
          {isResting ? formatTime(restTime) : formatTime(focusTime)}
        </div>
        <div className="mt-8 flex justify-around  text-7xl font-medium">
          <Button
            onClick={() => {
              handleStartPauseClick();
              void updateTimerStateAction({ taskId, focusTime, restTime });
            }}
          >
            {isActive ? (
              <PauseIcon className="mr-2 h-4 w-4" />
            ) : (
              <PlayIcon className="mr-2 h-4 w-4" />
            )}
            {isActive ? "Pause" : "Start"}
          </Button>

          <Button variant="secondary" onClick={handleResetClick}>
            <RotateCcwIcon className="mr-2 h-4 w-4" />
            Reset
          </Button>

          <Button variant="ghost" onClick={handleEndClick}>
            <AlarmClockCheckIcon className="mr-2 h-4 w-4" />
            End
          </Button>
        </div>
      </div>
    </div>
  );
}

function formatTime(seconds: number) {
  return `${Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
}
