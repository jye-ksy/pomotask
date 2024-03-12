import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { updateTimerStateAction } from "../_actions/action";
import { PomodoroContext } from "../_context/PomodoroContext";
import { useContext } from "react";

type TimerTabsProps = {
  focusTime: number;
  restTime: number;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
};

export default function TimerTabs({
  focusTime,
  restTime,
  setIsActive,
  setProgress,
}: TimerTabsProps) {
  const { pomodoro, dispatch } = useContext(PomodoroContext)!;
  const { taskId, focusLength, restLength } = pomodoro;
  const { isResting } = pomodoro;
  const handleTabChange = (value: string) => {
    setIsActive(false);
    setProgress(
      value === "break"
        ? ((restLength - restTime) / restLength) * 100
        : ((focusLength - focusTime) / focusLength) * 100,
    );
    dispatch({ type: "update-timer-mode" });
    void updateTimerStateAction({
      taskId,
      focusTime,
      restTime,
      isResting: value === "break",
    });
  };

  return (
    <Tabs
      value={isResting ? "break" : "pomodoro"}
      onValueChange={(value: string) => {
        handleTabChange(value);
      }}
    >
      <TabsList className="w-[100%]">
        <TabsTrigger value="pomodoro" className="w-[100%]">
          Pomodoro
        </TabsTrigger>
        <TabsTrigger value="break" className="w-[100%]">
          Break
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
