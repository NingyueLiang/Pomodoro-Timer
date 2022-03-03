import React, {useState} from "react";
import Header from "./Header";
import Footer from "./Footer"
import Todolist from "./Todolist";
import Timer from "./Timer";

function App() {
    // const [state, setState] = useState("25:00");
    // function getTime() {
    //   var cur_Time = new Date().toLocaleTimeString();
    //   console.log(cur_Time);
  
    //   setState(cur_Time);
    // }
    const [curTodo, setCurTodo] = useState();
    function handleTimerTitle (title){
        setCurTodo(title);
    }


    return (
        <div>
            <Header />
            <h1>{curTodo}</h1>
            <Todolist getTitle={handleTimerTitle}/>
            <Timer initialMinute = {25} initialSeconds = {0} />
            <Footer />

            
        </div>
    );
}

export default App;