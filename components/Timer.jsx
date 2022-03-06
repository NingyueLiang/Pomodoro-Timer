import React from "react";
import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { useRouter } from 'next/router'

const Timer = (props) => {
  const { initialMinutes = 25, initialSeconds = 0 } = props;
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isCountingDown, setIsCountingDown] = useState(false);

  const [qrVisible, setQRVisible] = useState(false);
  const [qrValue, setQRValue] = useState('');

  const router = useRouter();

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      if (isCountingDown){
        if (seconds > 0) {
          setSeconds(seconds - 1);
        }
        else if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(countdownInterval);
          } 
          else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        }
    }}, 1000);
    return () => {
      clearInterval(countdownInterval);
    };
  });

  const handleStart = () => {
    setIsCountingDown(true);
  }

  const handlePause = () => {
    setIsCountingDown(false);
  }

  const handleReset = () => {
    setMinutes(initialMinutes);
    setSeconds(initialSeconds);
  }

  const handleCreateQRCode = () => {
    handlePause();

    const baseURL = 'https://foocus.vercel.app/qr';
    const strValue = '?minutes=' + minutes + '&seconds=' + seconds;
    console.log(baseURL + strValue);
    setQRValue(baseURL + strValue);

    setQRVisible(true);
  }

  const toggleShowQR = () => {
    setQRVisible(!qrValue);
  }

  return (
    <div className="timer">
      {qrVisible &&
        <>
          <QRCode value={qrValue} />
          <button onClick={toggleShowQR}>Show Timer</button>
        </>
      }
      {!qrVisible && 
        <>
          <h1>
            {" "}
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </h1>
          <button onClick={handleStart}>Start</button>
          <button onClick={handlePause}>Stop</button>
          <button onClick={handleReset}>Reset</button>

          <br /><br /><br />
          <button onClick={handleCreateQRCode}>Create QR</button>
        </>
      }
    </div>
  );
};

export default Timer;
