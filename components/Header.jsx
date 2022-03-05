import React from "react"
import firebase from "../firebase/clientApp";

function Header() {
    function signOutUser(){
        firebase.auth().signOut();
    }

    return (
        <header>
            <h1 className="header">Foocus</h1>
            <button onClick={signOutUser}>SignOut</button>
        </header>
    );
}
export default Header;