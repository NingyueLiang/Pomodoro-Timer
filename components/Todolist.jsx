import React, { useState, useEffect } from "react";
import TodoItem from "./TodoItem";
import {db, auth } from "../firebase/clientApp"
import { addDoc, getDocs,deleteDoc, doc, collection, onSnapshot } from "firebase/firestore";
import { Heading, Box, Center, Input, InputGroup, InputRightElement, VStack, StackDivider, IconButton } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'


function Todolist(props) {
  const [inputText, setInputText] = useState("");
  const [totalTime, setTotalTime] = useState(100);
  const [timeSet, setTimeSet] = useState([]);
  const [items, setItems] = useState([]);
  const [showElem, setShowElem] = useState(true);
  const postsCollectionRef = collection(db, `users/${auth.currentUser.uid}/todos`);

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
  });

  
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
    <Box w='90%'>
      <Center>
        <Heading color='green.500'>Tasks</Heading>
      </Center>
        <form onSubmit={addItem}>
          <InputGroup size='lg' mt={1} mb={6}>
            <Input onChange={handleChange} value={inputText} bg='gray.200' placeholder='Add new...' />
            <InputRightElement mx={1}>
              <IconButton colorScheme='green' aria-label='Add new ToDo' icon={<AddIcon />} onClick={addItem}></IconButton>
            </InputRightElement>
          </InputGroup>
        </form>

        <VStack
          divider={<StackDivider borderColor='gray.200' />}
          spacing={2}
          align='normal'
        >  
          {items.map((item, idx) => (
              <TodoItem
                key={idx}
                itemId={item.id}
                uid={auth.currentUser.uid}
                name={item.inputText}
                toDelete={deleteItem}
                toTimer={handleToTimer}
              />
        ))}
        </VStack>
    </Box>
  );
}

export default Todolist;
