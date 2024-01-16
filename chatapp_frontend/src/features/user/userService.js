import axios from 'axios'

const registerUser = async (userData) =>{
    const response = await axios.post("https://localhost:7034/api/user/registration", userData)

    return response.data
}

const loginUser = async (userData) =>{
    const response = await axios.post("https://localhost:7034/api/user/login", userData)

    if(response.data){
        localStorage.setItem('user', JSON.stringify(response.data))
    }

    return response.data
}

const userService = {
    registerUser,
    loginUser,
}

export default userService