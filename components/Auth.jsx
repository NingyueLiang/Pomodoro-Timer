import React from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "../firebase/clientApp";
import { GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";
import { Box, Center, Heading, Text } from '@chakra-ui/react'

// Configure FirebaseUI
const uiConfig = {
    // Redirect to / after sign in is successful. Alternatively you can provide a callback
    signInSuccessUrl: "/",
    // We will display GitHub as auth providers.
    signInOptions: [GithubAuthProvider.PROVIDER_ID,
                    GoogleAuthProvider.PROVIDER_ID,
                    firebase.auth.EmailAuthProvider.PROVIDER_ID],
};

function SignInScreen(){
    return (
            <Box w={['80%', '65%', '50%']} mx='auto' bg='blackAlpha.200' my={5} borderWidth='1px' borderRadius='lg'>
                <Center my={4}>
                    <Heading size='2xl'>Login or Signup</Heading>
                </Center>
                <Box m={8}>
                    <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
                </Box>
            </Box>
    )
}

export default SignInScreen;