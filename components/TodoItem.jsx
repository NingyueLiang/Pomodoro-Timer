import React, { useState } from "react";

function TodoItem(props) {

  function handleToTimer(){
    // console.log(props.id);

    // const url = 'https://foocus.vercel.app//timers?timerId='+props.id;
    const url = 'http://localhost:3000/timers?timerId='+props.itemId+'&uid='+props.uid;
    // console.log(url)
    window.open(url, '_blank');
  }

  return (
    <li>
      {props.item} 
      <button onClick={handleToTimer}>Timer
      </button>
      <button
        onClick={() => {
          
          return props.toDelete(props.itemId);
          
        }}
      >
        delete
      </button>
      {"   "}
    </li>
  );
}

export default TodoItem;
