import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import ListingItems from '../Other-components/ListingItems';

function SearchPage() {
    const [sideBarData, setSideBarData] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'created_at',//to get the type of the sorting in terms of the creation time or the regularPrice value
        order: 'desc',//to get the asc and desc of both time and price as well
    });

    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(false);
    // console.log(listings);

    const navigate = useNavigate();
    // console.log(sideBarData);

    const handleChange = (e) => {
        if (e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
            setSideBarData({ ...sideBarData, type: e.target.id })
        }

        if (e.target.id === 'searchTerm') {
            setSideBarData({ ...sideBarData, searchTerm: e.target.value })
        }

        if (e.target.id === 'furnished' || e.target.id === 'parking' || e.target.id === 'offer') {
            setSideBarData({ ...sideBarData, [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false })
        }

        if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'created_at';
            const order = e.target.value.split('_')[1] || 'desc';

            setSideBarData({ ...sideBarData, order, sort });
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParam = new URLSearchParams();//this get us the current url of the tab
        urlParam.set('searchTerm', sideBarData.searchTerm);
        urlParam.set('type', sideBarData.type);
        urlParam.set('offer', sideBarData.offer);
        urlParam.set('furnished', sideBarData.furnished);
        urlParam.set('parking', sideBarData.parking);
        urlParam.set('sort', sideBarData.sort);
        urlParam.set('order', sideBarData.order);

        const searchQuery = urlParam.toString();
        navigate(`/search?${searchQuery}`);
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermURl = urlParams.get('searchTerm');
        if (searchTermURl) {
            setSideBarData({ ...sideBarData, searchTerm: searchTermURl });
        }

        const fetchListings = async () => {
            setLoading(true);
            setShowMore(false);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/listing//getListing?${searchQuery}`);
            const data = await res.json();
            if (data.length > 8) {
                setShowMore(true)
            } else {
                setShowMore(false)
            }
            setListings(data);
            setLoading(false);
        }
        fetchListings();
    }, [location.search])

    const onShowMoreClick = async () => {
        const listingLength = listings.length;
        const startIndex = listingLength;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/getListing?${searchQuery}`);
        const data = await res.json();
        if (data.length < 9) {
            setShowMore(false);
        }
        setListings([...listings, ...data]);
    }
    return (
        <div className='flex flex-col sm:flex-row'>
            <div className='p-7 border-b-2 sm:border-r-2 sm:min-h-screen'>
                <form onSubmit={handleSubmit}>
                    <div className='flex items-center gap-2'>
                        <label className='whitespace-nowrap font-semibold'>Search Term : </label>
                        <input type='text' id='searchTerm'
                            placeholder='Search...'
                            className='border px-3 py-1 rounded-lg w-full'
                            value={sideBarData.searchTerm}
                            onChange={handleChange} />
                    </div>
                    <div className='flex flex-col pt-4'>
                        <label className='self-center font-semibold'>Type : </label>
                        <div className='flex justify-around pt-2'>
                            <div className='flex flex-row gap-2'>
                                <input type='checkbox' id='all' className='w-4'
                                    onChange={handleChange}
                                    checked={sideBarData.type === 'all'} />
                                <span>Rent & Sell</span>
                            </div>
                            <div className='flex flex-row gap-2'>
                                <input type='checkbox' id='rent' className='w-4'
                                    onChange={handleChange}
                                    checked={sideBarData.type === 'rent'} />
                                <span>Rent</span>
                            </div>
                            <div className='flex flex-row gap-2'>
                                <input type='checkbox' id='sale' className='w-4'
                                    onChange={handleChange}
                                    checked={sideBarData.type === 'sale'} />
                                <span>Sell</span>
                            </div>
                            <div className='flex flex-row gap-2'>
                                <input type='checkbox' id='offer' className='w-4'
                                    onChange={handleChange}
                                    checked={sideBarData.offer} />
                                <span>Offer</span>
                            </div>
                        </div>
                    </div>
                    <div className='flex gap-2 items-center pt-4'>
                        <label className='font-semibold'>Amenities : </label>
                        <div className='flex justify-around gap-2 items-center pt-2'>
                            <div className='flex flex-row gap-2'>
                                <input type='checkbox' id='furnished' className='w-4'
                                    onChange={handleChange}
                                    checked={sideBarData.furnished} />
                                <span>Furnished</span>
                            </div>
                            <div className='flex flex-row gap-2'>
                                <input type='checkbox' id='parking' className='w-4'
                                    onChange={handleChange}
                                    checked={sideBarData.parking} />
                                <span>Parking</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 pt-4 items-center">
                        <label className='font-semibold'>Sort : </label>
                        <select id='sort_order'
                            className='px-2 py-1 border border-slate-700 rounded-md'
                            onChange={handleChange}
                            defaultValue={'created_at_desc'}>
                            {/* we are keeping the default value as sort by latest and order by the price descending */}
                            <option value={'regularPrice_desc'}>Price high to low</option>
                            <option value={'regularPrice_asc'}>Price low to high</option>
                            <option value={'createdAt_desc'}>Latest</option>
                            <option value={'createdAt_asc'}>Oldest</option>
                        </select>
                    </div>
                    <button className='bg-red-600 w-full mt-4 rounded py-1 text-white font-semibold text-lg'>Search</button>
                </form>
            </div>
            <div className='p-7'>
                <h1 className='font-semibold text-2xl border-black border-b-2 w-full'>Listing Results :</h1>
                <div className='border-t-2 pt-2 flex flex-wrap gap-4'>
                    {
                        loading === false && listings.length === 0 && (
                            <p className='font-mono text-xl text-slate-800'>No Result Found!!</p>
                        )
                    }
                    {
                        loading && (
                            <p className='font-mono text-xl text-slate-800'>Loading...</p>
                        )
                    }

                    {
                        !loading && listings && listings.map((listing) => (
                            <ListingItems key={listing._id} listing={listing} />
                        ))
                    }
                    {
                        showMore && (
                            <button className='text-green-700 hover:underline w-full text-center' onClick={() => onShowMoreClick()}>
                                Show more...
                            </button>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default SearchPage