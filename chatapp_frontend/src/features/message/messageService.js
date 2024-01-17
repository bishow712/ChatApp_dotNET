import axios from 'axios'

const loggedInUserId = JSON.parse(localStorage.getItem('user'))?.[0]?.id

const createMessage = async(messageReceiver, messageToSend) => {
    const response = await axios.post(`https://localhost:7034/api/message/createmessage/${loggedInUserId}/${messageReceiver}/${messageToSend}`)

    return response.data
}

const allusers = async() => {
    const response = await axios.get('https://localhost:7034/api/user/users')

    return response.data
}

const messageReceivers = async() => {
    const response = await axios.get(`https://localhost:7034/api/message/messagereceivers/${loggedInUserId}`)

    return response.data
}

const getMessages = async (messageReceiver)=>{
    const response = await axios.get(`https://localhost:7034/api/message/getmessages/${loggedInUserId}/${messageReceiver}`)

    return response.data
}

const messageService = {
    createMessage,
    allusers,
    messageReceivers,
    getMessages,
}

export default messageService