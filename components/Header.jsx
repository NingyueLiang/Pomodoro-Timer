import React from "react"
import Link from 'next/link'

function Header(){

    return (
        <header>
        <Link href="/signup">
            <button>Sign up</button>
        </Link>

        <h1 className="header">Foocus</h1>
        
        </header>
    );
}
export default Header;