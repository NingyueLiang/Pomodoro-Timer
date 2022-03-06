import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Todolist from "../components/Todolist";
import Timer from "../components/Timer";
import { useRouter } from 'next/router'


const Qr = (props) => {
    const router = useRouter();

    return(
        <div>
        <Header />
        <Timer initialMinute={5} initialSeconds={15} />
        <Footer />
      </div>
    );
}

export default Qr;