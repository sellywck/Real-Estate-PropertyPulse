import { useContext, useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { AuthContext } from "../components/userAuthentication/AuthProvider";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { auth, storage } from "../firebase";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../features/users/profileSlice";
import { useNavigate } from "react-router-dom";
import CreateListing from "../components/listing/CreateListing";
// import Listings from "../components/listing/Listings";
import ListingForDeleteUpdate from "../components/listing/ListingForDeleteUpdate";
import { PiSignOutBold } from "react-icons/pi";
import { BiEdit } from "react-icons/bi";
import { FaRegSave } from "react-icons/fa";

export default function Profile() {
  //CreateListing Modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showUploadText, setShowUploadText] = useState(false);
  const [isEditMode, setisEditMode] = useState(false);

  const { identity, handleIdentitySignOut } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [uploadPerc, setUploadPerc] = useState(0);
  const [uploadError, setUploadError] = useState(false);
  const fileRef = useRef(null);

  // refresh page -> render profile page -> profile page rendering done -> api response returned -> trigger profile page re-rendering

  const profileState = useSelector((state) => state.profile.profile);
  const profileLoadingState = useSelector((state) => state.profile.loading);

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [profilepicture, setProfilepicture] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const id = identity.id;

  useEffect(() => {
    setLoading(profileLoadingState);
    if (profileState) {
      setUsername(profileState.username);
      setProfilepicture(profileState.profilepicture);
    }
  }, [profileState, profileLoadingState]);

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const fileName = new Date().getTime() + file.name;
    const imageRef = ref(storage, `profileImages/${fileName}`);
    const uploadFile = uploadBytesResumable(imageRef, file);

    uploadFile.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadPerc(Math.round(progress));
      },
      (error) => {
        console.error("Error uploading file:", error);
        setUploadError(true);
      },
      // Upload completed successfully
      () => {
        getDownloadURL(uploadFile.snapshot.ref)
          .then((downloadURL) => setProfilepicture(downloadURL))
          .catch((error) => {
            console.error("Error getting download URL:", error);
            setUploadError(true);
          });
      }
    );
  };

  const userInfo = {
    username,
    profilepicture,
    id,
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    // setLoading(true)
    try {
      const response = await dispatch(updateUserProfile(userInfo));
      toast.success(response.payload.message, {
        autoClose: 2000,
        position: "top-center",
      });
      // setLoadingStatus(false)
      setUpdateSuccess(true);
    } catch (error) {
      console.error(error.message);
      toast.error(error.message, {
        autoClose: 2000,
        position: "top-center",
      });
    }
    // setLoading(false)
  };

  const handleSignOut = () => {
    auth.signOut();
    handleIdentitySignOut();
    localStorage.clear();
    console.log(localStorage.getItem("jwt_token"));
    navigate("/");
  };

  const toggleEditOrSaveMode = async () => {
    if (isEditMode) {
      await handleSubmit();
    }
    setisEditMode(!isEditMode);
  };

  if (loading) {
    return (
      <Spinner
        animation="grow"
        className="d-flex"
        style={{ position: "fixed", top: "50%", left: "50%" }}
        variant="danger"
      />
    );
  }

  return (
    <div className=" max-w-6xl mx-auto my-6  p-3 flex flex-col">
      <div className="text-center py-4">
        <h2 className="text-3xl font-semibold text-slate-600 ">My Profile</h2>
        <div
          className={`relative mx-auto rounded-full h-32 w-32 my-4 ${
            isEditMode ? "cursor-pointer" : ""
          }`}
          onMouseOver={() => isEditMode && setShowUploadText(true)}
          onMouseOut={() => isEditMode && setShowUploadText(false)}
          onClick={() => isEditMode && fileRef.current.click()}
        >
          <img
            src={profilepicture || "default_profile_placeholder.png"}
            alt="Profile"
            className="rounded-full h-full w-full object-cover"
          />
          {showUploadText && (
            <span className="absolute inset-0 flex items-center justify-center text-white text-md font-semibold bg-black bg-opacity-50 rounded-full">
              Upload Profile Pic
            </span>
          )}
        </div>
        {!updateSuccess && (
          <p className=" text-sm self-center">
            {uploadError ? (
              <span className="text-red-600">
                Error Image upload (Image size must be less than 2 mb)
              </span>
            ) : uploadPerc > 0 && uploadPerc < 100 ? (
              <span className="text-green-500">{`Uploading {uploadPerc}%`}</span>
            ) : uploadPerc === 100 ? (
              <span className="text-green-500">Successfully uploaded</span>
            ) : (
              ""
            )}
          </p>
        )}
      </div>
      <div className="text-center">
        <Row className="justify-content-center">
          <Col xs={12} md={6}>
            <Form onSubmit={handleSubmit}>
              <div className="d-flex justify-content-between mb-3">
                {isEditMode ? (
                  <Button
                    variant="success"
                    className="cursor-pointer"
                    onClick={toggleEditOrSaveMode}
                  >
                    Save Changes
                    <FaRegSave
                      style={{ fontSize: "1.25rem" }}
                      className="ml-2 pb-0.5 inline-block"
                    />
                  </Button>
                ) : (
                  <Button
                    variant="danger"
                    className="cursor-pointer"
                    onClick={toggleEditOrSaveMode}
                  >
                    Edit
                    <BiEdit
                      style={{ fontSize: "1.25rem" }}
                      className="ml-2 pb-0.5 inline-block"
                    />
                  </Button>
                )}

                {/* <Button variant="secondary" className="cursor-pointer" onClick={handleSignOut}>
                Sign out
                <PiSignOutBold style={{ fontSize: "1.25rem" }}
                    className="ml-2 pb-0.5 inline-block" />
                </Button> */}
              </div>
              <input
                onChange={handleFile}
                type="file"
                ref={fileRef}
                hidden
                accept="image/*"
              />
              <Form.Group controlId="formBasicUsername" className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Username"
                  value={username}
                  required
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={!isEditMode}
                />
              </Form.Group>
              <Form.Group controlId="formBasicEmail" className="mb-3">
                <Form.Control
                  type="email"
                  placeholder="Email"
                  value={identity.email}
                  disabled
                />
              </Form.Group>
            </Form>
            <div className="mt-2 text-center">
                <Button
                  variant="danger "
                  onClick={handleShow}
                  className="w-full"
                >
                  Sell or Rent your Property
                </Button>
                <CreateListing show={show} handleClose={handleClose} />
              </div>
          </Col>
        </Row>
        <div className="my-6">
          <h3 className="text-3xl font-semibold text-slate-600 text-center my-4">
            My Listings
          </h3>
          <div className="flex flex-wrap gap-4">
            <ListingForDeleteUpdate />
          </div>
        </div>
      </div>
    </div>
  );
}


