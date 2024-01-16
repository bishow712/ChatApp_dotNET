import React from 'react';
import './App.css';
import GroupMessage from './components/GroupMessage';
import Message from './components/Message';
import Registration from './components/Registration';
import Login from './components/Login';

function App() {  
    
  return (
    <div>
        <Registration />
        <Login />
        {/* <Message /> */}
        {/* <GroupMessage /> */}
    </div>
  );
}

export default App;
