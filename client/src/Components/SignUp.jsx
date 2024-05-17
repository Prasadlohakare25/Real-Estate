import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Oauth from '../Other-components/Oauth';

function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null)//to check error in the submittion
  const [loading, setLoading] = useState(false)//to show the loading in submit button
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
    console.log(formData)
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);//this we have done to show loading button while the form is getting submitted
      const res = await fetch('/api/auth/signup', {//we have set the path of the api in vite config file and rest all the routes we calling here (anything that starts with api)
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)//convertinf the data of the form into string
      })
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);//is any error occurs while submiting the form 
        setLoading(false);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/sign-in')
      // console.log(data)
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }
  return (
    <div className='bg-gradient-to-b from-slate-100 via-slate-300 to-slate-500 h-[88vh]'>
      <h1 className='font-semibold text-center text-4xl my-2 md:my-4'>
        Sign Up
      </h1>
      <div className='flex justify-center align-middle p-4'>
        <form onSubmit={handleSubmit} className='border-2 border-slate-800 rounded-md p-5 bg-slate-900 shadow-lg shadow-slate-900 text-slate-50 flex flex-col md:p-10 md:font-medium md:w-1/3'>
          <label htmlFor="name">Enter your Name</label>
          <input type='text' id='name' name='name' onChange={handleChange} className='border-black border-2 text-slate-800 bg-slate-100 px-4 py-1 rounded-md' />
          <label htmlFor="userName">Enter UserName</label>
          <input type='text' id='userName' name='userName' onChange={handleChange} className='border-black border-2  text-slate-800 bg-slate-100 px-4 py-1 rounded-md' />
          <label htmlFor="email">Enter your Email</label>
          <input type='text' id='email' name='email' onChange={handleChange} className='border-black border-2 text-slate-800 bg-slate-100 px-4 py-1 rounded-md' />
          <label htmlFor="password">Set Password</label>
          <input type='password' id='password' name='password' onChange={handleChange} className='border-black border-2 text-slate-800 bg-slate-100 px-4 py-1 rounded-md' />
          <button disabled={loading} type='submit' className='mt-4 hover:opacity-90 bg-blue-800 w-full rounded-md py-1'>{loading ? 'Loading...' : 'Sign Up'}</button>
          <Oauth />
          <div className='flex'>
            <pre>Already have account? </pre>
            <Link to='/sign-in' className='text-blue-700 font-bold'> Sign in</Link>
          </div>
          {error && <p className='text-red-500 mt-5'>{error}</p>}
        </form>

      </div>
    </div>
  )
}

export default SignUp