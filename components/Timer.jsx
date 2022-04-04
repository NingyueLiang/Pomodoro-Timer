import React from "react";
import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { useRouter } from 'next/router';
import { db, auth } from "../firebase/clientApp";
import { connectFirestoreEmulator, doc, onSnapshot, updateDoc } from "firebase/firestore";

const Timer = (props) => {
  const { initialMinutes = 25, initialSeconds = 0 } = props;
  // const initialTimestamp = 25 * 60;
  // const {prevStartTime = Date.now()} = props;
  // console.log(prevStartTime);
  // const mills = Date.now() - prevStartTime;
  // const diff = Math.floor(mills / 1000);
  // initialTimestamp = initialTimestamp - diff;
  // const initialMinutes = parseInt(initialTimestamp / 60);
  // const initialSeconds = Math.round(initialTimestamp % 60);

  // console.log(initialMinutes, initialSeconds);

  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isCountingDown, setIsCountingDown] = useState(false);

  const [qrVisible, setQRVisible] = useState(false);
  const [qrValue, setQRValue] = useState('');
  const [startTime, setStartTime] = useState(0);

  const router = useRouter();
  console.log(router.query.itemId)


  // // test mode
  const itemId = 'BfT3y04qrDPsWhIY5y3H';
  const uid = 'ycENTtYaa6c1SkoHcX4nFCM26793';
  const collection_dir = `users/${uid}/todos`;
  const cur_doc = doc(db, collection_dir, "BfT3y04qrDPsWhIY5y3H");
  const unsub = onSnapshot(doc(db, collection_dir, "BfT3y04qrDPsWhIY5y3H"), (doc) => {
    setIsCountingDown(doc.data().isActive);
    if (doc.data().isReset){
      console.log('tset', doc.data().isReset)
      setMinutes(25);
      setSeconds(0);

      updateReset(false);
    }

  });



  const updateActive = async (isActive) => {
    await updateDoc(cur_doc, { "isActive": isActive });
  };

  const updateReset = async (isReset) => {
    await updateDoc(cur_doc, { "isReset": isReset });
  };


  
  // updateActive(false);
  // if (QRstate) {
  //   setIsCountingDown(true);
  //   QRstate = false;
  // }



  useEffect(() => {
    const countdownInterval = setInterval(() => {
      if (isCountingDown) {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        }
        else if (seconds == 0) {
          if (minutes == 0) {
            clearInterval(countdownInterval);
          }
          else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        }
      }
    }, 1000);
    return () => {
      clearInterval(countdownInterval);
    };
  });

  const handleStart = () => {
    // var myDate = new Date();
    // const startTime = Date.now();
    setStartTime(Date.now());
    setIsCountingDown(true);
    updateActive(true);
  }

  const handlePause = () => {
    setIsCountingDown(false);
    updateActive(false);

  }

  const handleReset = () => {
    setMinutes(25);
    setSeconds(0);
    updateReset(true);
  }

  const handleCreateQRCode = async () => {
    // handlePause();
    // countdownInterval();
    const baseURL = 'http://foocus.vercel.app/qr';
    const isQR = true;
    // const strValue = '?minutes=' + minutes + '&seconds=' + seconds + '&isQR=' + isQR;
    const strValue = '?startTime=' + startTime + '&isQR=' + isQR;

    console.log(baseURL + strValue);
    setQRValue(baseURL + strValue);

    setQRVisible(true);
  }

  const toggleShowQR = () => {
    setQRVisible(!qrValue);
    if (isCountingDown) {
      let initialTimestamp = 25 * 60;
      const prevStartTime = startTime;
      // const mills = 1646593098423 - prevStartTime;
      const mills = Date.now() - prevStartTime;

      // console.log(Date.now());
      const diff = mills / 1000;
      // const diff = 40;
      initialTimestamp = initialTimestamp - diff;
      const resetlMinutes = parseInt(initialTimestamp / 60);
      const resetSeconds = Math.round(initialTimestamp % 60);
      setMinutes(resetlMinutes);
      setSeconds(resetSeconds);
    }
  }

  return (
    <div className="timer">
      {qrVisible &&
        <>
          <QRCode value={qrValue} />
          <Chart />
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
