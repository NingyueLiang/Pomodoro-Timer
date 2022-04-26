import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
// import Todolist from "../components/Todolist";
// import Timer from "../components/Timer";
import Auth from "../components/Auth";
import Chart from "../components/Chart";

import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../firebase/clientApp";
import { Center, Box } from '@chakra-ui/react'


export default function Home() {
  // const [curTodo, setCurTodo] = useState();

  // function handleTimerTitle(title) {
  //   setCurTodo(title);
  // }

  // User Authentication
  const [user, loading, error] = useAuthState(firebase.auth());

  return (
    <>
      {loading && <h4>Loading...</h4>}
      {!user && <Auth />}
      {user && 
      <Center>
        <Header pos='absolute' isLoggedIn={user}/>
        <Box  bg='gray.100'>         
          <Chart />
        </Box >
      </Center>
     }
     </>
  );
}
