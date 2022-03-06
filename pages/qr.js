import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Todolist from "../components/Todolist";
import Timer from "../components/Timer";
import { useRouter } from 'next/router'


const Qr = ({query}) => {
    const router = useRouter();

    return(
        <div>
        <Header />
        {router.isReady && <Timer initialMinutes={router.query.minutes} initialSeconds={router.query.seconds} />}
        <Footer />
      </div>
    );
}

export default Qr;