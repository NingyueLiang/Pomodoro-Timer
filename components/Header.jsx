import React, {useEffect} from "react"
import { Flex, Center, Button, Box, Heading, Spacer, propNames } from '@chakra-ui/react'

import firebase from "../firebase/clientApp";

function Header(props) {
    useEffect(() => {
        document.title = "Foocus";
     }, []);

    function signOutUser(){
        window.location.href = "https://foocus.vercel.app";
        firebase.auth().signOut();
    }

    function showReport(){
        const url = 'https://foocus.vercel.app/report';
        window.open(url, '_self');
    }

    function openLoginPage() {
        const url = 'https://foocus.vercel.app/';
        window.open(url, '_self');
    }

    function backToHomePage(){
        const url = 'https://foocus.vercel.app/';
        window.open(url, '_self');
    }

    return (
        <Flex bgGradient='linear(green.300 0%, green.400 80%, green.300 100%)' minW='100%'>
            <Box p={2}>
                <Heading color='white' size='lg' ml={5} onClick={backToHomePage}>Foocus</Heading>
            </Box>
            <Spacer/>
            <Box p={2}>
                {props.isLoggedIn &&
                    <>
                        <Button mx={5} colorScheme='purple' variant='solid' onClick={showReport}>
                            My Stats
                        </Button>
                        <Button colorScheme='black' variant='outline' bgColor='white' onClick={signOutUser}>
                            Logout
                        </Button>
                    </>
                }
                {!props.isLoggedIn &&
                    <Button colorScheme='black' variant='outline' bgColor='white' onClick={openLoginPage}>
                        Log in 
                    </Button>
                }
            </Box>
        </Flex>   
    );
}
export default Header;