import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';

function Contact({ listing }) {
    const [owner, setOwner] = useState(null);
    const [error, setError] = useState(false);
    const [message, setMessage] = useState("");
    const onChange = (e) => {
        setMessage(e.target.value);
    }
    useEffect(() => {
        const fetchOwner = async () => {
            try {
                setError(false);
                const res = await fetch(`/api/user/${listing.userRef}`);
                const data = await res.json();
                if (data.success === false) {
                    setError(data.message)
                    console.log(data.message);
                }
                // console.log(data);
                setOwner(data);
            } catch (error) {
                setError(error);
                console.log(error);
            }
        }
        fetchOwner();
    }, [listing.userRef])
    return (
        <>{owner && (
            <div className='flex flex-col gap-3'>
                <p>Contact <span className='text-slate-800 font-semibold'>{owner.name} </span>
                    for <span className='text-slate-800 font-semibold'>{listing.name.toLowerCase()} </span></p>

                <textarea name='message' id='message' value={message} rows={2} onChange={onChange} placeholder='Enter your message here...' className='w-full border rounded-lg p-3' />
                <Link className='text-white bg-slate-800 p-2 rounded-lg text-center uppercase hover:opacity-90' to={`mailto:${owner.email}?subject=Regarding ${listing.name}&body=${message}`}>Send Message</Link>
                {error && <p className='text-red-700'>{error}</p>}
            </div>
        )}</>
    )
}

export default Contact