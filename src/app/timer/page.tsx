import { api } from "~/trpc/server";
import Timer from "./_components/Timer";

export default async function Pomodoro() {
  let pomodoro = await api.pomodoro.getPomodoro.query({
    taskId: "cf53547c-ea99-485e-b03e-2200830f5ba4", // To-do: Replace the hardcoded taskId by getting the id from the url
  });

  if (!pomodoro) {
    pomodoro = await api.pomodoro.createPomodoro.mutate({
      taskId: "cf53547c-ea99-485e-b03e-2200830f5ba4", // To-do: Replace the hardcoded taskId by getting the id from the url
      focusLength: 120,
      restLength: 60,
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
