import React, { useEffect, useRef, useState } from 'react'
import * as signalR from "@microsoft/signalr"
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import { createMessage, allUsers, getMessage, messageReceivers, reset } from '../features/message/messageSlice';
import { toast } from 'react-toastify';
import { logoutUser } from '../features/user/userSlice';

export default function Message() {
    const [sentMessage, setSentMessage] = useState([])
    const [messageReceiver, setMessageReceiver] = useState(null)
    const [messageToSend, setMessageToSend] = useState('')

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const loggedInUser = JSON.parse(localStorage.getItem('user'))

    const {allusers, messageReceiversId, messages, isError, isSuccess, isLoading, errorMessage} = useSelector((state)=>{
        return state.userMessage
    })

    // Get the user who is going to receive message
    const matchingUser = allusers.find(user => user.UserID === messageReceiver);

    useEffect(()=>{
        if(!loggedInUser){
            navigate('/login')
        }
        dispatch(messageReceivers())
        dispatch(allUsers())
    }, [])

    useEffect(()=>{
        if(messageReceiver)
            dispatch(getMessage(messageReceiver))
    }, [messageReceiver]) 

    const chatContainerRef = useRef();
    useEffect(() => {
        // Check if ref and ref.current are defined before accessing scrollHeight
        if (chatContainerRef.current) {
            // Scroll to the bottom when component mounts or updates
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, sentMessage]);

    useEffect(()=>{
        const connection = new signalR.HubConnectionBuilder().withUrl("https://localhost:7034/messageHub").build();

        connection.start().then(()=>{
            console.log("SignalR connected.")
        }).catch(err=>{
            console.error(err.toString());
        })

        connection.on("Message", (updatedData)=>{
            setSentMessage((prevMessages) => [...prevMessages, updatedData]);
            console.log(updatedData)
        })

        return () => { 
            connection.stop();
        };
    }, [])

    const onSubmit = (e) => {
        e.preventDefault()

        if(!messageReceiver) {
            toast.error("Select a person to have conversation.")
        }
        if(!messageToSend) {
            toast.error("Please add the message.")
        }
        else {
            dispatch(createMessage({messageReceiver, messageToSend}))
        }
              
        setMessageToSend("")
    }

    const deleteAccount = () => {
        const confirmDelete = window.confirm('Are you sure you want to delete your account?');

        if (confirmDelete) {
            toast("Need to work here.")
            // dispatch()
            // dispatch(reset())
            // navigate('/register')
        }
    }

    const handleLogout = () => {
        const confirmLogout = window.confirm('Are you sure you want to logout?');

        if (confirmLogout) {
            dispatch(logoutUser())
            dispatch(reset())
            navigate('/login')
        }
    }

    if(isLoading){
        return (
            <div>
                <div className='position-absolute top-50 start-50 translate-middle'>
                    <div className="loader"></div>
                </div>
            </div>
        )        
    }
    
    return (
        <>
        <div>
        <div className='mt-3 d-flex justify-content-evenly'>
            <h3>Welcome, {JSON.parse(localStorage.getItem('user'))?.[0]?.name} !!</h3>
            <button type="button" className='btn btn-outline-secondary' onClick={()=> navigate('/groupmessage')}>Group Message</button>
            <button type="button" className='btn btn-outline-danger' onClick={deleteAccount}>Delete account</button>
            <button type="button" className='btn btn-outline-danger' onClick={handleLogout}>Logout</button>
        </div>

        <div className="input-group mb-3 mt-3">
            <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Start a new conversation</button>
            <ul className="dropdown-menu">
                <li><p className="dropdown-item">Action</p></li>
                <li><p className="dropdown-item">Another action</p></li>
            </ul>
            <input type="text" className="form-control" placeholder="Enter your message here to initiate the conversation." aria-label="Text input with dropdown button" />
        </div>
        </div>

        <div className='d-flex'>
            <div className='rounded' style={{border: "1px solid #b1b1b1"}}>
                {allusers.map((p) => (
                    messageReceiversId.includes(p.UserID) && (
                        <div className="input-group" key={p.UserID}>
                            <div>
                                <button className='btn btn-outline-secondary' style={{border: "1px solid #b1b1b1", width: "10rem"}} onClick={() => {setMessageReceiver(p.UserID);}}>
                                    <p><strong>Name</strong> : {p.UserName} </p>
                                    <p><strong>Email</strong> : {p.Email} </p>
                                </button>
                            </div>                                              
                        </div>                     
                    )     
                ))}
            </div>
            
            <div className='form-control chat-container d-flex flex-column' style={{ height: "80vh" }}>
                {/* <section className="mb-auto">
                    <div className='form-control'>
                        <p>User Info</p>
                    </div>
                </section> */}

                <section className='mt-auto' style={{overflow: "auto"}} ref={chatContainerRef}>
                <div>
                    {(!messageReceiver) 
                    ?
                    <p>Your conversation will show here.</p>
                    :
                    <div>
                    {messages.map((p) => (
                        p.SenderId === JSON.parse(localStorage.getItem('user'))?.[0]?.id 
                        ?   <div className='pt-3'> {/*className="d-flex justify-content-end"*/}
                                <fieldset className="px-2 pb-2"> {/*border rounded-2*/}
                                    <legend className="float-none w-auto text-smaller"><strong>{JSON.parse(localStorage.getItem('user'))?.[0]?.name}</strong> ({p.Timestamp}) </legend>                                     
                                    {/* Icon from bootstrap */}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-return-right" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M1.5 1.5A.5.5 0 0 0 1 2v4.8a2.5 2.5 0 0 0 2.5 2.5h9.793l-3.347 3.346a.5.5 0 0 0 .708.708l4.2-4.2a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 8.3H3.5A1.5 1.5 0 0 1 2 6.8V2a.5.5 0 0 0-.5-.5"/>
                                    </svg> {p.Content}
                                </fieldset>
                            </div>
                        // :    <p><strong>{p.SenderId}</strong> : {p.Content}</p>
                        :   (matchingUser && p.SenderId === matchingUser.UserID && (                            
                            <div className='pt-3'>
                                <fieldset className=" px-2 pb-2">
                                    <legend className="float-none w-auto text-smaller"><strong>{matchingUser.UserName}</strong> ({p.Timestamp})</legend>
                                    {/* Icon from bootstrap */}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-return-right" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M1.5 1.5A.5.5 0 0 0 1 2v4.8a2.5 2.5 0 0 0 2.5 2.5h9.793l-3.347 3.346a.5.5 0 0 0 .708.708l4.2-4.2a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 8.3H3.5A1.5 1.5 0 0 1 2 6.8V2a.5.5 0 0 0-.5-.5"/>
                                    </svg> {p.Content}
                                </fieldset>
                            </div>
                            ))
                        ))} 
                    </div>}                                      
                </div>
                <div>
                    {sentMessage.map((p) => (
                        <p><strong>{JSON.parse(localStorage.getItem('user'))?.[0]?.name}</strong> : {p.content}</p>
                    ))}
                </div>
                </section>

                <section className="mt-auto">
                <form action="" onSubmit={onSubmit} className='input-group mt-2' style={{ width: "100%" }}>                            
                    <input type="text" autoComplete="off" className='form-control' id='message' value={messageToSend} name='message' onChange={(e)=>setMessageToSend(e.target.value)} placeholder='Enter your message.'/>
                    <button type="submit" className='input-group-text d-flex justify-content-center' style={{width: "8rem"}}>Send</button>
                </form>
                </section>                
            </div>
        </div>
        </>

    )
}
