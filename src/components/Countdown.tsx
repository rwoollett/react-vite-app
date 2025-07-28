import React, { useEffect, useState } from "react";
import style from './Countdown.module.scss';

function Countdown({ timeTillDate }: { timeTillDate: Date }) {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const secondInterval = setInterval(() => {

      const now = new Date().getTime();
      const timeTill = timeTillDate.getTime();
      const distance = timeTill - now;

      // Time calculations for days, hours, minutes and seconds
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // select element
      setDays(days);
      setHours(hours);
      setMinutes(minutes);
      setSeconds(seconds);

      if (now >= timeTill) {
        clearInterval(secondInterval);
        setDone(true);
        setDays(0);
        setHours(0);
        setMinutes(0);
        setSeconds(0);
      }


    }, 1000);

    return () => {
      clearInterval(secondInterval);
    }
  }, [timeTillDate]);

  return (
    <div className={style.countdown}>
      <div className={style.countdown_wrapper}>
        <div className={style.countdown_item}>
          {done && 'D' || days} 
          {done || <span>days</span>}
        </div>
        <div className={style.countdown_item}>
          {done && 'O' || hours}
          {done || <span>hours</span>}
        </div>
        <div className={style.countdown_item}>
          {done && 'N' || minutes}
          {done || <span>minutes</span>}
        </div>
        <div className={style.countdown_item}>
          {done && 'E' || seconds}
          {done || <span>seconds</span>}
        </div>
      </div>
    </div>
  );
}

export default Countdown;