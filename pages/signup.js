import React from "react";
import { useState, useEffect } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export default function Signup(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
    });

    function handleEmailChange(event) {
        setEmail({value: event.target.value});
    }

    function handlePasswordChange(event) {
        setPassword({value: event.target.value});
    }
    
    function handleSubmit(event) {
        alert('Signup submitted: ' + email.value);
        event.preventDefault();
      }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Email:
                <input type="text" value={email.value} onChange={handleEmailChange} />
            </label>
            <br/>
            <label>
                Password:
                <input type="password" value={password.value} onChange={handlePasswordChange} />
            </label>
            <br/>
            <input type="submit" value="Submit" />
        </form>
    );
  }