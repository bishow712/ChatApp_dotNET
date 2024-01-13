import React, { useState } from 'react'
import * as signalR from "@microsoft/signalr"


export default function Message() {
    const [message, setMessage] = useState([])

    const connection = new signalR.HubConnectionBuilder().withUrl("https://localhost:7034/messageHub").build();

    connection.start().then(()=>{
        console.log("SignalR connected.")
    }).catch(err=>{
        console.error(err.toString());
    })

    connection.on("Message", (updatedData)=>{
        setMessage((prevMessages) => [...prevMessages, updatedData]);
        console.log(updatedData)
    })
  return (
    <div>
        {message.map((p) => (
            <p><strong>{p.senderId}</strong> : {p.Content}</p>
        ))}
    </div>
  )
}
