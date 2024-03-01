"use server";

import { api } from "~/trpc/server";

export async function updateTimerStateAction({
  taskId,
  focusTime,
  restTime,
}: {
  taskId: string;
  focusTime: number;
  restTime: number;
}) {
  await api.pomodoro.updateTimerState.mutate({ taskId, focusTime, restTime });
}
