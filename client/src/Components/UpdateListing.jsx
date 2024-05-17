import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useEffect, useState } from 'react'
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

function UpdateListing() {
    const { currentUser } = useSelector(state => state.user)
    const navigate = useNavigate();
    const params = useParams();
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 5000,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false,
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);//for the submittion of the form
    const [loading, setLoading] = useState(false);//for the submittion of the form
    // console.log(formData);

    useEffect(() => {
        const fetchListing = async () => {
            const listingId = params.listingId;
            // console.log(listingId);
            const res = await fetch(`/api/listing/getListing/${listingId}`);
            const data = await res.json();
            if (data.success === false) {
                console.log(data.message);
                return;
            }
            setFormData(data);
        }

        fetchListing();
    }, [])

    const handleImageSubmit = (e) => {
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {//to confirm whether it has more than one images and less than 7
            setUploading(true)
            setImageUploadError(false);
            const promises = [];

            for (let i = 0; i < files.length; i++) {//to upload the file one by one in the promises array
                promises.push(storeImage(files[i]))
            }

            Promise.all(promises).then((urls) => {//this waits for all the promises to complete first (upload all the images)
                setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) });//keeping the previous data it adds the url of the new images
                setImageUploadError(false);
                setUploading(false);
            }).catch((error) => {
                setImageUploadError('Image Upload failed (2MB max)')
                setUploading(false);
            })
        } else if (files.length == 0) {
            setImageUploadError('Select one or more image to upload');
            setUploading(false);
        } else {
            setImageUploadError('Max 6 images can be uploaded per listing');
            setUploading(false);
        }
    }
    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName)
            const uploadTask = uploadBytesResumable(storageRef, file);//all the above code is for the uploading the imaegs into the firebase storage
            uploadTask.on("state_changed",//in this we have not used the snapshot as we don't have to check the progress of the upload
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(progress)
                },
                (error) => {//check is there is some error in the upload
                    reject(error);
                },
                () => {//retrieve the uploaded file and show it 
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    })
                }
            )
        });
    }

    const handleRemoveImage = (index) => {
        setFormData({//setting the new form data after removing the image
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index)//this filters the image which we have selected for deletion 
        })
    }

    const handleChange = (e) => {
        if (e.target.id === 'sale' || e.target.id === 'rent') {
            setFormData({
                ...formData,
                type: e.target.id,
            })
        }
        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked,//reason we add bracket is to get the name of the id instead of it in a string form
            })
        }
        if (e.target.type === 'text' || e.target.type === 'number' || e.target.type === 'textarea') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value,
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.imageUrls.length < 1) return setError("You must upload atleast one image");
            if (+formData.regularPrice < +formData.discountPrice) return setError("Discount price must be less than regular price")
            setLoading(true);
            setError(false);
            const res = await fetch(`/api/listing/update/${params.listingId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id,
                }),
            });
            const data = await res.json();
            setLoading(false);
            if (data.success === false) {
                setError(data.messsage);
            }
            navigate(`/listing/${data._id}`)
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    }
    return (
        <div className='p-3 max-w-4xl mx-auto my-2 bg-slate-200 shadow-xl rounded h-screen'>
            <h1 className='text-center my-6 font-semibold text-3xl'>Update a Listing</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-2 sm:flex-row'>
                <div className='flex flex-col gap-4 flex-1'>
                    <input type='text' id='name' placeholder='Name' className='border px-3 py-2 rounded-md' maxLength={62} minLength={10} required onChange={handleChange} value={formData.name} />
                    <textarea className='border px-3 py-2 rounded-md' placeholder='Description' id='description' required onChange={handleChange} value={formData.description} />
                    <input type='text' id='address' placeholder='Address' className='border px-3 py-2 rounded-md' required onChange={handleChange} value={formData.address} />
                    <div className='flex gap-6 flex-wrap'>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='sale' className='w-5' onChange={handleChange} checked={formData.type === 'sale'} />
                            <span>Sell</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='rent' className='w-5' onChange={handleChange} checked={formData.type === 'rent'} />
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='parking' className='w-5' onChange={handleChange} checked={formData.parking} />
                            <span>Parking Spot</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='furnished' className='w-5' onChange={handleChange} checked={formData.furnished} />
                            <span>Furnished</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='offer' className='w-5' onChange={handleChange} checked={formData.offer} />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className='flex flex-wrap gap-6'>
                        <div className='flex items-center gap-2'>
                            <input type='number' id='bedrooms' min={1} max={10} className='p-2 border border-slate-400 rounded-lg' required onChange={handleChange} value={formData.bedrooms} />
                            <span>Bedrooms</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type='number' id='bathrooms' min={1} max={10} className='p-2 border border-slate-400 rounded-lg' required onChange={handleChange} value={formData.bathrooms} />
                            <span>Bathrooms</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type='number' id='regularPrice' min={5000} max={10000000} className='p-2 border border-slate-400 rounded-lg' required onChange={handleChange} value={formData.regularPrice} />
                            <div className='flex flex-col items-center'>
                                <span>Regular Price</span>
                                <span className='text-xs'>(₹ / month)</span>
                            </div>
                        </div>
                        {formData.offer && (//if there is offer than only there would be discounted price
                            <div className='flex items-center gap-2'>
                                <input type='number' id='discountPrice' min={0} max={10000000} className='p-2 border border-slate-400 rounded-lg' required onChange={handleChange} value={formData.discountPrice} />
                                <div className='flex flex-col items-center'>
                                    <span>Discounted Price</span>
                                    <span className='text-xs'>(₹ / month)</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className='flex flex-col flex-1 gap-4'>
                    <p className='font-semibold'>Images : <span className='text-slate-800 font-normal text-sm'>The first image will be cover image (max : 6)</span></p>
                    <div className='flex gap-3'>
                        <input onChange={(e) => setFiles(e.target.files)} type='file' id='images' accept='image/*' multiple className='p-3 border border-slate-600 w-full rounded' />
                        <button onClick={handleImageSubmit} disabled={uploading} type='button' className='border border-green-700 text-green-700 px-2 py-1 rounded hover:shadow-lg disabled:opacity-80'>{uploading ? "Uploading..." : "Upload"} </button>
                    </div>
                    <p className='text-sm text-red-700'>{imageUploadError}</p>
                    {
                        formData.imageUrls.length > 0 && formData.imageUrls.map((urls, index) => (
                            <div key={urls} className='flex justify-between items-center p-3 border'>
                                <img src={urls} alt='listing images' className='w-20 h-20 object-contain rounded-lg' />
                                <button type='button' onClick={() => handleRemoveImage(index)} className='text-red-700 uppercase rounded-lg hover:opacity-90'>Delete</button>
                            </div>
                        ))
                    }
                    <button disabled={loading || uploading} className='p-3 bg-slate-700 text-white rounded-lg hover:opacity-90 disabled:opacity-80 uppercase'>{loading ? "Updating ..." : "Update Listing"}</button>
                    {error && <p className='text-red-700 text-sm'>{error}</p>}
                </div>
            </form>
        </div>
    )
}

export default UpdateListing