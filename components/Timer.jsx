import React from "react";
import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { useRouter } from 'next/router';
import { db, auth } from "../firebase/clientApp";
import { connectFirestoreEmulator, doc, onSnapshot, updateDoc, getDocs, getDoc, arrayUnion } from "firebase/firestore";

const Timer = (props) => {
  const { initialMinutes = 25, initialSeconds = 0 } = props;


  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isCountingDown, setIsCountingDown] = useState(false);

  const [qrVisible, setQRVisible] = useState(false);
  const [qrValue, setQRValue] = useState('');
  const [startTime, setStartTime] = useState(0);

  const router = useRouter();
  // console.log(router.query.itemId)


  const itemId = props.itemId;
  const uid = props.uid;
  // console.log(uid, itemId);
  const collection_dir = `users/${uid}/todos`;
  const cur_doc = doc(db, collection_dir, itemId);
  const unsub = onSnapshot(doc(db, collection_dir, itemId), (doc) => {
    setIsCountingDown(doc.data().isActive);
    if (doc.data().isReset) {
      // console.log('tset', doc.data().isReset)
      setMinutes(25);
      setSeconds(0);

      updateReset(false);
    }

  });

  // set StartTime of a timer
  // const getIsActive = async () => {
  //       const doc = await getDocs(cur_doc);
  //       // let isActive = data.data();
  //       console.log(doc.data());
  //       return isActive;

  //     };
  // const docRef = doc(db, "cities", "SF");
  // const docSnap = await getDoc(cur_doc);

  // if (docSnap.exists()) {
  //   console.log("Document data:", docSnap.data());
  // } 


  const checkIsActive = async () => {
    const data = await getDoc(cur_doc);
    // console.log("Document data:", data.data().isActive);
    return data.data();
  };


  function second2TimeList(timeStamp) {
    const min = parseInt(timeStamp / 60);
    const sec = Math.round(timeStamp % 60);
    return [min, sec];
  }


  checkIsActive().then(data => {
    console.log('check:', data);
    let isActive = data.isActive;
    if (isActive) {
      // let leftTime = data.leftTime;
      // lastStartTime = data.timeSet[data.timeSet.length-1];
      // console.log(last)


    } else {
      let leftTime = data.leftTime;
      let timeArray = second2TimeList(leftTime); //timeArray: [min, sec]
      setMinutes(timeArray[0]);
      setSeconds(timeArray[1]);
    }

  })




  const updateActive = async (isActive) => {
    await updateDoc(cur_doc, { "isActive": isActive });
  };

  const updateReset = async (isReset) => {
    await updateDoc(cur_doc, { "isReset": isReset });
  };

  const updateTimeSet = async () => {

    await updateDoc(cur_doc, {
      timeSet: arrayUnion(Date.now())
    });

  };





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
    if (!isCountingDown) {
      setStartTime(Date.now());
      setIsCountingDown(true);
      updateActive(true);
      updateTimeSet();
    }

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
    const url = 'https://foocus.vercel.app/timers?timerId=' + props.itemId + '&uid=' + props.uid;
    // const url = 'http://localhost:3000/timers?timerId='+props.itemId+'&uid='+props.uid;
    console.log(url);
    setQRValue(url);

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
          {/* <Chart /> */}
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
