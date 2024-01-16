import React, { useEffect, useState, useRef } from 'react'
import * as signalR from "@microsoft/signalr"
import { useSelector, useDispatch } from 'react-redux';
import { getGroupMessages, sendGroupMessage } from '../features/groupMessage/groupMessageSlice';
import { groupMessageSlice } from '../features/groupMessage/groupMessageSlice';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

export default function GroupMessage() {
    const [yourMessage, setYourMessage] = useState([])

    const [senderName, setSenderName] = useState('')
    const [message, setMessage] = useState('')

    // const {senderName,message} = formData

    const dispatch = useDispatch()

    const {sentGroupMessage, getGroupMessage, isLoading, isError, isSuccess} = useSelector((state)=>{
        return state.groupMessage
    })

    useEffect(()=>{
        dispatch(getGroupMessages())
    },[])

    // To always scroll to the recent conversation
    const chatContainerRef = useRef();
    useEffect(() => {
        // Check if ref and ref.current are defined before accessing scrollHeight
        if (chatContainerRef.current) {
            // Scroll to the bottom when component mounts or updates
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [getGroupMessage, yourMessage]);

    useEffect(()=>{
        const connection = new signalR.HubConnectionBuilder().withUrl("https://localhost:7034/messageHub").build();

        connection.start().then(()=>{
            console.log("SignalR connected.")
        }).catch(err=>{
            console.error(err.toString());
        })

        connection.on("ReceiveGroupMessage", (updatedData)=>{
            console.log(updatedData)
            setYourMessage((prevMessages) => [...prevMessages, updatedData]);
            console.log(yourMessage)
        })

        // Cleanup function
        return () => { 
            connection.stop();
        };
    },[])

    const onSubmit = (e) =>{
        e.preventDefault()
    
        const conversation = {
          senderName, message
        }

        if(!senderName) {
            toast.error("Please add your name.")
        }
        if(!message) {
            toast.error("Please add the message.")
        }
        else {
            dispatch(sendGroupMessage(conversation))
        }
              
        setMessage("")
    }

    if(isLoading){
        return (
            <div>
                <h1>Loading....</h1>
            </div>
        )
    }

    if(isSuccess){
        return (           
            <div>      
                <section className='text-center mt-4 d-flex justify-content-around'>
                    <p>Don't have an account. <Link to='/register' className='link-offset-2 link-opacity-75-hover'>Register Here</Link></p>
                    <p>Already have an account. <Link to='/login' className='link-offset-2 link-opacity-75-hover'>Login Here</Link></p>
                </section>

                <div className="input-group mt-3 mb-3">
                    <label htmlFor="senderName" className="input-group-text">Your Name : </label>
                    <input type="text" autoComplete="off" className='form-control' id='senderName' name='senderName' value={senderName} placeholder='Enter your name.' onChange={(e)=>setSenderName(e.target.value)} />
                </div>

                <div style={{height: '68vh', overflowY: 'auto'}} ref={chatContainerRef}>
                <div>
                    {getGroupMessage.map((m)=>(
                        <p><strong>{m.Sender}</strong> : {m.Message}</p>
                    ))}
                </div>

                <div>
                    {yourMessage.map((p) => (
                        <p><strong>{p.senderName}</strong> : {p.message}</p>
                    ))}   
                </div>
                </div>

                <div>
                    <section>
                        <form action="" onSubmit={onSubmit} className='input-group mt-3 mb-3'>                            
                            <input type="text" autoComplete="off" className='form-control' id='message' name='message' value={message} placeholder='Enter your message.' onChange={(e)=>setMessage(e.target.value)} />
                            <button type="submit" className='input-group-text d-flex justify-content-center' style={{width: "8rem"}}>Send</button>
                        </form>
                    </section>
                </div>                 
            </div>
        ) 
    }
    
}

