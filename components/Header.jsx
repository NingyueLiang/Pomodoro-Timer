import React from "react"

import firebase from "../firebase/clientApp";

function Header() {
    function signOutUser(){
        firebase.auth().signOut();
    }

    function showReport(){
        const url = 'http://localhost:3000/report';
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