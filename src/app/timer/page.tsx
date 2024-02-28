"use client";

import React, { useState, useEffect } from "react";
import {
  PlayIcon,
  PauseIcon,
  RotateCcwIcon,
  AlarmClockCheckIcon,
} from "lucide-react";

import { Button } from "~/components/ui/button";

export default function Page() {
  const [isActive, setIsActive] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (isActive && seconds >= 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds === 0) {
            // Switch between work and rest intervals
            setIsResting(!isResting);
            setIsActive(!isActive);

            return isResting ? 5 : 3;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isActive, seconds, isResting]);

  const handleStartPauseClick = () => {
    setIsActive(!isActive);
  };

  const handleResetClick = () => {
    setIsActive(false);
    isResting ? setSeconds(5) : setSeconds(3);
  };

  const handleEndClick = () => {
    setIsActive(false);
    isResting ? setSeconds(5) : setSeconds(3);
    setIsResting(!isResting);
  };

  return (
    <div className="mt-20 flex h-96 justify-center">
      <div className="flex-col">
        <div className="flex  justify-center  text-4xl font-bold">
          {isResting ? "Break Time" : "Focus Time"}
        </div>
        <div className=" mt-8 flex justify-center  pb-4 text-9xl  font-bold">
          {Math.floor(seconds / 60)
            .toString()
            .padStart(2, "0")}
          :{(seconds % 60).toString().padStart(2, "0")}
        </div>
        <div className="mt-8 flex justify-around  text-7xl font-medium">
          <Button onClick={handleStartPauseClick}>
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
    </div>
  );
}
