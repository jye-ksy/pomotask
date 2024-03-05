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
import { Card } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { SECONDS_IN_MINUTE } from "~/lib/constants";
import { secondsToMinutes } from "~/lib/utils";
import TimerSettings from "./TimerSettings";
import TimerTabs from "./TimerTabs";

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
  const [initialFocusTime, setInitialFocusTime] = useState(focusLength);
  const [initialRestTime, setInitialRestTime] = useState(restLength);
  const [isResting, setIsResting] = useState(isBreakTime);
  const [focusTime, setFocusTime] = useState(currentFocusTime);
  const [restTime, setRestTime] = useState(currentRestTime);
  const [progress, setProgress] = useState(
    isResting
      ? ((initialRestTime - restTime) / initialRestTime) * 100
      : ((initialFocusTime - focusTime) / initialFocusTime) * 100,
  );

  const completePomodoroMutation =
    api.pomodoro.completePomodoro.useMutation().mutate;
  const completeBreakTimeMutation =
    api.pomodoro.completeBreakTime.useMutation().mutate;

  // Start / Stop the timer
  useEffect(() => {
    // Send the current state to db upon premature page exit/refresh
    const handleBeforeUnload = () => {
      // e.preventDefault(); // prompt before reload
      void updateTimerStateAction({ taskId, focusTime, restTime, isResting });
    };

    // Event listener that fires after page exit/refresh
    window.addEventListener("beforeunload", handleBeforeUnload);

    let interval: NodeJS.Timeout | undefined;

    if (isActive && (focusTime >= 0 || restTime >= 0)) {
      interval = setInterval(() => {
        if (isResting) {
          setRestTime((prevRestTime) => {
            // Reset state and update db when timer hits 0
            if (prevRestTime === 0) {
              setIsResting(false);
              setIsActive(false);
              setProgress(0);
              completeBreakTimeMutation({
                taskId,
                initialRestTime,
                timeSpentResting: initialRestTime - restTime,
              });
              return initialRestTime;
            }
            // Decrement rest timer by 1 second
            return prevRestTime - 1;
          });
          setProgress(((initialRestTime - restTime) / initialRestTime) * 100);
        } else {
          setFocusTime((prevFocusTime) => {
            // Reset state and update db when timer hits 0
            if (prevFocusTime === 0) {
              setIsResting(true);
              setIsActive(false);
              setProgress(0);
              completePomodoroMutation({
                taskId,
                initialFocusTime,
                timeSpentFocusing: initialFocusTime - focusTime,
              });
              return initialFocusTime;
            }
            // Decrement focus timer by 1
            return prevFocusTime - 1;
          });
          // Update the progress bar
          setProgress(
            ((initialFocusTime - focusTime) / initialFocusTime) * 100,
          );
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
    progress,
  ]);

  const handleStartPauseClick = () => {
    setIsActive(!isActive);
    void updateTimerStateAction({ taskId, focusTime, restTime, isResting }); // Update db on start/pause
  };

  const handleResetClick = () => {
    setIsActive(false);
    isResting ? setRestTime(initialRestTime) : setFocusTime(initialFocusTime);
  };

  const handleEndClick = () => {
    setIsActive(false);
    setProgress(0); // Reset progress bar

    // Update the total time spent focusing or resting
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
    <div className="w-1/5 min-w-96 flex-col">
      <TimerTabs
        taskId={taskId}
        isResting={isResting}
        focusTime={focusTime}
        restTime={restTime}
        initialFocusTime={initialFocusTime}
        initialRestTime={initialRestTime}
        setIsResting={setIsResting}
        setIsActive={setIsActive}
        setProgress={setProgress}
      />
      <Card className="pb-10">
        <div className="flex-col">
          <div className="flex justify-end">
            <div className="pr-2 pt-2">
              <TimerSettings
                taskId={taskId}
                initialFocusTime={initialFocusTime}
                initialRestTime={initialRestTime}
                setFocusTime={setFocusTime}
                setRestTime={setRestTime}
                setInitialFocusTime={setInitialFocusTime}
                setInitialRestTime={setInitialRestTime}
              />
            </div>
          </div>
          <div className="mt-8 flex justify-center  pb-4 text-9xl  font-bold">
            {isResting ? formatTime(restTime) : formatTime(focusTime)}
          </div>
          <div className="mx-12 mt-8 flex  justify-around text-7xl font-medium">
            <Button
              onClick={() => {
                handleStartPauseClick();
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
      </Card>
      <Progress
        value={progress}
        defaultValue={progress}
        max={isResting ? initialRestTime : initialFocusTime}
        className="mt-1 w-[100%]"
      />
    </div>
  );
}

function formatTime(seconds: number) {
  return `${Math.floor(secondsToMinutes(seconds))
    .toString()
    .padStart(
      2,
      "0",
    )}:${(seconds % SECONDS_IN_MINUTE).toString().padStart(2, "0")}`;
}
