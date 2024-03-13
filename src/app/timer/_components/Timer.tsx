"use client";

import React, { useState, useContext } from "react";
import {
  PlayIcon,
  PauseIcon,
  RotateCcwIcon,
  AlarmClockCheckIcon,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import { updateTimerStateAction } from "~/app/timer/_actions/action";
import { api } from "~/trpc/react";
import { Card } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { formatTime } from "~/lib/utils";
import TimerSettings from "./TimerSettings";
import TimerTabs from "./TimerTabs";
import { PomodoroContext } from "../_context/PomodoroContext";
import { useCountdown } from "../_hooks/useCountdown";

export default function Timer() {
  // Context state
  const { pomodoro, dispatch } = useContext(PomodoroContext)!;
  const { taskId, isResting, restLength, focusLength } = pomodoro;

  // Component state
  const [focusTime, setFocusTime] = useState(pomodoro.currentFocusTime);
  const [restTime, setRestTime] = useState(pomodoro.currentRestTime);
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(
    pomodoro.isResting
      ? ((restLength - restTime) / restLength) * 100
      : ((focusLength - focusTime) / focusLength) * 100,
  );

  // tRPC Mutations
  const completePomodoroMutation =
    api.pomodoro.completePomodoro.useMutation().mutate;
  const completeBreakTimeMutation =
    api.pomodoro.completeBreakTime.useMutation().mutate;

  // Event handlers
  const handleStartPauseClick = () => {
    if (isActive) {
      // Update the timer after pausing
      dispatch({
        type: "update-current-time",
        payload: {
          newCurrentFocusTime: focusTime,
          newCurrentRestTime: restTime,
        },
      });
      void updateTimerStateAction({ taskId, focusTime, restTime, isResting });
    }
    setIsActive(!isActive);
  };

  const handleResetClick = () => {
    setIsActive(false);
    if (isResting) {
      setRestTime(restLength);
      dispatch({
        type: "update-current-time",
        payload: {
          newCurrentRestTime: restLength,
          newCurrentFocusTime: focusTime,
        },
      });
      void updateTimerStateAction({
        taskId,
        focusTime,
        isResting,
        restTime: restLength,
      });
    } else {
      setFocusTime(focusLength);
      dispatch({
        type: "update-current-time",
        payload: {
          newCurrentRestTime: restTime,
          newCurrentFocusTime: focusLength,
        },
      });
      void updateTimerStateAction({
        taskId,
        focusTime: focusLength,
        isResting,
        restTime,
      });
    }
  };

  const handleEndClick = () => {
    setIsActive(false);
    setProgress(0); // Reset progress bar

    // Update the total time spent focusing or resting
    if (isResting) {
      setRestTime(restLength);
      dispatch({
        type: "complete-break-time",
        payload: {
          timeSpentResting: restLength - restTime,
        },
      });

      completeBreakTimeMutation({
        taskId,
        restLength,
        timeSpentResting: restLength - restTime,
      });
    } else {
      setFocusTime(focusLength);
      dispatch({
        type: "complete-pomodoro",
        payload: {
          timeSpentFocusing: focusLength - focusTime,
        },
      });
      completePomodoroMutation({
        taskId,
        focusLength,
        timeSpentFocusing: focusLength - focusTime,
      });
    }
  };

  // Custom useEffect hook to start/stop the timer
  useCountdown({
    focusTime,
    restTime,
    progress,
    isActive,
    setFocusTime,
    setRestTime,
    setProgress,
    setIsActive,
  });

  return (
    <div className="w-96 flex-col md:w-128">
      <TimerTabs
        focusTime={focusTime}
        restTime={restTime}
        setIsActive={setIsActive}
        setProgress={setProgress}
      />
      <Card className="pb-10">
        <div className="flex flex-col items-center justify-center">
          <div className="flex justify-end self-end">
            <div className="pr-2 pt-2">
              <TimerSettings
                setFocusTime={setFocusTime}
                setRestTime={setRestTime}
              />
            </div>
          </div>
          <div className="mt-8 flex justify-center pb-4 text-7xl font-bold md:text-9xl">
            {isResting ? formatTime(restTime) : formatTime(focusTime)}
          </div>
          <div className="mt-8 flex w-60 justify-around text-sm font-medium md:mx-12 md:w-96 md:justify-around md:px-2 md:text-7xl">
            <Button
              onClick={() => {
                handleStartPauseClick();
              }}
              className="w-16 md:w-24"
            >
              {isActive ? (
                <PauseIcon className="invisible h-4 w-4 md:visible md:mr-2" />
              ) : (
                <PlayIcon className="invisible h-4 w-4 md:visible md:mr-2" />
              )}
              {isActive ? "Pause" : "Start"}
            </Button>
            <Button
              variant="secondary"
              onClick={handleResetClick}
              className="w-16 md:w-24"
            >
              <RotateCcwIcon className="invisible h-4 w-4 md:visible md:mr-2" />
              Reset
            </Button>
            <Button
              variant="ghost"
              onClick={handleEndClick}
              className="w-16 md:w-24"
            >
              <AlarmClockCheckIcon className="invisible h-4 w-4 md:visible md:mr-2" />
              End
            </Button>
          </div>
        </div>
      </Card>
      <Progress
        value={progress}
        defaultValue={progress}
        max={isResting ? restLength : focusLength}
        className="mt-1 w-[100%]"
      />
    </div>
  );
}
