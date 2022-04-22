import React from 'react';
import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { useRouter } from 'next/router'
import { Button, ButtonGroup, CircularProgress, CircularProgressLabel, Center, Box, Divider } from '@chakra-ui/react'

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

  console.log(initialMinutes, initialSeconds);

  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isCountingDown, setIsCountingDown] = useState(false);

  const [qrVisible, setQRVisible] = useState(false);
  const [qrValue, setQRValue] = useState('');
  const [startTime, setStartTime] = useState(0);

  const router = useRouter();

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
          <Button colorScheme='green' m={3} onClick={toggleShowQR}>Show Timer</Button>
        </Center>
      </Box>
      }
      {!qrVisible &&
        <>
          <Center my={5}>
            <CircularProgress color='green.700' value={calculatePercentage()} size={['120px', '240px', '360px']}>
              <CircularProgressLabel>{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</CircularProgressLabel>
            </CircularProgress>
          </Center>
          <Center my={5}>
            <ButtonGroup>
              {isCountingDown && <Button colorScheme='green' size='lg' onClick={handlePause}>Stop</Button>}
              {!isCountingDown && <Button colorScheme='green' size='lg' onClick={handleStart}>Start</Button>}              
              <Button colorScheme='green' size='lg' onClick={handleReset}>Reset</Button>
            </ButtonGroup>
          </Center>
          <Divider mb={10}/>
          <Center>
            <Button colorScheme='green' size='lg' onClick={handleCreateQRCode}>Create QR</Button>
          </Center>
        </>
      }
    </Box>
  );
};

export default Timer;
