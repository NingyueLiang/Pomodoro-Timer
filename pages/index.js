import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Todolist from "../components/Todolist";
import Timer from "../components/Timer";
import Auth from "../components/Auth";

import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../firebase/clientApp";

import { SimpleGrid, Box, Flex, Text, Center, Square, Spacer } from '@chakra-ui/react'

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
        <Flex p={1} color='black' minH ='80vh'>
          <Box w={['300px', '500px', '1400px']} bg='gray.200'>
            <Center p={2}>
              <Timer/>
            </Center>
          </Box>

          <Spacer />

          <Box w={['200px', '300px', '400px']} bg='gray.100'>
            <Center  p={2}>
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