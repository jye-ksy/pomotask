import { useContext, useEffect } from "react";
import { updateTimerStateAction } from "../_actions/action";
import { formatTime } from "~/lib/utils";
import { PomodoroContext } from "../_context/PomodoroContext";
import { api } from "~/trpc/react";

type useCountdownProps = {
  focusTime: number;
  restTime: number;
  progress: number;
  isActive: boolean;
  setFocusTime: React.Dispatch<React.SetStateAction<number>>;
  setRestTime: React.Dispatch<React.SetStateAction<number>>;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
};

export function useCountdown({
  focusTime,
  restTime,
  progress,
  isActive,
  setFocusTime,
  setRestTime,
  setProgress,
  setIsActive,
}: useCountdownProps) {
  const { pomodoro, dispatch } = useContext(PomodoroContext)!;
  const { taskId, isResting, restLength, focusLength } = pomodoro;

  const completeBreakTimeMutation =
    api.pomodoro.completeBreakTime.useMutation().mutate;
  const completePomodoroMutation =
    api.pomodoro.completePomodoro.useMutation().mutate;

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
              setIsActive(false);
              setProgress(0);
              dispatch({
                type: "complete-break-time",
                payload: { timeSpentResting: restLength - restTime },
              });
              completeBreakTimeMutation({
                taskId,
                restLength,
                timeSpentResting: restLength - restTime,
              });
              return restLength;
            }
            // Decrement rest timer by 1 second
            return prevRestTime - 1;
          });
          setProgress(((restLength - restTime) / restLength) * 100);
        } else {
          setFocusTime((prevFocusTime) => {
            // Reset state and update db when timer hits 0
            if (prevFocusTime === 0) {
              dispatch({
                type: "complete-pomodoro",
                payload: { timeSpentFocusing: focusLength - focusTime },
              });
              setIsActive(false);
              setProgress(0);
              completePomodoroMutation({
                taskId,
                focusLength,
                timeSpentFocusing: focusLength - focusTime,
              });
              return focusLength;
            }
            // Decrement focus timer by 1
            return prevFocusTime - 1;
          });

          // Update the progress bar
          setProgress(((focusLength - focusTime) / focusLength) * 100);
        }
      }, 1000);
    } else {
      // Stop timer if not active
      clearInterval(interval);
    }

    // Update the title while timer counts down
    document.title = isResting
      ? `${formatTime(restTime)} - Break Time!`
      : isActive
        ? `${formatTime(focusTime)} - (To-do: Add task name here)`
        : `${formatTime(focusTime)} - Start focusing`;

    // Clean up
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
    focusLength,
    restLength,
    isResting,
    completePomodoroMutation,
    completeBreakTimeMutation,
    taskId,
    progress,
    dispatch,
    setProgress,
  ]);
}
