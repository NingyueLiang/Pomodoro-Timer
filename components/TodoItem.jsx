import React, { useState } from 'react';
import { Button, ButtonGroup, IconButton, Center, Flex, Spacer } from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'

function TodoItem(props) {

  function handleToTimer(){
    const url = 'https://foocus.vercel.app/timers?timerId='+props.itemId+'&uid='+props.uid;
    // const url = 'http://localhost:3000/timers?timerId='+props.itemId+'&uid='+props.uid;
    window.open(url, '_blank');
  }

  const handleDelete = () => props.toDelete(props.itemId);

  return (
    <>
    <Flex>
      <Center>{props.name}</Center>
      <Spacer />
      <ButtonGroup ml={2}>
        <Button onClick={handleToTimer} px={2} colorScheme='green'>Timer</Button>
        <IconButton colorScheme='red' aria-label='Delete ToDo' icon={<DeleteIcon />} onClick={handleDelete}></IconButton>
      </ButtonGroup>
    </Flex>
    </>
  );
}

export default TodoItem;
