import Header from "../components/Header";
import Footer from "../components/Footer";
import Todolist from "../components/Todolist";

import Timer from "../components/Timer";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../firebase/clientApp";

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
  // console.log(router.query.timerId, router.query.uid)

  function handleTimerTitle(title) {
    setCurTodo(title);
  }

  return (
    <div>
      <Header isLoggedIn={user}/>
      {user && (
        <>
          <h1>{curTodo}</h1>
          <Todolist getTitle={handleTimerTitle} />
        </>
      )}
      {router.isReady && (
        <Timer
          initialMinutes={25}
          initialSeconds={0}
          itemId={router.query.timerId}
          uid={router.query.uid}
        />
      )}
      {/* {router.isReady && <Timer prevStartTime={router.query.startTime} isQR={router.query.isQR}/>} */}

      <Footer />
    </div>
  );
};

export default Timers;
