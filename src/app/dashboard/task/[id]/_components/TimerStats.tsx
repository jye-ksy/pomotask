import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { AlarmClockCheckIcon, AppleIcon } from "lucide-react";
import { formatTime } from "~/lib/utils";
import { useContext } from "react";
import { PomodoroContext } from "../_context/PomodoroContext";
export default function TimerStats() {
  const { pomodoro } = useContext(PomodoroContext)!;

  return (
    <div className="grid w-96 grid-cols-1 grid-rows-1 gap-4  md:w-128 md:grid-cols-2 md:gap-0 ">
      <Card className="mx-2 md:w-60">
        <CardHeader>
          <CardTitle className="flex justify-between text-sm text-muted-foreground">
            Pomodoros completed
            <AppleIcon className="h-4 w-4 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end">
            <span className="text-4xl font-bold">
              {pomodoro.pomodorosCompleted}
            </span>
          </div>
        </CardContent>
      </Card>
      <Card className="mx-2 md:w-60">
        <CardHeader>
          <CardTitle className="flex justify-between text-sm text-muted-foreground">
            Total time spent on task
            <AlarmClockCheckIcon className="h-4 w-4 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end">
            <span className="text-4xl font-bold">
              {formatTime(pomodoro.totalFocusTime + pomodoro.totalRestTime)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
