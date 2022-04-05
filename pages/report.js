import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
// import Todolist from "../components/Todolist";
// import Timer from "../components/Timer";
import Auth from "../components/Auth";
import Chart from "../components/Chart";

import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../firebase/clientApp";

export default function Home() {
  // const [curTodo, setCurTodo] = useState();

  // function handleTimerTitle(title) {
  //   setCurTodo(title);
  // }

  // User Authentication
  const [user, loading, error] = useAuthState(firebase.auth());

  return (
    <div>
      {loading && <h4>Loading...</h4>}
      {!user && <Auth />}
      {user && 
        <>
          <Header />
       
          <Chart />
          
          <Footer />
        </>}
    </div>
  );
}