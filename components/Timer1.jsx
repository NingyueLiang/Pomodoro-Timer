import React from "react";
import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { useRouter } from 'next/router';
import { db, auth } from "../firebase/clientApp";
import { connectFirestoreEmulator, doc, onSnapshot, updateDoc,getDocs,getDoc, arrayUnion } from "firebase/firestore";
import { Firestore } from "firebase/firestore";
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
    if (doc.data().resetState&&!doc.data().isActive){
      console.log('test1', doc.data().isReset)
      setMinutes(25);
      setSeconds(0);

      // updateReset(false);
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


  function second2TimeList (timeStamp) {
    const min = parseInt(timeStamp / 60);
    const sec = Math.round(timeStamp % 60);
    return [min, sec];
  }

  useEffect(() => {
    // code to run on component mount
    console.log("window onload");
    checkIsActive().then(data=>{
      console.log('check:', data);
      let isActive = data.isActive;
      console.log(isActive);

      if (isActive){
        let leftTime = data.leftTime;
        let lastStartTime = data.timeSet[data.timeSet.length-1];
        let timeDiff = (Date.now() - lastStartTime) / 1000
        let leftSec = leftTime - timeDiff;
        let timeArray = second2TimeList(leftSec); //timeArray: [min, sec]
        setMinutes(timeArray[0]);
        setSeconds(timeArray[1]);
      }else{
        let leftTime = data.leftTime;
        let timeArray = second2TimeList(leftTime); //timeArray: [min, sec]
        setMinutes(timeArray[0]);
        setSeconds(timeArray[1]);
    }
  });

  }, [])
  




  const updateActive = async (isActive) => {
    await updateDoc(cur_doc, { "isActive": isActive });
  };

  // const updateReset = async (isReset) => {
  //   await updateDoc(cur_doc, { "isReset": isReset });
  // };

  const updateReset = async (isReset) => {
    await updateDoc(cur_doc, { "resetState": isReset });
  };

  const updateTimeSet = async () => {
    // const data = await getDoc(cur_doc);
    // await updateDoc(cur_doc, { "isReset": isReset });
    
    await updateDoc(cur_doc, {
      timeSet: arrayUnion(Date.now())
    })
  };

  const updateLeftTime = async (leftTime) => {
    await updateDoc(cur_doc, { "leftTime": leftTime });
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
    // var myDate = new Date();
    // const startTime = Date.now();
    if (!isCountingDown){
      setStartTime(Date.now());
      setIsCountingDown(true);
      updateActive(true);
      updateTimeSet();
    }
  }

  const handlePause = () => {
    if (isCountingDown){
      setIsCountingDown(false);
      updateReset(false);
      updateActive(false);
      updateTimeSet();

      // set leftTime
      let leftTime = minutes * 60 + seconds
      updateLeftTime(leftTime);
    }
  }

  const handleReset = () => {
    if (isCountingDown){
      updateTimeSet()
    }
    updateActive(false);
    updateLeftTime(25 * 60);

    setMinutes(25);
    setSeconds(0);
    updateReset(true);
    // updateReset1(true);
  }

  const handleCreateQRCode = async () => {
    // handlePause();
    // countdownInterval();
    const url = 'https://foocus.vercel.app/timers?timerId='+props.itemId+'&uid='+props.uid;
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