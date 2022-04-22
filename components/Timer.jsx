import React from 'react';
import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { useRouter } from 'next/router'
import { Button, ButtonGroup, CircularProgress, CircularProgressLabel, Center, Box, Divider, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, useDisclosure } from '@chakra-ui/react'

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

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      if (props.isQR || isCountingDown) {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        }
        else if (seconds == 0) {
          if (minutes == 0) {
            clearInterval(countdownInterval);
          }
          else {
            console.log('test', props.isQR, seconds, minutes)
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
    // const startTime = Date.now();
    setStartTime(Date.now());
    setIsCountingDown(true);
  }

  const handlePause = () => {
    setIsCountingDown(false);
  }

  const handleResetAttempt = () => {
    onOpen();
  }

  const handleReset = () => {
    setMinutes(initialMinutes);
    setSeconds(initialSeconds);
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

  const calculatePercentage = () => {
    const fullTimerCount = 25 * 60; //25 minutes * 60 seconds
    const currentTimerCount = (minutes * 60) + seconds;

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
            <CircularProgress color='green.500' value={circularProgressValue} size={['120px', '240px', '360px']}>
              <CircularProgressLabel>{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</CircularProgressLabel>
            </CircularProgress>
          </Center>
          <Center my={5}>
            <ButtonGroup>
              {isCountingDown && <Button colorScheme='yellow' size='lg' onClick={handlePause}>Pause</Button>}
              {!isCountingDown && <Button colorScheme='green' size='lg' onClick={handleStart}>Start</Button>}              
              <Button colorScheme='red' size='lg' onClick={onOpen}>Reset</Button>
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
              Are you sure? You can not undo this!
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
