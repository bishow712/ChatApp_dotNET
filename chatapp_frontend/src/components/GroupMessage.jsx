import React, { useEffect, useState } from 'react'
import * as signalR from "@microsoft/signalr"
import { useSelector, useDispatch } from 'react-redux';
import { getGroupMessages } from '../features/groupMessage/groupMessageSlice';
import { groupMessageSlice } from '../features/groupMessage/groupMessageSlice';

export default function GroupMessage() {
    const [message, setMessage] = useState([])
    const dispatch = useDispatch()

    const {groupMessages, isLoading} = useSelector((state)=>{
        return state.groupMessage
    })

    useEffect(()=>{
        dispatch(getGroupMessages())
    },[])

    useEffect(()=>{
        const connection = new signalR.HubConnectionBuilder().withUrl("https://localhost:7034/messageHub").build();

        connection.start().then(()=>{
            console.log("SignalR connected.")
        }).catch(err=>{
            console.error(err.toString());
        })

        connection.on("ReceiveGroupMessage", (updatedData)=>{
            console.log(updatedData)
            setMessage((prevMessages) => [...prevMessages, updatedData]);
            console.log(message)
        })

        // Cleanup function
        return () => { 
            connection.stop();
        };
    },[])

    if(isLoading){
        return (
            <div>
                <h1>Loading....</h1>
            </div>
        )
    }

    return (
    <div>
        <div>
            {groupMessages.map((m)=>{
                <p><strong>{m.Sender}</strong> : {m.Message}</p>
            })}
        </div>
        <div>
        {message.map((p) => (
            <p><strong>{p.senderName}</strong> : {p.message}</p>
        ))}   
        </div>
    </div>
    ) 
    
}
