import React from 'react'
import { Link } from 'react-router-dom'
import { FaMapMarkerAlt } from 'react-icons/fa';

function ListingItems({ listing }) {
    return (
        <div className='bg-white shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden rounded w-full sm:w-[280px]'>
            <Link to={`/listing/${listing._id}`}>
                <div className='shadow-md shadow-slate-800 '>
                    <img src={listing.imageUrls[0]} className='h-[260px] sm:h-[180px] w-full hover:scale-105 transition-scale duration-200 object-cover' alt="Image not found" />
                </div>
                <div className='py-3 flex flex-col gap-1 px-3'>
                    <p className='font-semibold truncate text-lg text-slate-700'>{listing.name}</p>
                    <p className='flex items-center gap-1 text-slate-700  text-sm'>
                        <FaMapMarkerAlt className='text-red-700' />
                        {listing.address}
                    </p>
                    <p className='line-clamp-2 pt-2 text-sm text-slate-600'>{listing.description}</p>
                    <p className='text-slate-500 font-semibold pt-2'>₹{listing.offer ? listing.discountPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')}
                        {listing.type === 'rent' ? "/month" : ''}
                    </p>
                    {/* .toLocaleString('en-US') to make commas after three digit in the price side */}
                    <div className='flex gap-4 text-sm font-semibold text-slate-800'>
                        <p>{listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : `${listing.bedrooms} Bed`} </p>
                        <p>{listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : `${listing.bathrooms} Bath`} </p>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default ListingItems