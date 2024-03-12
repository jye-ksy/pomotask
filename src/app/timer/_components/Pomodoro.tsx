"use client";

import type { Pomodoro } from "@prisma/client";
import Timer from "./Timer";
import TimerStats from "./TimerStats";
import { PomodoroProvider } from "../_context/PomodoroContext";

export default function Pomodoro({ pomodoro }: { pomodoro: Pomodoro }) {
  return (
    <PomodoroProvider value={pomodoro}>
      <div className="mx-4 mb-48 mt-20 flex h-96 justify-center">
        <Timer />
      </div>
      <div className="mx-4 flex justify-center">
        <TimerStats />
      </div>
    </PomodoroProvider>
  );
}
