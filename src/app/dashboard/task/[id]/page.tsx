import { api } from "~/trpc/server";
import Pomodoro from "./_components/Pomodoro";
import { minutesToSeconds } from "~/lib/utils";

export default async function Page({ params }: { params: { id: string } }) {
  let pomodoro = await api.pomodoro.getPomodoro.query({
    taskId: params.id,
  });

  if (!pomodoro) {
    pomodoro = await api.pomodoro.createPomodoro.mutate({
      taskId: params.id,
      focusLength: minutesToSeconds(25),
      restLength: minutesToSeconds(5),
    });
  }

  return (
    <div className="w-full flex-col">
      <Pomodoro pomodoro={pomodoro} />
    </div>
  );
}
