import React from "react";
import { useState, useEffect } from "react";

const Timer = (props) => {

  const { initialMinute = 0, initialSeconds = 0 } = props;
  const [minutes, setMinutes] = useState(initialMinute);
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isStart, setIsStart] = useState(false);
  function handleStart() {
    setIsStart(true);
  }
  function handlePause() {
    setIsStart(false);
  }
  function handleReset() {
    setMinutes(initialMinute);
    setSeconds(initialSeconds);


  }



  useEffect(() => {
    let myInterval = setInterval(() => {
      if (isStart){
        if (seconds > 0) {
          setSeconds(seconds - 1);
        }
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(myInterval);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        }
    }}, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });

  return (
    <div className="timer">
      <h1>
        {" "}
        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </h1>
      <button onClick={handleStart}>Start</button>
      <button onClick={handlePause}>Stop</button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
};

export default Timer;
