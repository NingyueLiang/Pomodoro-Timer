import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Todolist from "../components/Todolist";
import Timer from "../components/Timer";
import Auth from "../components/Auth";

import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../firebase/clientApp";

import { Box, Flex, Center } from '@chakra-ui/react'

export default function Home() {
  const [curTodo, setCurTodo] = useState();

  function handleTimerTitle(title) {
    setCurTodo(title);
  }

  // User Authentication
  const [user, loading, error] = useAuthState(firebase.auth());

  return (
    <>
      {loading && <h4>Loading...</h4>}
      {!user && <Auth />}
      {user &&
      <Box>
        <Header pos='absolute' isLoggedIn={user}/>
        <Flex color='black' minH ='80vh'>
          <Box w={['65%', '70%', '75%']} bg='gray.200'>
            <Center p={1}>
              <Timer/>
            </Center>
          </Box>
          <Box flex={1} bg='gray.100'>
            <Center p={1}>
              <Todolist getTitle={handleTimerTitle} />
            </Center>
          </Box >
        </Flex>
      </Box>
      }

      <Center>
          <Footer />
      </Center>
    </>
  );
}