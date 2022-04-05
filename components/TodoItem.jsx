import React, { useState } from "react";

function TodoItem(props) {

  function handleToTimer(){
    // console.log(props.id);

    const url = 'https://foocus.vercel.app//timers?itemId='+props.id;
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
          
          return props.toDelete(props.id);
          
        }}
      >
        delete
      </button>
      {"   "}
    </li>
  );
}

export default TodoItem;
