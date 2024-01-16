import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
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
    
    const dispatch = useDispatch()

    const {registerdUser, isLoading, isError, isSuccess, message} = useSelector((state)=>{
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

        if(password !== password2){
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
                <h1>Loading .....</h1>
            </div>
        )        
    }

    return (
        <div>
        <section className='heading'>
            <h1>
                Register
            </h1>
            <p>Please Create an account.</p>
        </section>

        <section className='form'>
            <form action="" onSubmit={onSubmit}>
                <div className="form-group">
                    <input type="text" className='form-control' id='name' name='name' value={name} placeholder='Enter your name.' onChange={onChange} />
                </div>
                <div className="form-group">
                    <input type="email" className='form-control' id='email' name='email' value={email} placeholder='Enter your email.' onChange={onChange} />
                </div>
                <div className="form-group">
                    <input type="password" className='form-control' id='password' name='password' value={password} placeholder='Enter your password.' onChange={onChange} />
                </div>
                <div className="form-group">
                    <input type="password" className='form-control' id='password2' name='password2' value={password2} placeholder='Confirm password.' onChange={onChange} />
                </div>
                <div className="form-group">
                    <button type="submit" className='btn btn-block'>Submit</button>
                </div>
            </form>
        </section>
        </div>
    )
}

export default Registration
