import axios from 'axios'

const getGroupMessages = async ()=>{
    const response = await axios.get("https://localhost:7034/api/GroupMessage/getmessages")

    return response.data
}

const groupMessageService = {
    getGroupMessages
}

export default groupMessageService