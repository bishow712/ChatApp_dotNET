import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import {toast} from 'react-toastify'
import { registerUser, reset } from '../features/user/userSlice'

function Registration() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    })

    const {name, email,password, password2} = formData
    
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {registerdUser, isLoading, isError, isSuccess, message} = useSelector((state)=>{
        return state.user
    })

    useEffect(() => {
        if(isError){
            toast.error("Email already exists.")
            toast.error(message)
            dispatch(reset())
        }
    
        if(isSuccess){
            toast.success("User Registered.")
            navigate('/login')
        }
    
        dispatch(reset())
        
    }, [isError, isSuccess, message, navigate, dispatch])

    const onChange = (e) =>{
        setFormData((prevState)=>({
          ...prevState,
          [e.target.name]: e.target.value,
        }))
    }

    const onSubmit = (e) =>{
        e.preventDefault()
        
        if(!name || !email || !password || !password2){
            toast.error("Can't leave the field empty.")
        }
        else if(password !== password2){
            toast.error('Password do not match.')
        } else {
            const userData = {
            name, email, password
        }

        dispatch(registerUser(userData))
        }
    }

    if(isLoading){
        return (
            <div>
                <div className='position-absolute top-50 start-50 translate-middle'>
                    <div className="loader"></div>
                </div>
            </div>
        )        
    }

    return (
        <div>
        <section className='heading text-center mt-4'>
            <h1>             
                Register
            </h1>
            <p>Please Create an account.</p>
        </section>

        <section className='form'>
            <form action="" onSubmit={onSubmit}>
                <div className="form-group">
                    <input type="text" autoComplete='off' className='form-control' id='name' name='name' value={name} placeholder='Enter your name.' onChange={onChange} />
                </div>
                <div className="form-group">
                    <input type="email" autoComplete='off' className='form-control' id='email' name='email' value={email} placeholder='Enter your email.' onChange={onChange} />
                </div>
                <div className="form-group">
                    <input type="password" className='form-control' id='password' name='password' value={password} placeholder='Enter your password.' onChange={onChange} />
                </div>
                <div className="form-group">
                    <input type="password" className='form-control' id='password2' name='password2' value={password2} placeholder='Confirm password.' onChange={onChange} />
                </div>
                <div className="form-group">
                    <button type="submit" className='btn btn-outline-secondary btn-block' style={{border: "1px solid grey"}}>Register</button>
                </div>
            </form>
        </section>

        <section className='text-center mt-4'>                       
            {(JSON.parse(localStorage.getItem('user'))) 
            ? <p>You are logged in. <Link to='/' className='link-offset-2 link-opacity-75-hover'>Visit Your Messagebox</Link></p> 
            : <p className=''>Already have an account. <Link to='/login' className='link-offset-2 link-opacity-75-hover'>Login Here</Link></p> }
            <p>Don't want to register. <Link to='/groupmessage' className='link-offset-2 link-opacity-75-hover'>Join Group Message</Link></p>
        </section>
        </div>
    )
}

export default Registration
