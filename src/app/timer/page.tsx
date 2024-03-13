import { api } from "~/trpc/server";
import Pomodoro from "./_components/Pomodoro";

export default async function Page() {
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
    <div className="w-full flex-col">
      <Pomodoro pomodoro={pomodoro} />
    </div>
  );
}
