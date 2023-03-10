import React, { useState } from 'react';
import { Button, ButtonGroup, IconButton, Center, Flex, Spacer, AlertDialog, AlertDialogBody, Select, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, useDisclosure } from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'

function TodoItem(props) {
 
  function handleToTimer(){
    const url = 'https://foocus.vercel.app/timers?timerId='+props.itemId+'&uid='+props.uid;
    //const url = 'http://localhost:3000/timers?timerId='+props.itemId+'&uid='+props.uid;
    window.open(url, '_blank');
  }

  const handleDeleteAttempt = () => {
    onOpen();
  };

  const handleDelete = () => {
    props.toDelete(props.itemId);
  };
  function updateTag(event){
  
    
    props.toTag(props.itemId, event.target.value);
  }
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  return (
    <>
    <Flex wrap='wrap'>
      <Center marginInlineStart={5}>{props.name}</Center>
      <Spacer />
      <Select width={"25%"} defaultValue = {props.tag} marginRight={2} onChange = {updateTag}>
              <option value= 'To-Do'>To-Do</option>
              <option value= 'In Progress'>In Progress</option>
              <option value= 'Completed'>Completed</option>
      </Select>
      <ButtonGroup ml={2}>
        <Button onClick={handleToTimer} px={2} colorScheme='green'>Timer</Button>
        <IconButton colorScheme='red' aria-label='Delete ToDo' icon={<DeleteIcon />} onClick={handleDeleteAttempt}></IconButton>
      </ButtonGroup>
    </Flex>

    {//AlertDialog example sourced from https://chakra-ui.com/docs/components/overlay/alert-dialog
    }
    <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Delete Task: {props.name}
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You cannot undo this!
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme='red' onClick={() => {
                onClose();
                handleDelete();
              }} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export default TodoItem;
