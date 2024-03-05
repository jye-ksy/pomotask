import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { updateTimerStateAction } from "../action";

type TimerTabsProps = {
  taskId: string;
  isResting: boolean;
  focusTime: number;
  restTime: number;
  initialFocusTime: number;
  initialRestTime: number;
  setIsResting: React.Dispatch<React.SetStateAction<boolean>>;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
};

export default function TimerTabs({
  taskId,
  isResting,
  focusTime,
  restTime,
  initialFocusTime,
  initialRestTime,
  setIsResting,
  setIsActive,
  setProgress,
}: TimerTabsProps) {
  const handleTabChange = (value: string) => {
    setIsResting(value === "break");
    setIsActive(false);
    setProgress(
      value === "break"
        ? ((initialRestTime - restTime) / initialRestTime) * 100
        : ((initialFocusTime - focusTime) / initialFocusTime) * 100,
    );
    void updateTimerStateAction({
      taskId,
      focusTime,
      restTime,
      isResting: value === "break",
    });
  };

  return (
    <Tabs
      defaultValue={isResting ? "break" : "pomodoro"}
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
