import { useEffect, useRef, useState } from "react";
import { TimerId } from './../constants'

interface TimerProps {
  id: TimerId,
  active: boolean,
  timeLeft: number,
  timeIsUp: (id: TimerId) => void;
  timerClicked: (id: TimerId) => void;
  pause: boolean,
  gameStarted: boolean,
  flip: boolean,
}

const initialIntervalDuration = 1 * 1000;

export default function Timer({ id, active, timeLeft, timeIsUp, timerClicked, pause, gameStarted, flip }: TimerProps) {
  const intervalId = useRef<number>(undefined);

  const [time, setTime] = useState(timeLeft);
  const [remainingIntervalTime, setRemainingIntervalTime] = useState(initialIntervalDuration);
  
  const [timeExceeded, setTimeExceeded] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());

  useEffect(() => {
    if (active && !pause) {
      intervalId.current = setInterval(() => {
        // Take interval start time to calculate remaining interval time after pause
        setStartTime(Date.now());

        setTime(time => {
          if (time === 0) {
            clearInterval(intervalId.current);
            setTimeExceeded(true);
            timeIsUp(id);
            return 0;
          }

          return time - 1;
        })

        setRemainingIntervalTime(initialIntervalDuration);
      }, remainingIntervalTime)

    } else {
      clearInterval(intervalId.current);
      setRemainingIntervalTime(remainingIntervalTime => remainingIntervalTime - (Date.now() - startTime));
    }

    return () => clearInterval(intervalId.current);
  }, [active, id, timeIsUp, startTime])


  return (
    <div
      className={
        `h-full flex justify-center items-center cursor-pointer font-semibold rounded-md m-3 shadow-[0_0px_5px_#a8a29e]`
          + (flip ? ' -scale-100 ' : '')
          + (active ? ' bg-emerald-600 text-white ' : ' bg-zinc-100 ') 
          + (timeExceeded ? ' bg-red-500 text-white ' : '')
          + (active && pause ? ' opacity-50 ' : '')
      }
      onClick={
        !gameStarted || (active && !timeExceeded && !pause) ? () => timerClicked(id) : undefined 
      }
    >
      <div className="flex flex-col tracking-wider select-none">
        <span className="text-gray-300 text-2xl -scale-100">{`${Math.floor(time / 60)}`.padStart(2, "0")}:{`${time % 60}`.padStart(2, "0")}</span>
        <span className="text-8xl">{`${Math.floor(time / 60)}`.padStart(2, "0")}:{`${time % 60}`.padStart(2, "0")}</span>
      </div>
    </div>
  )
}
