import React, { useState } from "react";
import TodoItem from "./TodoItem";
import {db, auth } from "../firebase/clientApp"
import { addDoc, collection } from "firebase/firestore";

function Todolist(props) {
  const [inputText, setInputText] = useState("");
  const [items, setItems] = useState([]);
  const [showElem, setShowElem] = useState(true);
  // const postsCollectionRef = collection(db, "posts");
  const postsCollectionRef = collection(db, `users/${auth.currentUser.uid}/todos`);



  const add2DB = async () => {
    await addDoc(postsCollectionRef, {
      inputText,
      author: { name: auth.currentUser.displayName, id: auth.currentUser.uid },
    });
  };

  function handleChange(event) {
    const newValue = event.target.value;
    setInputText(newValue);
  }

  function addItem() {
    setItems((prevItems) => {
      return [...prevItems, inputText];
    });
    setInputText("");
    add2DB();



  }
  function deleteItem(id) {
    setItems((preValue) =>
      preValue.filter((item, idx) => {
        return idx !== id;
      })
    );
  }
  function handleToTimer (id){
    console.log("test");
    return (() => {
        return props.getTitle("yes");
      });
  }


  function handleShow (){
    setShowElem(!showElem)
  }
  



  return (
    <div className="container" style={{display:showElem ? "block":"None"}}>
      <div className="heading">
        <h1 onClick={handleShow} >To-Do List</h1>
      </div>
      <div className="form">
        <input onChange={handleChange} type="text" value={inputText} />
        <button onClick={addItem}>
          <span>Add</span>
        </button>
      </div>
      <div>
        <ul>
          {items.map((todoItem, todoIdx) => (
            // <li>{todoItem}</li>
            <TodoItem
              key={todoIdx}
              id={todoIdx}
              item={todoItem}
              toDelete={deleteItem}
              toTimer={handleToTimer}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Todolist;
