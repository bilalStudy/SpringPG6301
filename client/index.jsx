import React, {useState} from "react"
import { createRoot } from "react-dom/client.js";
//import {Application} from "./app.jsx";

export function Application() {
    return (
        <h1> Hello From Client Side</h1>
    )
}


const element = document.getElementById("app");
const root = createRoot(element);

root.render(<Application />)

