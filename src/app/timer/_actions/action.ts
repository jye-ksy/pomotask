"use server";

import { api } from "~/trpc/server";

export async function updateTimerStateAction({
  taskId,
  focusTime,
  restTime,
  isResting,
}: {
  taskId: string;
  focusTime: number;
  restTime: number;
  isResting: boolean;
}) {
  await api.pomodoro.updateTimerState.mutate({
    taskId,
    focusTime,
    restTime,
    isResting,
  });
}
