import React, { useState, useEffect } from "react";
import TodoItem from "./TodoItem";
import {db, auth } from "../firebase/clientApp"
import { addDoc, getDocs,deleteDoc, doc, collection, onSnapshot } from "firebase/firestore";
import { Heading, Box, Center, Input, InputGroup, InputRightElement, Divider, IconButton } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'


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
      isActive: false,
      resetState: false,
      leftTime: 25*60,
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
    
  };


  function handleChange(event) {
    const newValue = event.target.value;
    setInputText(newValue);
    setTotalTime(Math.floor(Math.random() * 300+100));
  }

  function addItem(e) {
    e.preventDefault();
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
    <Box>
      <Center>
        <Heading color='green.600'>Tasks</Heading>
      </Center>
        <form onSubmit={addItem}>
          <InputGroup size='lg' mt={1} mb={6}>
            <Input onChange={handleChange} value={inputText} bg='gray.200' placeholder='Add new...' />
            <InputRightElement mx={1}>
              <IconButton colorScheme='green' aria-label='Add new ToDo' icon={<AddIcon />} onClick={addItem}></IconButton>
            </InputRightElement>
          </InputGroup>
        </form>

        {items.map((item, idx) => (
          <>
            <TodoItem
              key={idx}
              itemId={item.id}
              uid={auth.currentUser.uid}
              name={item.inputText}
              toDelete={deleteItem}
              toTimer={handleToTimer}
            />
            <Divider m={2}/>
          </>
      ))}
    </Box>
  );
}

export default Todolist;
