import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRef } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserFailure, signOutUserStart, signOutUserSuccess, updateUserFailure, updateUserStart, updateUserSuccess } from '../redux/user/userSlice'
// import { useDispatch} from 'react-redux';
import { Link } from "react-router-dom"


//in the firebase code we should do the image type not images to upload the images properly

function Profile() {
  const fileRef = useRef(null);//giving ref of the input type to the image src so that we can use it woth good UI
  const { currentUser, loading, error } = useSelector((state) => state.user)
  const [file, setFile] = useState(undefined)//to set the new profile photo and using it without loading
  // console.log(file);
  const [filePerc, setFilePerc] = useState(0);//to define the percentage of the file uploaded 
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [listingError, setListingError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();
  // console.log(filePerc);
  // console.log(fileUploadError);
  // console.log(formData);
  useEffect(() => {
    if (file) {
      handleFileUpload(file);//to get the immediate changes in the website
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;//giving unique name to the file
    const storageRef = ref(storage, fileName);//creating the reference for the storage
    const uploadTask = uploadBytesResumable(storageRef, file)//to check the percentage of the file uploaded

    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setFilePerc(Math.round(progress))
      // console.log(progress)
    },
      (error) => {
        setFileUploadError(true)//if any error occurs it will be set to true
      },

      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  //this is an event listener that works when something canges in the form data
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  //this function handle when we submit the from of the update of the user profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());
      const res = await fetch(`api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleDelete = async (e) => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      })
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));

    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart())
      const res = await fetch('api/auth/signOut')//as for the get request there is by default
      const data = res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    }
    catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  }

  const handleShowListings = async () => {
    try {
      setListingError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setListingError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setListingError(true);
    }
  }

  const handleDeleteListing = async (id) => {
    try {
      const res = await fetch(`/api/lisiting/delete/${id}`, {
        method: 'DELETE',
      });
      const data = res.json();
      if (data.success === false) {
        console.log(data.message)
        return;
      }

      setUserListings((prev) => prev.filter((listings) => listings._id !== id))
    } catch (error) {
      console.log(error.message);
    }
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold my-7 text-center'>Profile</h1>
      <form className='flex flex-col gap-y-4' onSubmit={handleSubmit}>
        {/* below one is not visible file */}
        <input type='file' onChange={(e) => setFile(e.target.files[0])} ref={fileRef} hidden accept='image/*' />
        <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt={currentUser.userName} className='rounded-full h-24 w-24 object-cover self-center mt-2 cursor-pointer' id='avatar' />
        <p className='text-sm self-center'>
          {fileUploadError ? <span className='text-red-600'>Could not upload the Image(Size must be less than 2MB)</span>
            : filePerc > 0 && filePerc < 100 ? <span className='text-slate-600'>{`Uploading ${filePerc}%`}</span>
              : filePerc === 100 ? <span className='text-green-600'>Image Updated successfully</span>
                : ""}
        </p>
        {/* the above code give the percentage of the image uploaded or else if there is a error it will show the error message and if image is uploaded successfully  */}

        <input type='text' placeholder='Name' id='name' className='border p-3 rounded-lg' defaultValue={currentUser.name} onChange={handleChange} />
        <input type='text' placeholder='UserName' id='userName' className='border p-3 rounded-lg' defaultValue={currentUser.userName} onChange={handleChange} />
        <input type='text' placeholder='Email' id='email' className='border p-3 rounded-lg' defaultValue={currentUser.email} onChange={handleChange} />
        <input type='password' placeholder='Password' id='password' className='border p-3 rounded-lg' onChange={handleChange} />
        <button disabled={loading} className='bg-green-700 rounded-md py-2 text-lg font-semibold hover:opacity-80 disabled:opacity-90 text-slate-100'>{loading ? "Loading..." : "Update"}</button>
        <Link to={'/create-listing'} className='bg-gray-800 rounded-md py-2 text-lg font-semibold hover:opacity-80 disabled:opacity-90 text-center text-slate-100'>Create Listing</Link>
      </form>
      <div className='flex justify-between mt-4'>
        <span onClick={handleDelete} className='text-red-600 cursor-pointer'>Delete Account</span>
        <span onClick={handleSignOut} className='text-red-600 cursor-pointer'>Sign Out</span>
      </div>
      <p className='text-red-600 mt-4'>{error ? error : ''}</p>
      <p className='text-green-600 mt-4'>{updateSuccess ? "Updated Successfully!!" : ''}</p>
      <button onClick={handleShowListings} className='text-green-700 w-full self-center'>Show Lisitngs</button>
      <p className='text-red-600 mt-4'>{listingError ? "Error showing the listings" : ""}</p>
      {userListings && userListings.length > 0 &&
        <div className='flex flex-col gap-3'>
          <h1 className='font-semibold text-2xl text-center mt-3'>Your Listings</h1>
          {userListings.map((listings) => (
            <div key={listings._id} className='flex justify-between px-5 items-center border rounded-md py-2'>
              <Link to={`/listing/${listings._id}`}>
                <img src={listings.imageUrls[0]} alt='listing urls' className='h-16 w-16 object-contain' />
              </Link>
              <Link className='flex-1 text-slate-700 font-semibold hover:underline truncate' to={`/listing/${listings._id}`}>
                <p className=''>{listings.name}</p>
              </Link>
              <div className='flex flex-col'>
                <button onClick={() => handleDeleteListing(listings._id)} className='text-red-700 uppercase'>Delete</button>
                <Link to={`/update-listing/${listings._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          )
          )}
        </div>
      }
    </div>
  )
}

export default Profile