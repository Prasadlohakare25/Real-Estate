import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { useSelector } from 'react-redux';
import {
    FaBath,
    FaBed,
    FaChair,
    FaMapMarkedAlt,
    FaMapMarkerAlt,
    FaParking,
    FaShare,
} from 'react-icons/fa';
import Contact from '../Other-components/Contact';

function Listing() {
    SwiperCore.use([Navigation]);
    const param = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);
    const [contact, setContact] = useState(false);
    const { currentUser } = useSelector(state => state.user)
    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/listing/getListing/${param.listingId}`)
                const data = await res.json();
                if (data.success === false) {
                    setError(data.message);
                    setLoading(false);
                    return;
                }
                // console.log(data);
                setListing(data);
                // console.log(listing)
                setLoading(false);
                setError(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }

        }
        fetchListing();
    }, [param.listingId])
    return (
        <div className=''>
            {loading && <p className='text-center my-4 text-xl'>Loading...</p>}
            {error && <p className='text-red-700 my-4 text-xl'>Something went wrong...</p>}
            {listing && !loading && !error && (
                <div>
                    <Swiper navigation>
                        {listing.imageUrls.map((url) => (//use this bracket only as we are rendering the div inside it so we have to use this one only
                            <SwiperSlide key={url}>
                                <div className='h-[300px] sm:h-[550px]' style={{ background: `url(${url}) center no-repeat`, backgroundSize: 'cover' }}>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    {/* to copy the url of the page to share on the clipboard  */}
                    <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
                        <FaShare
                            className='text-slate-500'
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                setCopied(true);
                                setTimeout(() => {
                                    setCopied(false);
                                }, 2000);
                            }}
                        />
                    </div>
                    {copied && (
                        <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
                            Link copied!
                        </p>
                    )}
                    <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
                        <p className='text-2xl font-semibold'>
                            {listing.name} - ₹{' '}
                            {listing.offer
                                ? listing.discountPrice.toLocaleString('en-US')
                                : listing.regularPrice.toLocaleString('en-US')}
                            {listing.type === 'rent' && ' / month'}
                        </p>
                        <p className='flex items-center mt-6 gap-2 text-slate-700  text-md'>
                            <FaMapMarkerAlt className='text-amber-950' />
                            {listing.address}
                        </p>
                        <div className='flex gap-4'>
                            <p className='bg-amber-900 w-full max-w-[200px] text-white font-semibold text-center p-1 rounded-md'>
                                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                            </p>
                            {listing.offer && (
                                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                                    ₹{+listing.regularPrice - +listing.discountPrice} OFF
                                </p>
                            )}
                        </div>
                        <p className='text-slate-800'>
                            <span className='font-semibold text-black'>Description - </span>
                            {listing.description}
                        </p>
                        <ul className='text-amber-950 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <FaBed className='text-lg' />
                                {listing.bedrooms > 1
                                    ? `${listing.bedrooms} Beds `
                                    : `${listing.bedrooms} Bed `}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <FaBath className='text-lg' />
                                {listing.bathrooms > 1
                                    ? `${listing.bathrooms} Baths `
                                    : `${listing.bathrooms} Bath `}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <FaParking className='text-lg' />
                                {listing.parking ? 'Parking spot' : 'No Parking'}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <FaChair className='text-lg' />
                                {listing.furnished ? 'Furnished' : 'Unfurnished'}
                            </li>
                        </ul>
                        {
                            currentUser && currentUser._id !== listing.userRef && !contact && <button onClick={() => setContact(true)} className='text-white bg-sky-900 rounded uppercase hover:opacity-85 p-3 md:w-1/2 md:self-center'>
                                Contact owner
                            </button>
                        }
                        {
                            contact && <Contact listing={listing}/>//passing the listing as props 
                        }

                    </div>
                </div>
            )}
        </div>
    )
}

export default Listing