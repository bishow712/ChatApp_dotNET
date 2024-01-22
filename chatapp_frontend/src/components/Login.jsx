import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, reset } from '../features/user/userSlice'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const { email, password } = formData

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { loggedInUser, isLoading, isError, isSuccess, message } = useSelector((state) => {
    return state.user
  })

  useEffect(() => {
    if (JSON.parse(localStorage.getItem('user'))) {
      toast("You are already logged in.")
      navigate('/')
    }
  }, [])

  useEffect(() => {
    if (isError) {
      toast.error("Invalid Credentials.")
      toast.error(message)
      dispatch(reset())
    }

    if (isSuccess) {
      toast.success("Login Successful.")
      navigate('/')
    }

    dispatch(reset())

  }, [isError, isSuccess, message, navigate, dispatch])

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    const userData = {
      email, password
    }

    if (!email || !password) {
      toast.error("Can't leave the field empty.")
    } else {
      dispatch(loginUser(userData))
    }
  }


  if (isLoading) {
    return (
      <div>
        <div className='position-absolute top-50 start-50 translate-middle'>
          <div className="loader"></div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ paddingTop: "calc(100vh/8)", margin: "0 calc(100vw/8)" }}>
      <div className='rounded pt-4 pb-4' style={{ backgroundColor: "rgba(0,0,0,.7)", color: "white" }}>
        <section className='heading text-center'>
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
              <button type="submit" className='btn button btn-outline-secondary btn-block' style={{ border: "1px solid grey" }}>Log In</button>
            </div>
          </form>
        </section>

        <section className='text-center mt-4'>
          <p className=''>Register an account. <Link to='/register' className='link-offset-2 link-opacity-75-hover'>Register Here</Link></p>
          <p>Don't want to login. <Link to='/groupmessage' className='link-offset-2 link-opacity-75-hover'>Join Group Message</Link></p>
        </section>
      </div>
    </div>
  )
}

export default Login
