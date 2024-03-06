import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { AlarmClockCheckIcon, AppleIcon } from "lucide-react";
import { formatTime } from "~/lib/utils";

type TimerStatsProps = {
  pomodorosCompleted: number;
  totalFocusTime: number; // in seconds
};

export default function TimerStats({
  pomodorosCompleted,
  totalFocusTime,
}: TimerStatsProps) {
  return (
    <div className="grid w-96 grid-cols-1 grid-rows-1 gap-4 ">
      <Card className="mx-2">
        <CardHeader>
          <CardTitle className="flex justify-between text-sm text-muted-foreground">
            Pomodoros completed
            <AppleIcon className="h-4 w-4 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end">
            <span className="text-4xl font-bold">{pomodorosCompleted}</span>
          </div>
        </CardContent>
      </Card>
      <Card className="mx-2">
        <CardHeader>
          <CardTitle className="flex justify-between text-sm text-muted-foreground">
            Total time spent focusing
            <AlarmClockCheckIcon className="h-4 w-4 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end">
            <span className="text-4xl font-bold">
              {formatTime(totalFocusTime)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
