import axios from 'axios'

const sendGroupMessage = async (conversation)=>{
    const response = await axios.post("https://localhost:7034/api/GroupMessage/createmessage", conversation)

    return response.data
}

const getGroupMessages = async ()=>{
    const response = await axios.get("https://localhost:7034/api/GroupMessage/getmessages")

    return response.data
}

const groupMessageService = {
    sendGroupMessage,
    getGroupMessages,
}

export default groupMessageService