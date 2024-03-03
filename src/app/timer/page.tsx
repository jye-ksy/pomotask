import { api } from "~/trpc/server";
import Timer from "../_components/Timer";
import { ProgressBar } from "../_components/ProgressBar";

export default async function Pomodoro() {
  let pomodoro = await api.pomodoro.getPomodoro.query({
    taskId: "d80fdc0b-02fe-4aae-97eb-89307b3a4be0", // To-do: Replace the hardcoded taskId by getting the id from the url
  });

  if (!pomodoro) {
    pomodoro = await api.pomodoro.createPomodoro.mutate({
      taskId: "d80fdc0b-02fe-4aae-97eb-89307b3a4be0", // To-do: Replace the hardcoded taskId by getting the id from the url
      focusLength: 10,
      restLength: 5,
    });
  }

  return (
    <div className="mt-20 flex h-96 justify-center">
      <Timer
        id={pomodoro.id}
        taskId={pomodoro.taskId}
        focusLength={pomodoro.focusLength}
        restLength={pomodoro.restLength}
        currentFocusTime={pomodoro.currentFocusTime}
        currentRestTime={pomodoro.currentRestTime}
        pomodorosCompleted={pomodoro.pomodorosCompleted}
        totalFocusTime={pomodoro.totalFocusTime}
        totalRestTime={pomodoro.totalRestTime}
        isBreakTime={pomodoro.isResting}
      />
    </div>
  );
}
