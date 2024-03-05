import { zodResolver } from "@hookform/resolvers/zod";
import { AlarmClockIcon, SettingsIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Slider } from "~/components/ui/slider";
import { toast } from "~/components/ui/use-toast";
import { minutesToSeconds, secondsToMinutes } from "~/lib/utils";
import { api } from "~/trpc/react";

const timerSettingsSchema = z.object({
  pomodoro: z.coerce.number().min(1).max(99),
  break: z.coerce.number().min(1).max(99),
});

type TimerSettingsProps = {
  taskId: string;
  initialFocusTime: number;
  initialRestTime: number;
  setFocusTime: React.Dispatch<React.SetStateAction<number>>;
  setRestTime: React.Dispatch<React.SetStateAction<number>>;
  setInitialRestTime: React.Dispatch<React.SetStateAction<number>>;
  setInitialFocusTime: React.Dispatch<React.SetStateAction<number>>;
};

export default function TimerSettings({
  taskId,
  initialFocusTime,
  initialRestTime,
  setFocusTime,
  setRestTime,
  setInitialFocusTime,
  setInitialRestTime,
}: TimerSettingsProps) {
  const [pomodoroMinutes, setPomodoroMinutes] = useState(
    secondsToMinutes(initialFocusTime),
  );
  const [breakMinutes, setBreakMinutes] = useState(
    secondsToMinutes(initialRestTime),
  );
  const timerSettingsForm = useForm<z.infer<typeof timerSettingsSchema>>({
    resolver: zodResolver(timerSettingsSchema),
    defaultValues: {
      pomodoro: pomodoroMinutes,
      break: breakMinutes,
    },
  });
  const updateTimerLengthMutation =
    api.pomodoro.updateTimerLength.useMutation().mutate;

  // Submit handler
  const handleTimerSettingsSubmit = (
    data: z.infer<typeof timerSettingsSchema>,
  ) => {
    setFocusTime(minutesToSeconds(data.pomodoro));
    setRestTime(minutesToSeconds(data.break));
    setInitialFocusTime(minutesToSeconds(data.pomodoro));
    setInitialRestTime(minutesToSeconds(data.break));
    setPomodoroMinutes(data.pomodoro);
    setBreakMinutes(data.break);

    updateTimerLengthMutation({
      taskId,
      focusLength: minutesToSeconds(data.pomodoro),
      restLength: minutesToSeconds(data.break),
      currentFocusTime: minutesToSeconds(data.pomodoro),
      currentRestTime: minutesToSeconds(data.break),
    });

    toast({
      title: "Settings",
      description: "Timer successfully updated!",
    });
  };

  // Slider change handlers
  const handlePomodoroSliderChange = (newValue: number[]) => {
    const value = newValue[0];
    if (value) {
      timerSettingsForm.setValue("pomodoro", value);
      setPomodoroMinutes(value);
    }
  };
  const handleBreakSliderChange = (newValue: number[]) => {
    const value = newValue[0];
    if (value) {
      timerSettingsForm.setValue("break", value);
      setBreakMinutes(value);
    }
  };

  // Input change handlers
  const handlePomodoroMinutesChange: React.ChangeEventHandler<
    HTMLInputElement
  > = (e) => {
    const value = (e.target as HTMLInputElement).value;
    // Only allow user to input a max of 2 characters
    if (value.length <= 2) {
      setPomodoroMinutes(parseInt(value));
      timerSettingsForm.setValue("pomodoro", parseInt(value));
    }
  };
  const handleBreakMinutesChange: React.ChangeEventHandler<HTMLInputElement> = (
    e,
  ) => {
    const value = (e.target as HTMLInputElement).value;
    // Only allow user to input a max of 2 characters
    if (value.length <= 2) {
      setBreakMinutes(parseInt(value));
      timerSettingsForm.setValue("break", parseInt(value));
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <SettingsIcon className="h-4 w-4 text-gray-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...timerSettingsForm}>
          <form
            onSubmit={timerSettingsForm.handleSubmit(handleTimerSettingsSubmit)}
          >
            <DialogHeader className="mb-8">
              <DialogTitle>Settings</DialogTitle>
              <DialogDescription>
                Make changes to the timer here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <Label className="mb-6 flex">
              <AlarmClockIcon className="mb-2 mr-2 h-4 w-4 text-muted-foreground" />
              <span>Time (minutes)</span>
            </Label>
            <FormField
              control={timerSettingsForm.control}
              name="pomodoro"
              render={({ field }) => {
                return (
                  <FormItem className="mb-8">
                    <div className="mb-6 flex justify-between">
                      <FormLabel className="flex text-gray-400">
                        <span className="mt-4">Pomodoro</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="focus:border-vis w-14  text-center  focus:outline-none"
                          {...field}
                          value={pomodoroMinutes}
                          onChange={handlePomodoroMinutesChange}
                          maxLength={2}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                    <Slider
                      min={1}
                      max={99}
                      step={1}
                      value={[pomodoroMinutes]}
                      className={"w-[100%]"}
                      onValueChange={handlePomodoroSliderChange}
                    />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={timerSettingsForm.control}
              name="break"
              render={({ field }) => {
                return (
                  <FormItem className="mb-8">
                    <div className="mb-6 flex justify-between">
                      <FormLabel className="flex text-gray-400">
                        <span className="mt-4">Break</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="focus:border-vis w-14  text-center focus:outline-none"
                          {...field}
                          value={breakMinutes}
                          onChange={handleBreakMinutesChange}
                          maxLength={2}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                    <Slider
                      min={1}
                      max={99}
                      step={1}
                      value={[breakMinutes]}
                      className={"w-[100%]"}
                      onValueChange={handleBreakSliderChange}
                    />
                  </FormItem>
                );
              }}
            />
            <DialogFooter>
              <DialogClose asChild>
                <div className="flex justify-end">
                  <Button type="submit">Save changes</Button>
                </div>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
