import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Todolist from "../components/Todolist";
import Timer from "../components/Timer";
import { useRouter } from 'next/router'


const Qr = ({query}) => {
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

    return(
        <div>
        <Header />
        {router.isReady && <Timer initialMinutes={initialMinutes} initialSeconds={initialSeconds} isQR={router.query.isQR}/>}
        {/* {router.isReady && <Timer prevStartTime={router.query.startTime} isQR={router.query.isQR}/>} */}
        
        <Footer />
      </div>
    );
}

export default Qr;