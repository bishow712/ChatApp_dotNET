import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../features/user/userSlice'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })
    
    const {email,password} = formData

    const dispatch = useDispatch()
    
    const {loggedInUser, isLoading, isError, isSuccess, message} = useSelector((state)=>{
        return state.user
    })

    const onChange = (e) =>{
        setFormData((prevState)=>({
          ...prevState,
          [e.target.name]: e.target.value,
        }))
      }
    
      const onSubmit = (e) =>{
        e.preventDefault()
    
        const userData = {
          email,password
        }
        
        if(!email || !password){
            toast.error("Can't leave the field empty.")
        } else {
            dispatch(loginUser(userData))
        }
      }
    

      if(isLoading){
        return (
            <div>
                <h1>Loading .....</h1>
            </div>
        )        
    }

    return (
        <div>
            <section className='heading text-center mt-4'>
                <h1>
                    Login
                </h1>
                <p>Login to your account.</p>
            </section>

            <section className='form'>
                <form action="" onSubmit={onSubmit}>
                <div className="form-group">
                    <input type="email" className='form-control' id='email' name='email' value={email} placeholder='Enter your email.' onChange={onChange} />
                </div>
                <div className="form-group">
                    <input type="password" className='form-control' id='password' name='password' value={password} placeholder='Enter your password.' onChange={onChange} />
                </div>
                <div className="form-group">
                    <button type="submit" className='btn btn-block' style={{border: "1px solid black"}}>Log In</button>
                </div>
                </form>
            </section>

            <section className='text-center mt-4'>
                <p className=''>Register another account. <Link to='/register' className='link-offset-2 link-opacity-75-hover'>Register Here</Link></p>
                <p>Don't want to login. <Link to='/groupmessage' className='link-offset-2 link-opacity-75-hover'>Join Group Message</Link></p>
            </section>
        </div>
    )
}

export default Login
