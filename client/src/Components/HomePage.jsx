import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItems from '../Other-components/ListingItems';

function HomePage() {

  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);
  // console.log(rentListings);

  useEffect(() => {
    const fetchOfferListing = async () => {
      try {
        const res = await fetch(`/api/listing/getListing?offer=true&limit=4`);
        const data = await res.json();
        setOfferListings(data);
        fetchRentListing();//as we are loading data one by one so we first fetch result for offer then fetch result for the rent and sell
      } catch (error) {
        console.log(error);
      }
    }

    const fetchRentListing = async () => {
      try {
        const res = await fetch(`/api/listing/getListing?type=rent&limit=4`);
        const data = await res.json();
        setRentListings(data);
        fetchSellListing();
      } catch (error) {
        console.log(error);
      }
    }

    const fetchSellListing = async () => {
      try {
        const res = await fetch(`/api/listing/getListing?type=sale&limit=4`);
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchOfferListing();
  }, []);

  return (
    <div>
      {/* top  */}
      <div className='sm:flex'>
        <div className=' p-6 sm:py-20 sm:pl-20 font-bold flex-1'>
          <h1 className='text-3xl text-slate-900'>Unlock Your <span className='text-red-700'>Dream Home</span>
            <br />with Riyl Estate...
          </h1>
          <p className='text-slate-600 pt-4'>At Riyl Estate, we're dedicated to helping you find your perfect abode,<br /> whether it's a cozy apartment in the heart of the city or a serene villa<br /> by the sea. With our comprehensive listings and expert guidance,<br /> embark on a seamless journey towards owning your ideal property.<br /> Your dream home awaits at Riyl Estate. </p>

          <p className='pt-4'>
            <Link className='text-red-600' to={'/search'}>
              Lets get started...
            </Link>
          </p>
        </div>
        <div className='hidden sm:block p-6 sm:py-20 sm:px-10 flex-1 flex items-center justify-start'>
          <img src='https://t3.ftcdn.net/jpg/03/22/06/68/240_F_322066808_CANrp7u5Cdiz7700TJReqKD299d2AZtD.jpg'
            className='rounded w-full self-center shadow-lg hover:scale-105 transition:hover duration-200' alt='homeimg url' />
        </div>
      </div>
      {/* slider */}
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className='h-[250px] sm:h-[500px]'
                key={listing._id}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* results */}


      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerListings && offerListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent offers</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>Show more offers</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerListings.map((listing) => (
                <ListingItems listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rent</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>Show more places for rent</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing) => (
                <ListingItems listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sale</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>Show more places for sale</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {saleListings.map((listing) => (
                <ListingItems listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage