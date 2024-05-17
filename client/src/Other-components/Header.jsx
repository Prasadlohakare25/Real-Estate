import { FaSearch } from 'react-icons/fa'
import React, { useEffect, useState } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'

function Header() {
    const { currentUser } = useSelector(state => state.user)
    const [nav, setNav] = useState(false)
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate()

    const handleSearch = (e) => {
        e.preventDefault();
        const urlParam = new URLSearchParams(window.location.search);//this get us the current url of the tab 
        urlParam.set('searchTerm', searchTerm);//setting the new term to the search term
        const searchQuery = urlParam.toString();//this converts the seaarch term ot string as it has numbers boolean value also
        navigate(`/search?${searchQuery}`)
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermURl = urlParams.get('searchTerm');
        if (searchTermURl) {
            setSearchTerm(searchTermURl);
        }
    }, [location.search])

    return (
        <header className='bg-slate-300 shadow-md'>
            <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
                <h1 className='font-bold text-sm sm:text-2xl flex felx-wrap'>
                    <span className='text-red-800'>Riyl</span>
                    <span className='text-slate-800'>Estate</span>
                </h1>
                <form onSubmit={handleSearch} className='bg-slate-100 p-3 rounded-lg flex items-center'>
                    <input type="text" placeholder='Search...'
                        className='bg-transparent focus:outline-none w-24 sm:w-64'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} />
                    <button type='submit'>
                        <FaSearch className='text-slate-600' />
                    </button>
                </form>
                <ul className='flex gap-8'>
                    <Link to='/'>
                        <li className='hidden sm:inline text-slate-700 hover:underline'>
                            Home
                        </li>
                    </Link>
                    <Link to='/about'>
                        <li className='hidden sm:inline text-slate-700 hover:underline'>
                            About
                        </li>
                    </Link>
                    {currentUser ? (
                        <Link to='/create-listing'>
                            {currentUser ? (
                                <li className='hidden sm:inline text-slate-700 hover:underline'>
                                    Create Listing</li>
                            ) : ""}

                        </Link>
                    ) : ""}

                    <Link to='/profile'>
                        {currentUser ? (
                            <img
                                className='rounded-full h-9 w-9 object-cover'
                                src={currentUser.avatar}
                                alt='profile'
                            />
                        ) : (
                            <li className=' text-slate-700 hover:underline'> Sign in</li>
                        )}
                    </Link>
                </ul>

            </div>
        </header>
    )
}

export default Header