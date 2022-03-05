import React from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "../firebase/clientApp";
import { GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";

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
        <div
            style={{
                maxWidth: "320px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <h1>Foocus Login</h1>
            <p>Please sign-in:</p>
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
        </div>
    )
}

export default SignInScreen;