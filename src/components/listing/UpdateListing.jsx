import { useState } from "react";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {updateListing} from '../../features/listings/listingsSlice'
// import { useNavigate} from "react-router-dom"



export default function UpdateListing({ show, handleClose, OriginalFormData }) {

  const dispatch = useDispatch();
  // const navigate = useNavigate()

  const [files, setFiles] = useState([]);
  const [newformData, setNewFormData] = useState(
    {
    id: OriginalFormData.id, 
    imageurls:OriginalFormData.imageurls,
    name: OriginalFormData.name,
    description :OriginalFormData.description,
    address:OriginalFormData.address, 
    type: OriginalFormData.type, 
    regularprice :OriginalFormData.regularprice,
    discountedprice: OriginalFormData.discountedprice,
    bathrooms:OriginalFormData.bathrooms,
    bedrooms:OriginalFormData.bedrooms , 
    offer: OriginalFormData.offer, 
    parking: OriginalFormData.parking, 
    furnished: OriginalFormData.furnished, 
    phoneNumber: OriginalFormData.phonenumber,
    latitude: OriginalFormData.latitude,
    longitude: OriginalFormData.longitude,
  });
  const [fileUploadErr, setFileUploadErr] = useState(false);
  const [uploading, setUploading] = useState(false)
  const [loading, setloading] = useState(false)
  const [error, setError] = useState(false)

  // console.log(formData);

  const handleFilesSubmit = () => {
    if (files.length > 0 && files.length + newformData.imageurls.length < 7 ) {
      setUploading(true)
      setFileUploadErr(false)
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises).then((urls) => {
        setNewFormData({ 
          ...newformData, 
          imageurls: newformData.imageurls.concat(urls), 
        });
        setFileUploadErr(false)
        setUploading(false)
        
      })
      .catch((error) => {
        console.error(error)
        setFileUploadErr(`Image upload failed (Maximum image size is 2mb/image!)`);
        setUploading(false)
      })
    } else {
      setFileUploadErr(`You can only upload 6 images per listing!`)
      setUploading(false)
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const fileName = new Date().getTime() + file.name;
      const listingRef = ref(storage, `listingImages/${fileName}`);
      const uploadFiles = uploadBytesResumable(listingRef, file);
      uploadFiles.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadFiles.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const hanldeFileRemove = (index) => {
    setNewFormData({
    ... newformData, 
    imageurls: newformData.imageurls.filter((_, i) => i !== index)
    })
  }

  const handleChange = (e) => {
    if(e.target.id === 'sale' || e.target.id === "rent" ){
      setNewFormData({
        ...newformData, 
        type: e.target.id
      })
    }
    if(e.target.id === 'parking' || e.target.id === "furnished" || e.target.id === 'offer'){
      setNewFormData({
        ...newformData, 
        [e.target.id] : e.target.checked
      })
    }
    if(e.target.type ==="number" || e.target.type ==="text" || e.target.type ==="textarea"){
      setNewFormData({
        ...newformData, 
        [e.target.id] : e.target.value
      })
    }
  }

  const handleUpdateListingSubmit = async (e) => {
    e.preventDefault();
    try {
      if(newformData.imageurls.length < 1) return setError('You must upload at least one image.')
      if(newformData.regularprice < +newformData.discountedprice) return setError('Discounted price must be lower than regular price.')

      setloading(true);
      setError(false)
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${newformData.address}&key=AIzaSyBZ5-Tg6oX_1OTCTMdow0HMAE2sSx54uuw`
      );

      const data = await res.json();
      console.log("coordinate", data);
      if (data.status === "OK" && data.results[0]?.geometry.location) {
        const lat = data.results[0].geometry.location.lat;
        const lng = data.results[0].geometry.location.lng;

        let request = newformData;
        request.latitude = lat;
        request.longitude = lng;

        console.log({ request });
        const response = await dispatch(updateListing(request));
        console.log({response});
        setloading(false);
        handleClose();

        toast.success("Listing updated successfully", {
          autoClose: 2000,
          position: "top-center",
        });
    }
    } catch (error) {
      setError(error.message)
      setloading(false)
      toast.error(error.message, {
        autoClose: 2000, 
        position: "top-center",
      })
    } 
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      animation={false}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Update a Listing</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleUpdateListingSubmit}>
          <Form.Group className="mb-3">
            <Form.Control 
            type="text" 
            id="name"
            placeholder="Name" 
            required
            onChange={handleChange}
            value={newformData.name}
             />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              id="description"
              as="textarea"
              rows={3}
              placeholder="Description"
              required
              onChange={handleChange}
              value={newformData.description}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              id="address"
              as="textarea"
              rows={2}
              placeholder="Address"
              required
              onChange={handleChange}
              value={newformData.address}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="number"
              id="phoneNumber"
              placeholder="Phone Number"
              required
              onChange={handleChange}
              value={newformData.phoneNumber}
            />
          </Form.Group>
          <div className="flex gap-3 flex-wrap mb-3">
            <div className="flex gap-2">
              <input 
              type="checkbox" 
              id="sale" 
              className="w-5" 
              onChange={handleChange}
              checked={newformData.type === 'sale'}
              />{" "}
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input 
              type="checkbox" 
              id="rent" 
              className="w-5"
              onChange={handleChange}
              checked={newformData.type === 'rent'}
               />{" "}
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input 
              type="checkbox" 
              id="parking" 
              className="w-5"
              onChange={handleChange}
              checked={newformData.parking} 
              />{" "}
              <span>Car Park</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5"    onChange={handleChange}
              checked={newformData.furnished} />
              <span>Fully Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5"   onChange={handleChange}
              checked={newformData.offer} />{" "}
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                onChange={handleChange}
                value={newformData.bedrooms} 
                className="p-1 border text-center border-gray-300 rounded-lg"
              />
              <span>Beds 🛏️</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                onChange={handleChange}
                value={newformData.bathrooms} 
                className="p-1 border text-center border-gray-300 rounded-lg"
              />
              <span>Bathrooms🛁</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularprice"
                min="50"
                max="10000000"
                required
                onChange={handleChange}
                value={newformData.regularprice} 
                className="p-1 border text-center border-gray-300 rounded-lg"
              />
              <div>
                <span>Regular Price </span>
                <span>(RM / month)</span>
              </div>
            </div>
            {newformData.offer && (
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountedprice"
                min="0"
                max="10000000"
                required
                onChange={handleChange}
                value={newformData.discountedprice} 
                className="p-1 border text-center border-gray-300 rounded-lg"
              />
              <div>
                <span>Discounted Price </span>
                <span>(RM / month)</span>
              </div>
            </div>
            )}
          </div>
          <div className="flex flex-col flex-1 mt-3">
            <p className="font-semibold">
              Images:{" "}
              <span className="font-normal text-gray-800 ml-2">
                The first image will be the cover of the listing (max 6){" "}
              </span>
            </p>
            <div className="flex gap-1 ">
              <input
                onChange={(e) => setFiles(e.target.files)}
                className="p-2 border border-gray-300 rounded w-full  text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-gray-300 file:text-gray-500
                hover:file:bg-gray-200"
                type="file"
                id="images"
                accept="image/*"
                multiple
              />
              <button
                type="button"
                disabled={uploading}
                onClick={handleFilesSubmit}
                className="p-2 text-green-500 border border-green-700 rounded uppercase hover:shadow-lg:text-green-600 disabled:opacity-80"
              >
                {uploading ? 'Uploading' : 'Upload'}
              </button>
            </div>
              <p className="text-red-700 text-sm mt-2">{fileUploadErr && fileUploadErr} </p>
              {
                newformData.imageurls.length > 0 && newformData.imageurls.map((url, index) => (
                <div key={url} className="flex justify-between p-3 border items-center">
                     <img src={url} alt="listing image" className="w-20 h-20 object-conatain rounded-lg" />
                     <button type="button" onClick={()=> hanldeFileRemove(index)} className="p-3 text-red-700 rounded-lg hover:opacity-75">DELETE</button>
                </div>

                ))
              }
          </div>

          <Button disabled={loading || uploading } variant="danger" className="mt-3" type="submit">
           {loading ? 'Updating...' : "Update Listing"} 
          </Button>
          {error && <p className="text-red-700 text-sm mt-2">{error}</p>}
        </Form>
      </Modal.Body>
    </Modal>
  );
}
