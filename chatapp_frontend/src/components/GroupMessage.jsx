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
  const navigate = useNavigate()

  const { sentGroupMessage, getGroupMessage, isLoading, isError, isSuccess } = useSelector((state) => {
    return state.groupMessage
  })

  useEffect(() => {
    dispatch(getGroupMessages())
  }, [])

  // To always scroll to the recent conversation
  const chatContainerRef = useRef();
  useEffect(() => {
    // Check if ref and ref.current are defined before accessing scrollHeight
    if (chatContainerRef.current) {
      // Scroll to the bottom when component mounts or updates
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [getGroupMessage, yourMessage]);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder().withUrl("https://localhost:7034/messageHub").build();

    connection.start().then(() => {
      console.log("SignalR connected.")
    }).catch(err => {
      console.error(err.toString());
    })

    connection.on("ReceiveGroupMessage", (updatedData) => {
      console.log(updatedData)
      setYourMessage((prevMessages) => [...prevMessages, updatedData]);
    })

    // Cleanup function
    return () => {
      connection.stop();
    };
  }, [])

  const onSubmit = (e) => {
    e.preventDefault()

    const conversation = {
      senderName, message
    }

    if (!senderName) {
      toast.error("Please add your name.")
    }
    if (!message) {
      toast.error("Please add the message.")
    }
    else {
      dispatch(sendGroupMessage(conversation))
    }

    setMessage("")
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

  if (isSuccess) {
    return (
      <div style={{ paddingTop: "3vh", margin: "0 calc(100vw/20)", }}>
        <div className="rounded" style={{ backgroundColor: "rgba(0,0,0,.7)", color: "white", padding: "0 5rem 2rem 5rem" }}>
          <section className='pt-3 row'>
            <h2 className='col-6'>Group Message</h2>

            {(JSON.parse(localStorage.getItem('user')))
              ? <button type="button" className='btn btn-outline-secondary mx-3 col' style={{ color: "white" }} onClick={() => navigate('/')}>Messagebox</button>
              : <button type="button" className='btn btn-outline-secondary mx-3 col' style={{ color: "white", float: "right" }} onClick={() => navigate('/login')}>Login</button>
            }

            <button type="button" className='btn btn-outline-secondary mx-3 col' style={{ color: "white" }} onClick={() => navigate('/register')}>Register</button>
          </section>

          <div className="input-group mt-2 mb-2">
            <label htmlFor="senderName" className="input-group-text" style={{ backgroundColor: "rgb(51, 49, 49, .8)", color: "white" }}>Your Name : </label>
            <input type="text" autoComplete="off" className='form-control' id='senderName' name='senderName' value={senderName} placeholder='Enter your name.' onChange={(e) => setSenderName(e.target.value)} />
          </div>

          <div className="rounded" style={{ border: "1px solid #b1b1b1", height: '65vh', overflowY: 'auto', backgroundColor: "rgba(33, 24, 25, .9)" }} ref={chatContainerRef}>
            <div>
              {getGroupMessage.map((m) => (
                <div className='pt-3'>
                  <fieldset className=" px-2 pb-2">
                    <legend className="float-none w-auto text-smaller"><strong>{m.Sender}</strong></legend>
                    {/* Icon from bootstrap */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-return-right" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M1.5 1.5A.5.5 0 0 0 1 2v4.8a2.5 2.5 0 0 0 2.5 2.5h9.793l-3.347 3.346a.5.5 0 0 0 .708.708l4.2-4.2a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 8.3H3.5A1.5 1.5 0 0 1 2 6.8V2a.5.5 0 0 0-.5-.5" />
                    </svg> {m.Message}
                  </fieldset>
                </div>
              ))}
            </div>

            <div>
              {yourMessage.map((p) => (
                <div className='pt-3'>
                  <fieldset className=" px-2 pb-2">
                    <legend className="float-none w-auto text-smaller"><strong>{p.senderName}</strong></legend>
                    {/* Icon from bootstrap */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-return-right" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M1.5 1.5A.5.5 0 0 0 1 2v4.8a2.5 2.5 0 0 0 2.5 2.5h9.793l-3.347 3.346a.5.5 0 0 0 .708.708l4.2-4.2a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 8.3H3.5A1.5 1.5 0 0 1 2 6.8V2a.5.5 0 0 0-.5-.5" />
                    </svg> {p.message}
                  </fieldset>
                </div>
              ))}
            </div>
          </div>

          <div>
            <section>
              <form action="" onSubmit={onSubmit} className='input-group mt-2'>
                <input type="text" autoComplete="off" className='form-control' id='message' name='message' value={message} placeholder='Enter your message.' onChange={(e) => setMessage(e.target.value)} />
                <button type="submit" className='input-group-text d-flex justify-content-center' style={{ width: "8rem", backgroundColor: "rgb(51, 49, 49, .8)", color: "white" }}>Send</button>
              </form>
            </section>
          </div>
        </div>
      </div>
    )
  }

}

