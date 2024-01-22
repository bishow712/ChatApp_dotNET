import React, { useEffect, useRef, useState } from 'react'
import * as signalR from "@microsoft/signalr"
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import { createNewMessage, createMessage, allUsers, getMessage, messageReceivers, reset } from '../features/message/messageSlice';
import { toast } from 'react-toastify';
import { logoutUser, deleteUser } from '../features/user/userSlice';

export default function Message() {
  const [sentMessage, setSentMessage] = useState([])
  const [messageReceiver, setMessageReceiver] = useState(null)
  const [messageToSend, setMessageToSend] = useState('')
  const [newReceiverId, setNewReceiverId] = useState(null)
  const [newReceiverName, setNewReceiverName] = useState('')
  const [initialMessageToSend, setInitialMessageToSend] = useState('')
  const [refresh, setRefresh] = useState(false)

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loggedInUser = JSON.parse(localStorage.getItem('user'))

  const { allusers, messageReceiversId, messages, isError, isSuccess, isLoading, errorMessage } = useSelector((state) => {
    return state.userMessage
  })

  // Get the user who is going to receive message
  const matchingUser = allusers.find(user => user.UserID === messageReceiver);

  useEffect(()=>{
    setSentMessage([])
  }, [messageReceiver])

  useEffect(() => {
    if (!loggedInUser) {
      navigate('/login')
    }
    else {
      dispatch(messageReceivers())
      dispatch(allUsers())
      setRefresh(false)
    }
  }, [createNewMessage, refresh])

  useEffect(() => {
    if (messageReceiver)
      dispatch(getMessage(messageReceiver))
  }, [messageReceiver])

  // Scroll to the bottom(recent conversation) in the message box
  const chatContainerRef = useRef();
  useEffect(() => {
    // Check if ref and ref.current are defined before accessing scrollHeight
    if (chatContainerRef.current) {
      // Scroll to the bottom when component mounts or updates
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, sentMessage]);

  // WebSocket using SignalR(dotNet Library)
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder().withUrl("https://localhost:7034/messageHub").build();

    connection.start().then(() => {
      console.log("SignalR connected.")
    }).catch(err => {
      console.error(err.toString());
    })

    connection.on("Message", (updatedData) => {
      setSentMessage((prevMessages) => [...prevMessages, updatedData]);
      console.log(updatedData)
    })

    return () => {
      connection.stop();
    };
  }, [])

  // Sending the message
  const onSubmit = (e) => {
    e.preventDefault()

    if (!messageReceiver) {
      toast.error("Select a person to have conversation.")
    }
    if (!messageToSend) {
      toast.error("Please add the message.")
    }
    else {
      dispatch(createMessage({ messageReceiver, messageToSend }))
    }

    setMessageToSend("")
  }

  // Initiating the conversation with a new account
  const initialConversation = (e) => {
    e.preventDefault()

    if (!newReceiverId) {
      toast.error("Select an id to initiate the conversation.")
    }
    if (!initialMessageToSend) {
      toast.error("Please add the starting message.")
    }
    else {
      dispatch(createNewMessage({ newReceiverId, initialMessageToSend }))
    }

    setNewReceiverId(null)
    setNewReceiverName('')
    setInitialMessageToSend('')
    setRefresh(true)
  }

  // Delete the logged In account
  const deleteAccount = () => {
    const confirmDelete = window.confirm('Are you sure you want to delete your account?');

    if (confirmDelete) {
      dispatch(deleteUser())
      toast("Account deleted successfully.")
      dispatch(reset())
      navigate('/register')
    }
  }

  // Logout
  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');

    if (confirmLogout) {
      dispatch(logoutUser())
      toast.success('Successfully logged out.')
      dispatch(reset())
      navigate('/login')
    }
  }

  if (isLoading) {
    return (
      <div>
        <div className='position-absolute top-50 start-50 translate-middle'>
          <div className="loader"></div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ paddingTop: "2vh", margin: "0 calc(100vw/20)" }}>
      <div className="rounded" style={{ backgroundColor: "rgba(0,0,0,.7)", padding: "0 2rem 2rem 2rem" }}>
        <div style={{ color: "white" }}>

          {/* Header */}
          <div className='pt-4 row'>
            <h3 className="col-4" style={{}}>Welcome, {JSON.parse(localStorage.getItem('user'))?.[0]?.name}</h3>

            <button type="button" className='btn btn-outline-secondary mx-2 col' style={{ color: "white" }} onClick={() => navigate('/register')}>Register</button>
            <button type="button" className='btn btn-outline-secondary mx-2 col' style={{ color: "white" }} onClick={() => navigate('/groupmessage')}>Group Message</button>
            <button type="button" className='btn btn-outline-danger mx-2 col' style={{ color: "white" }} onClick={deleteAccount}>Delete account</button>
            <button type="button" className='btn btn-outline-danger mx-2 col' style={{ color: "white" }} onClick={handleLogout}>Logout</button>
          </div>

          {/* Start a new conversation with a new account */}
          <div className="input-group mb-2 mt-2 d-flex">
            <div className='pt-2'>
              <button className="btn btn-outline-secondary dropdown-toggle" style={{ color: "white", width: "13rem" }} type="button" data-bs-toggle="dropdown" aria-expanded="false">{(newReceiverName) ? `${newReceiverName}` : 'Start a new conversation'}</button>
              <ul className="dropdown-menu" style={{ backgroundColor: "#251617", width: "15rem", border: "1px solid white" }}>
                {allusers.map((m) => (
                  !messageReceiversId.includes(m.UserID) && (JSON.parse(localStorage.getItem('user'))?.[0]?.id !== m.UserID) && (
                    <li key={m.UserID}>
                      <button className="dropdown-item" style={{ whiteSpace: "normal", color: "white", /* transition: "color 0.3s" */ }} onMouseOver={(e) => (e.target.style.color = 'black')} onMouseOut={(e) => (e.target.style.color = 'white')} onClick={() => { setNewReceiverId(m.UserID); setNewReceiverName(m.UserName) }}>{m.UserName} ({m.Email})</button>
                    </li>
                  )
                ))}
              </ul>
            </div>
            <div className="pb-1 flex-grow-1">
              <form action="" onSubmit={initialConversation} className='input-group mt-2'>
                <input type="text" autoComplete='off' className="form-control" id='initialMessage' value={initialMessageToSend} name='message' onChange={(e) => setInitialMessageToSend(e.target.value)} placeholder="Enter your message here to initiate the conversation." />
                <button type="submit" className='input-group-text d-flex justify-content-center' style={{ width: "8rem", backgroundColor: "rgb(51, 49, 49, .8)", color: "white" }}>Send</button>
              </form>
            </div>
          </div>
        </div>

        {/* Peoples you are having conversation with */}
        <div className='d-flex' style={{ height: "70vh", backgroundColor: "rgba(0,0,0,.7)" }}>
          <div className='rounded' style={{ overflowX: "break-word", overflowY:"scroll" }}>
            {allusers.map((p) => (
              messageReceiversId.includes(p.UserID) && (
                <div key={p.UserID}>
                  <div className={`input-group ${p.UserID === messageReceiver ? 'bg-grey' : ''}`}>
                    <button className='btn btn-outline-secondary' style={{ border: "1px solid #b1b1b1", width: "16rem" }} onClick={() => { setMessageReceiver(p.UserID); }}>
                      <p style={{ color: "white", float: "left" }}>{p.UserName} ({p.Email}) </p>
                    </button>
                  </div>
                </div>
              )
            ))}
          </div>

          {/* Actual Conversation / Messages Box */}
          <div className='form-control chat-container d-flex flex-column' style={{ backgroundColor: "rgba(33, 24, 25, .9)" }}>
            <section className='mt-auto' style={{ overflow: "auto" }} ref={chatContainerRef}>
              <div style={{ color: "white" }}>
                {(!messageReceiver)
                  ?
                  <p className='text-center'>Your conversation will show here.</p>
                  :
                  <div>
                    {messages.map((p) => (
                      p.SenderId === JSON.parse(localStorage.getItem('user'))?.[0]?.id
                        ? <div className='pt-3'> {/*className="d-flex justify-content-end"*/}
                          <fieldset className="px-2 pb-2" > {/*border rounded-2*/}
                            <legend className="float-none w-auto text-smaller"><strong>{JSON.parse(localStorage.getItem('user'))?.[0]?.name}</strong> ({p.Timestamp}) </legend>
                            {/* Icon from bootstrap */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-return-right" viewBox="0 0 16 16">
                              <path fillRule="evenodd" d="M1.5 1.5A.5.5 0 0 0 1 2v4.8a2.5 2.5 0 0 0 2.5 2.5h9.793l-3.347 3.346a.5.5 0 0 0 .708.708l4.2-4.2a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 8.3H3.5A1.5 1.5 0 0 1 2 6.8V2a.5.5 0 0 0-.5-.5" />
                            </svg> {p.Content}
                          </fieldset>
                        </div>
                        // :    <p><strong>{p.SenderId}</strong> : {p.Content}</p>
                        : (matchingUser && p.SenderId === matchingUser.UserID && (
                          <div className='pt-3'>
                            <fieldset className=" px-2 pb-2">
                              <legend className="float-none w-auto text-smaller"><strong>{matchingUser.UserName}</strong> ({p.Timestamp})</legend>
                              {/* Icon from bootstrap */}
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-return-right" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M1.5 1.5A.5.5 0 0 0 1 2v4.8a2.5 2.5 0 0 0 2.5 2.5h9.793l-3.347 3.346a.5.5 0 0 0 .708.708l4.2-4.2a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 8.3H3.5A1.5 1.5 0 0 1 2 6.8V2a.5.5 0 0 0-.5-.5" />
                              </svg> {p.Content}
                            </fieldset>
                          </div>
                        ))
                    ))}
                  </div>}
              </div>

              {/* Sent message. Real time message update. */}
              <div>
                {sentMessage.map((p) => (
                  (p.receiverId === messageReceiver)
                  ? (
                    <div className='pt-3' style={{ color: "white" }}>
                      <fieldset className=" px-2 pb-2">
                        <legend className="float-none w-auto text-smaller"><strong>{JSON.parse(localStorage.getItem('user'))?.[0]?.name}</strong> (Recent) </legend>
                        {/* Icon from bootstrap */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-return-right" viewBox="0 0 16 16">
                          <path fillRule="evenodd" d="M1.5 1.5A.5.5 0 0 0 1 2v4.8a2.5 2.5 0 0 0 2.5 2.5h9.793l-3.347 3.346a.5.5 0 0 0 .708.708l4.2-4.2a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 8.3H3.5A1.5 1.5 0 0 1 2 6.8V2a.5.5 0 0 0-.5-.5" />
                        </svg> {p.content}
                      </fieldset>
                    </div>
                  ) 
                  : ""
                ))}
              </div>
            </section>

            {/* Place to write message and send. */}
            <section className="mt-auto">
              <form action="" onSubmit={onSubmit} className='input-group mt-2' style={{ width: "100%" }}>
                <input type="text" autoComplete="off" className='form-control' id='message' value={messageToSend} name='message' onChange={(e) => setMessageToSend(e.target.value)} placeholder='Enter your message.' />
                <button type="submit" className='input-group-text d-flex justify-content-center' style={{ width: "8rem", backgroundColor: "rgb(51, 49, 49, .8)", color: "white" }}>Send</button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
