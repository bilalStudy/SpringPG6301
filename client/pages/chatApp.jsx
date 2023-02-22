import React from "react"
import {useEffect, useState} from "react";
import {employeeApi} from "../api/employeeApi.jsx";
import {useCookies} from "react-cookie";
import {NoAccessComponent} from "../noAccess";

export function ChatApp({ messages, onNewMessage }) {

    const [message, setMessage] = useState('');


    // console.log(messages)
    // console.log(message)

    function handleSubmit(e){
        e.preventDefault();

        onNewMessage(message);

        setMessage("");
    }


    return (
        <>
            <header> Chat</header>
            <main>
                {
                    messages.map(({message, user}, index ) => (
                        <div key={index}>
                            <strong>{user} : </strong> {message}
                        </div>
                    ))
                }
            </main>
            <footer>
                <form onSubmit={handleSubmit}>
                    <input
                        autoFocus={true}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button> Send </button>
                </form>
            </footer>
        </>
    )
}

const initialMessages = [
    {
        user : "Bot",
        message : "Her kan du snakke med dine kollegaer"
    },
];

export function ChatApplication({onEmployeeLoggedIn}){

    const [cookies, setCookie, removeCookie] = useCookies(["cookie-name"]);
    const [messages, setMessages] = useState(initialMessages);
    const [user, setUser] = useState();
    const [ws, setWs] = useState();

    useEffect(() => {
        (async () => {
            if (cookies["employee"]) {
                const employee = await employeeApi.getLoggedInEmployee();
                setUser(employee.username);
                onEmployeeLoggedIn(employee);
            }
        })();
    }, [cookies]);


    useEffect( () => {
        const ws = new WebSocket("ws://" + window.location.host);

        ws.onopen = (event) => {
            console.log("socket open");
        }

        ws.onmessage = (event) => {
            console.log("new message from websocket" , event);
            const {user, message} = JSON.parse(event.data)
            setMessages((messages) => [...messages, {message, user}]);

        }

        setWs(ws);

    }, [])
    function onNewMessage(message){
        //setMessages((messages) => [...messages, {message, user}]);

        ws.send(JSON.stringify({message, user}));

    }

    if (!user){
        return <NoAccessComponent />
    }

    return(
        <ChatApp messages={messages} onNewMessage={onNewMessage} />
    );

}