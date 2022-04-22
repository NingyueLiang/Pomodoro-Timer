import React from "react"
import { Flex, Center, Button, Box, Heading, Spacer, propNames } from '@chakra-ui/react'

import firebase from "../firebase/clientApp";

function Header(props) {
    function signOutUser(){
        firebase.auth().signOut();
    }

    return (
        <Flex bgGradient='linear(green.300 0%, green.400 80%, green.300 100%)' minW='100%'>
            <Box p={2}>
                <Heading color='white' size='lg' ml={5}>Foocus</Heading>
            </Box>
            <Spacer/>
            <Box p={2}>
                {props.isLoggedIn &&
                    <Button colorScheme='black' variant='outline' bgColor='white' onClick={signOutUser}>
                        Logout
                    </Button>
                }
            </Box>
        </Flex>   
    );
}
export default Header;