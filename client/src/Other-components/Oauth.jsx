import React from 'react'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase';
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../redux/user/userSlice'//to check if user is created or not
import { useNavigate } from 'react-router-dom'

function Oauth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);
            console.log(result);

            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    userName: result.user.displayName,
                    email: result.user.email,
                    avatar: result.user.photoURL,
                }),
            })

            const data = await res.json();
            dispatch(signInSuccess(data));
            navigate('/');
        } catch (error) {
            console.log("Could not sign in with google", error);
        }
    }
    return (
        <button type='button' onClick={handleGoogleClick} className='w-full hover:opacity-90 bg-red-900 py-1 rounded-md my-3'>Continue with Google</button>
    )
}

export default Oauth