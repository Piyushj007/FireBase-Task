import React from "react";
import App from './App.jsx'

let show = '';
const getAuth = () => {
    let password = prompt("Enter Password : ");
    if (password === import.meta.env.VITE_masterKey) {
        show = <App />
    } else {
        alert("Password galat hai!!!")
        getAuth();
    }
}

getAuth();

export default function Auth() {
    return (
        <>
            {show}
        </>
    )
}