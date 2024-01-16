import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GroupMessage from './components/GroupMessage';
import Message from './components/Message';
import Registration from './components/Registration';
import Login from './components/Login';

function App() {  
    
  return (
    <>
    <Router>
      <div className='container'>
        <Routes>
          <Route path="/register" element={<Registration />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/groupmessage" element={<GroupMessage />}/>
          <Route path="/" element={<Message />}/>
        </Routes>                       
      </div>
    </Router>
    <ToastContainer />
    </>
  );
}

export default App;
