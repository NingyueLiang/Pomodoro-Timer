import Header from "../components/Header";
import Footer from "../components/Footer";
import Todolist from "../components/Todolist";

import Timer from "../components/Timer";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../firebase/clientApp";
import { Box, Flex, Center, Heading } from '@chakra-ui/react'

const Timers = ({ query }) => {
  const router = useRouter();

  let initialTimestamp = 25 * 60;
  const prevStartTime = router.query.startTime;
  const mills = Date.now() - prevStartTime;

  // console.log(Date.now());
  const diff = mills / 1000;
  // const diff = 40;
  initialTimestamp = initialTimestamp - diff;
  const initialMinutes = parseInt(initialTimestamp / 60);
  const initialSeconds = Math.round(initialTimestamp % 60);

  // User Authentication
  const [user, loading, error] = useAuthState(firebase.auth());
  const [curTodo, setCurTodo] = useState();
  // console.log(user);
  // console.log(router.query.timerId, router.query.uid)    <Heading>{curTodo}</Heading>

  function handleTimerTitle(title) {
    setCurTodo(title);
  }



  return (
    <>
      <Header pos='absolute' isLoggedIn={user}/>

      {user &&
      <Box>
        <Flex color='black' minH ='80vh'>
          <Box w={['65%', '70%', '75%']} bg='gray.200'>
            <Center p={1}>
            {router.isReady && ( <>
              <Timer
                initialMinutes={25}
                initialSeconds={0}
                itemId={router.query.timerId}
                uid={router.query.uid}
                title={curTodo}
              />
            </>)}
            </Center>
          </Box>
          <Box flex={1} bg='gray.100'>
            <Center p={1}>
              {user && <Todolist getTitle={handleTimerTitle} />}
            </Center>
          </Box >
        </Flex>
      </Box>
      }
      {!user && 
      <Box bg='gray.200' minH = '80vh'>
        <Center p={1}>
          {router.isReady && ( <>
              <Timer
                initialMinutes={25}
                initialSeconds={0}
                itemId={router.query.timerId}
                uid={router.query.uid}
                title={curTodo}
              />
          </>)}
        </Center>
      </Box>
      }

      <Center>
          <Footer />
      </Center>
    </>
  );
};

export default Timers;