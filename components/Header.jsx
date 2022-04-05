import React from "react"

import firebase from "../firebase/clientApp";

function Header() {
    function signOutUser(){
        firebase.auth().signOut();
    }

    function showReport(){
        const url = 'https://foocus.vercel.app/report';
        window.open(url, '_self');
    }

    return (
        <header>
            <h1 className="header">Foocus</h1>
            
            <button onClick={signOutUser}>SignOut</button>
            <button onClick={showReport}>Report</button>
        </header>
    );
}
export default Header; 