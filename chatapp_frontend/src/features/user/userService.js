import axios from 'axios'

const loggedInUserId = JSON.parse(localStorage.getItem('user'))?.[0]?.id

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

const deleteUser = async () =>{
    const response = await axios.delete(`https://localhost:7034/api/user/${loggedInUserId}`)
    localStorage.removeItem('user')

    return response.data
}


const logoutUser = ()=>{
    localStorage.removeItem('user')
}

const userService = {
    registerUser,
    loginUser,
    logoutUser,
    deleteUser,
}

export default userService