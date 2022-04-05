import React, { useState, useEffect } from "react";
import TodoItem from "./TodoItem";
import {db, auth } from "../firebase/clientApp"
import { addDoc, getDocs,deleteDoc, doc, collection, onSnapshot } from "firebase/firestore";


function Todolist(props) {
  const [inputText, setInputText] = useState("");
  const [totalTime, setTotalTime] = useState(100);
  const [timeSet, setTimeSet] = useState([]);
  const [items, setItems] = useState([]);
  const [showElem, setShowElem] = useState(true);
  // const postsCollectionRef = collection(db, "posts");
  const postsCollectionRef = collection(db, `users/${auth.currentUser.uid}/todos`);

//   const collection_dir = `users/${auth.currentUser.uid}/todos`;
//   const unsub = onSnapshot(doc(db, collection_dir, "BfT3y04qrDPsWhIY5y3H"), (doc) => {
//     console.log("Current data: ", doc.data());
//     console.log('execute!!!')
// });





  const add2DB = async () => {
    await addDoc(postsCollectionRef, {
      inputText, totalTime, timeSet,
      author: { name: auth.currentUser.displayName, id: auth.currentUser.uid },
    });
  };
  
  useEffect(() => {
    // console.log('test1');
    const getItems = async () => {
      const data = await getDocs(postsCollectionRef);
      setItems(data.docs.map((doc) => ({...doc.data(), id: doc.id })));
    };

    getItems();
  }, [deleteItem]);

  
  const deleteItem = async (id) => {
    
    const getItems = async () => {
      const data = await getDocs(postsCollectionRef);
      setItems(data.docs.map((doc) => ({...doc.data(), id: doc.id })));
    };
    getItems();

    const postDoc = doc(db, `users/${auth.currentUser.uid}/todos`, id);
    await deleteDoc(postDoc);
    const url = 'https://foocus.vercel.app';
    window.open(url, '_self');
  };


  function handleChange(event) {
    const newValue = event.target.value;
    setInputText(newValue);
    setTotalTime(Math.floor(Math.random() * 300+100));
  }

  function addItem() {
    if(inputText !== ""){
    // console.log(items);

    add2DB();

    const getItems = async () => {
      const data = await getDocs(postsCollectionRef);
      setItems(data.docs.map((doc) => ({...doc.data(), id: doc.id })));
    };
    getItems();

    setInputText("");
  }

  }
  // function deleteItem(id) {
  //   // setItems((preValue) =>
  //   //   preValue.filter((item, idx) => {
  //   //     return idx !== id;
  //   //   })
  //   // );
  //   deletePost(id)  

  // }
  function handleToTimer (id){
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
        {/* <ul>
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
        </ul> */}
        <ul>
          {items.map((item, idx) => (
            // <li>{todoItem}</li>
            <TodoItem
              key={idx}
              id={item.id}
              item={item.inputText}
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
