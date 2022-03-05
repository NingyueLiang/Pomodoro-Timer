import React from "react"
import Link from 'next/link'
import firebase from "../firebase/clientApp";

function Header() {
    function signOutUser(){
        firebase.auth().signOut();
    }

    return (
        <header>
            <Link href="/signup">
                <button>Sign up</button>
            </Link>
            <h1 className="header">Foocus</h1>
            <button onClick={signOutUser}>SignOut</button>
        </header>
    );
}
export default Header;