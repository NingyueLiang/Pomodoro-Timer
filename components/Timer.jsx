import React from "react";
import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { useRouter } from 'next/router';
import { db, auth } from "../firebase/clientApp";
import { connectFirestoreEmulator, doc, onSnapshot, updateDoc,getDocs,getDoc, arrayUnion } from "firebase/firestore";
import { Firestore } from "firebase/firestore";
import { Button, ButtonGroup, CircularProgress, CircularProgressLabel, Center, Box, Divider, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, useDisclosure, Heading } from '@chakra-ui/react'

const Timer = (props) => {
  const { initialMinutes = 25, initialSeconds = 0 } = props;

  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isCountingDown, setIsCountingDown] = useState(false);

  const [qrVisible, setQRVisible] = useState(false);
  const [qrValue, setQRValue] = useState('');
  const [startTime, setStartTime] = useState(0);

  const [circularProgressValue, setCircularProgressValue] = useState(100);

  const router = useRouter();

  //for timer reset alert popup:
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const [todoTitle, setTodoTitle] = useState();
  const [totalTime, setTotalTime] = useState();
  const [curTimeSet, setCurTimeSet] = useState([]);

  const itemId = props.itemId;
  const uid = props.uid;
  // console.log(uid, itemId);
  const collection_dir = `users/${uid}/todos`;
  const cur_doc = doc(db, collection_dir, itemId);
  const unsub = onSnapshot(doc(db, collection_dir, itemId), (doc) => {
    if(doc.data()){
      setIsCountingDown(doc.data().isActive);
      if (doc.data().resetState&&!doc.data().isActive){
        console.log('test1', doc.data().isReset)
        setMinutes(25);
        setSeconds(0);

        // updateReset(false);
      }
    }else{
      const url = 'https://foocus.vercel.app';
      window.open(url, '_self');
    }
  });


  const getTitle = async () => {
    const cur_doc = doc(db, collection_dir, itemId);
    const docSnap = await getDoc(cur_doc);
    setTodoTitle(docSnap.data().inputText)
    // console.log("title data:", docSnap.data().inputText);

  }
  getTitle();



  const getDocument = async () => {
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
    getDocument().then(data=>{
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

  const updateTimeSet = async (curTime) => {
    // const data = await getDoc(cur_doc);
    // await updateDoc(cur_doc, { "isReset": isReset });
    // const curTime = Date.now();

    

    // // get totalTime
    // const getTotalTime = async () => {
    //   const cur_doc = doc(db, collection_dir, itemId);
    //   const docSnap = await getDoc(cur_doc);
    //   setTotalTime(docSnap.data().totalTime)
  
    // }
    // getTotalTime();

    // // get last TimeSet
    // const getCurTimeSet = async () => {
    //   const cur_doc = doc(db, collection_dir, itemId);
    //   const docSnap = await getDoc(cur_doc);
    //   setCurTimeSet(docSnap.data().timeSet)
  
    // }
    // getCurTimeSet();

    // const diffTime = (curTime - curTimeSet[curTimeSet.length - 1])/1000
    // console.log(curTimeSet, totalTime, diffTime);

    // // update totalTime
    // await updateDoc(cur_doc, { "totalTime": totalTime+diffTime });


    // update TimeSet
    await updateDoc(cur_doc, {
      timeSet: arrayUnion(curTime)
    })

  };


  const updateTotalTime = async (curTime) => {
    // get totalTime
    // const getTotalTime = async () => {
    const cur_doc = doc(db, collection_dir, itemId);
    const docSnap1 = await getDoc(cur_doc);

    const docSnap = await getDoc(cur_doc);
    console.log(docSnap.data().totalTime);
  
    // }
    // getTotalTime();


    // get last TimeSet
    // const getCurTimeSet = async () => {

  
    // }
    // getCurTimeSet();
     
    const diffTime = (curTime - docSnap1.data().timeSet[docSnap1.data().timeSet.length - 1])/1000
    console.log(curTime, docSnap1.data().timeSet[docSnap1.data().timeSet.length - 1], diffTime)
    // console.log(curTimeSet, totalTime, diffTime);

    // update totalTime
    await updateDoc(cur_doc, { "totalTime": parseInt(docSnap.data().totalTime+diffTime)});


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

      setCircularProgressValue(calculatePercentage());
    }, 1000);
    return () => {
      clearInterval(countdownInterval);
    };
  });
  

  const handleStart = () => {
    // var myDate = new Date();
    const curTime = Date.now();
    if (!isCountingDown){
      setStartTime(Date.now());
      setIsCountingDown(true);
      updateActive(true);

      updateTimeSet(curTime);

    }
  }

  const handlePause = () => {
    const curTime = Date.now();
    if (isCountingDown){
      setIsCountingDown(false);
      updateReset(false);
      updateActive(false);
      updateTotalTime(curTime);
      updateTimeSet(curTime);
      // set leftTime
      let leftTime = minutes * 60 + seconds
      updateLeftTime(leftTime);
    }
  }

  const handleResetAttempt = () => {
    onOpen();
  }

  const handleReset = () => {
    const curTime = Date.now();
    if (isCountingDown){
      updateTotalTime(curTime);
      updateTimeSet(curTime)
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
    //const url = 'http://localhost:3000/timers?timerId='+props.itemId+'&uid='+props.uid;
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

  const calculatePercentage = () => {
    const fullTimerCount = 25 * 60; //25 minutes * 60 seconds
    const currentTimerCount = (minutes * 60) + seconds;
    console.log('trigger')
    return (currentTimerCount / fullTimerCount) * 100;
  };

  return (
    <Box>
      {qrVisible &&
      <Box mx='auto' my={5}>
        <Center m={5}>
          <QRCode size='192' value={qrValue} />
        </Center>
        <Center>
          <Button colorScheme='blue' m={3} size='lg' onClick={toggleShowQR}>Show Timer</Button>
        </Center>
      </Box>
      }
      {!qrVisible &&
        <>
          <Center my={5}>
            <Heading>{todoTitle}</Heading>
          </Center>
          <Center my={5}>
            <CircularProgress color='green.500' value={circularProgressValue} size={['180px', '260px', '380px']}>
              <CircularProgressLabel>{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</CircularProgressLabel>
            </CircularProgress>
          </Center>
          <Center my={5}>
            <ButtonGroup>
              {isCountingDown && <Button colorScheme='yellow' size='lg' onClick={handlePause}>Pause</Button>}
              {!isCountingDown && <Button colorScheme='green' size='lg' onClick={handleStart}>Start</Button>}              
              <Button colorScheme='red' size='lg' onClick={handleResetAttempt}>Reset</Button>
            </ButtonGroup>
          </Center>
          <Divider mb={10}/>
          <Center>
            <Button colorScheme='blue' size='lg' onClick={handleCreateQRCode}>Create QR</Button>
          </Center>
        </>
      }

      {//AlertDialog example sourced from https://chakra-ui.com/docs/components/overlay/alert-dialog
    }
    <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Reset Timer to 25 Minutes
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You cannot undo this!
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme='red' onClick={() => {
                onClose();
                handleReset();
              }} ml={3}>
                Reset
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>

    
  );
};

export default Timer;
