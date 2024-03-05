"use client";

import React, { useState, useEffect } from "react";
import {
  PlayIcon,
  PauseIcon,
  RotateCcwIcon,
  AlarmClockCheckIcon,
  SettingsIcon,
  AlarmClockIcon,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import { updateTimerStateAction } from "~/app/timer/action";
import { api } from "~/trpc/react";
import { Card } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
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
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { useToast } from "~/components/ui/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { SECONDS_IN_MINUTE } from "~/lib/constants";
import { Slider } from "~/components/ui/slider";
import { minutesToSeconds, secondsToMinutes } from "~/lib/utils";

type TimerProps = {
  id: string;
  taskId: string;
  focusLength: number;
  restLength: number;
  currentFocusTime: number;
  currentRestTime: number;
  pomodorosCompleted: number;
  totalFocusTime: number;
  totalRestTime: number;
  isBreakTime: boolean;
};

const timerSettingsSchema = z.object({
  pomodoro: z.coerce.number().min(1).max(99),
  break: z.coerce.number().min(1).max(99),
});

export default function Timer({
  id,
  taskId,
  focusLength,
  restLength,
  currentFocusTime,
  currentRestTime,
  pomodorosCompleted,
  totalFocusTime,
  totalRestTime,
  isBreakTime,
}: TimerProps) {
  const [isActive, setIsActive] = useState(false);
  const [initialFocusTime, setInitialFocusTime] = useState(focusLength);
  const [initialRestTime, setInitialRestTime] = useState(restLength);
  const [isResting, setIsResting] = useState(isBreakTime);
  const [focusTime, setFocusTime] = useState(currentFocusTime);
  const [restTime, setRestTime] = useState(currentRestTime);
  const [progress, setProgress] = useState(
    isResting
      ? ((initialRestTime - restTime) / initialRestTime) * 100
      : ((initialFocusTime - focusTime) / initialFocusTime) * 100,
  );
  const [pomodoroMinutes, setPomodoroMinutes] = useState(
    secondsToMinutes(initialFocusTime),
  );
  const [breakMinutes, setBreakMinutes] = useState(
    secondsToMinutes(initialRestTime),
  );

  const completePomodoroMutation =
    api.pomodoro.completePomodoro.useMutation().mutate;
  const completeBreakTimeMutation =
    api.pomodoro.completeBreakTime.useMutation().mutate;
  const updateTimerLengthMutation =
    api.pomodoro.updateTimerLength.useMutation().mutate;
  const { toast } = useToast();

  const timerSettingsForm = useForm<z.infer<typeof timerSettingsSchema>>({
    resolver: zodResolver(timerSettingsSchema),
    defaultValues: {
      pomodoro: pomodoroMinutes,
      break: breakMinutes,
    },
  });

  useEffect(() => {
    // Update state on page exit/refresh
    const handleBeforeUnload = () => {
      // e.preventDefault(); // prompt before reload
      void updateTimerStateAction({ taskId, focusTime, restTime });
    };

    // Event listener that fires after page exit/refresh
    window.addEventListener("beforeunload", handleBeforeUnload);

    let interval: NodeJS.Timeout | undefined;

    if (isActive && (focusTime >= 0 || restTime >= 0)) {
      interval = setInterval(() => {
        // Decrement rest timer by 1 second
        if (isResting) {
          setRestTime((prevRestTime) => {
            if (prevRestTime === 0) {
              setIsResting(false);
              setIsActive(false);
              setProgress(0);
              completeBreakTimeMutation({
                taskId,
                initialRestTime,
                timeSpentResting: initialRestTime - restTime,
              });
              return initialRestTime;
            }
            return prevRestTime - 1;
          });
          setProgress(((initialRestTime - restTime) / initialRestTime) * 100);
        } else {
          // Decrement focus timer by 1 second
          setFocusTime((prevFocusTime) => {
            if (prevFocusTime === 0) {
              setIsResting(true);
              setIsActive(false);
              setProgress(0);
              completePomodoroMutation({
                taskId,
                initialFocusTime,
                timeSpentFocusing: initialFocusTime - focusTime,
              });
              return initialFocusTime;
            }
            return prevFocusTime - 1;
          });
          setProgress(
            ((initialFocusTime - focusTime) / initialFocusTime) * 100,
          );
        }
      }, 1000);
    } else {
      // Stop timer if not active
      clearInterval(interval);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      clearInterval(interval);
    };
  }, [
    focusTime,
    restTime,
    setRestTime,
    setFocusTime,
    isActive,
    setIsActive,
    setIsResting,
    initialFocusTime,
    initialRestTime,
    isResting,
    completePomodoroMutation,
    completeBreakTimeMutation,
    taskId,
    progress,
  ]);

  const handleStartPauseClick = () => {
    setIsActive(!isActive);
  };

  const handleResetClick = () => {
    setIsActive(false);
    isResting ? setRestTime(initialRestTime) : setFocusTime(initialFocusTime);
  };

  const handleEndClick = () => {
    setIsActive(false);
    setProgress(0);
    if (isResting) {
      setRestTime(initialRestTime);
      setIsResting(false);
      completeBreakTimeMutation({
        taskId,
        initialRestTime,
        timeSpentResting: initialRestTime - restTime,
      });
    } else {
      setFocusTime(initialFocusTime);
      setIsResting(true);
      completePomodoroMutation({
        taskId,
        initialFocusTime,
        timeSpentFocusing: initialFocusTime - focusTime,
      });
    }
  };

  // Function to handle value changes
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

  const handlePomodoroMinutesChange: React.ChangeEventHandler<
    HTMLInputElement
  > = (e) => {
    const value = (e.target as HTMLInputElement).value;
    if (value.length <= 2) {
      setPomodoroMinutes(parseInt(value));
      timerSettingsForm.setValue("pomodoro", parseInt(value));
    }
  };

  const handleBreakMinutesChange: React.ChangeEventHandler<HTMLInputElement> = (
    e,
  ) => {
    const value = (e.target as HTMLInputElement).value;

    if (value.length <= 2) {
      setBreakMinutes(parseInt(value));
      timerSettingsForm.setValue("break", parseInt(value));
    }
  };

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
  return (
    <div className="w-1/5 min-w-96 flex-col">
      <Card className="pb-10">
        <div className="flex-col">
          <div className="flex justify-end">
            <div className="pr-2 pt-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <SettingsIcon className="h-4 w-4 text-gray-500" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <Form {...timerSettingsForm}>
                    <form
                      onSubmit={timerSettingsForm.handleSubmit(
                        handleTimerSettingsSubmit,
                      )}
                    >
                      <DialogHeader className="mb-8">
                        <DialogTitle>Settings</DialogTitle>
                        <DialogDescription>
                          Make changes to the timer here. Click save when
                          you&apos;re done.
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
            </div>
          </div>
          <div className="flex  justify-center  text-4xl font-bold">
            {isResting ? "Break Time" : "Focus Time"}
          </div>
          <div className="mt-8 flex justify-center  pb-4 text-9xl  font-bold">
            {isResting ? formatTime(restTime) : formatTime(focusTime)}
          </div>
          <div className="mx-12 mt-8 flex  justify-around text-7xl font-medium">
            <Button
              onClick={() => {
                handleStartPauseClick();
                void updateTimerStateAction({ taskId, focusTime, restTime });
              }}
            >
              {isActive ? (
                <PauseIcon className="mr-2 h-4 w-4" />
              ) : (
                <PlayIcon className="mr-2 h-4 w-4" />
              )}
              {isActive ? "Pause" : "Start"}
            </Button>
            <Button variant="secondary" onClick={handleResetClick}>
              <RotateCcwIcon className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button variant="ghost" onClick={handleEndClick}>
              <AlarmClockCheckIcon className="mr-2 h-4 w-4" />
              End
            </Button>
          </div>
        </div>
      </Card>
      <Progress
        value={progress}
        max={isResting ? initialRestTime : initialFocusTime}
        className="mt-1 w-[100%]"
      />
    </div>
  );
}

function formatTime(seconds: number) {
  return `${Math.floor(secondsToMinutes(seconds))
    .toString()
    .padStart(
      2,
      "0",
    )}:${(seconds % SECONDS_IN_MINUTE).toString().padStart(2, "0")}`;
}
