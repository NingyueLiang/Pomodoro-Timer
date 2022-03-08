import React, { useState } from "react";

function TodoItem(props) {
  return (
    <li>
      {props.item} 
      {/* <button onClick={() => {
          return props.toShow(props.id);
        }}>Timer
      </button> */}
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
