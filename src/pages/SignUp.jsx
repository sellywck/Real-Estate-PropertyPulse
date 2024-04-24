import axios from "axios";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithPopup,
} from "firebase/auth";

import { useContext, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { AuthContext } from "../components/userAuthentication/AuthProvider";
import {useNavigate} from "react-router-dom"
const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate()
  const auth = getAuth();
  const { handleIdentityUpdate } = useContext(AuthContext);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      console.log({ res });

      if (res.user) {
        const { uid, email } = res.user;
        const response = await axios.post(`${BASE_URL}/v1/signup`, {
          uid,
          email,
          username
        });

        handleAPIAuthResEmailPassword(response);
      }
    } catch (error) {
      handleAuthError(error);
      setLoading(false);
    }
  };

  const GoogleProvider = new GoogleAuthProvider();
  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      const res = await signInWithPopup(auth, GoogleProvider);
      console.log({ res });
      if (res.user) {
        const { uid, email, displayName, photoURL} = res.user;
        console.log({displayName})
        console.log({photoURL})
        const response = await axios.post(`${BASE_URL}/v1/login/sso`, {
          uid,
          email,
          username: displayName, 
          profilepicture: photoURL
        });
        handleAPIAuthenticationResponse(response);
      }
    } catch (error) {
      handleAuthError(error);
      setLoading(false);
    }
  };

  const FacebookProvider = new FacebookAuthProvider();
  const handleFacebookSignIn = async (e) => {
    e.preventDefault();
    try {
      const res = await signInWithPopup(auth, FacebookProvider);
      console.log({ res });
      if (res.user) {
        const { uid, email, displayName, photoURL} = res.user;
        console.log({displayName})
        console.log({photoURL})
        const response = await axios.post(`${BASE_URL}/v1/login/sso`, {
          uid,
          email,
          username: displayName, 
          profilepicture: photoURL
        });
        handleAPIAuthenticationResponse(response);
      }
    } catch (error) {
      handleAuthError(error);
      setLoading(false);
    }
  };

  function handleAuthError(error) {
    console.error("Authentication error: ", error);

    switch (error.code) {
      case "auth/email-already-in-use":
        toast.error("Email already registered. Please proceed to login!", {
          autoClose: 3000,
          position: "top-center",
        });
        break;

      case "auth/weak-password":
        toast.error("Password is weak!!", {
          autoClose: 3000,
          position: "top-center",
        });
        break;

      case "auth/too-many-requests":
        toast.error(
          "Access to this account has been temporarily disabled due to many failed login attempts..",
          {
            autoClose: 3000,
            position: "top-center",
          }
        );
        break;
      case "auth/wrong-password":
        toast.error("Incorrect email or password.", {
          autoClose: 3000,
          position: "top-center",
        });
        break;

      case "auth/account-exists-with-different-credential":
        toast.error(
          "An account already exists with a different credential for this email address.",
          {
            autoClose: 3000,
            position: "top-center",
          }
        );
        break;
      case "auth/user-not-found":
        toast.error(
          "User not registered. Please proceed to sign up a new account.",
          {
            autoClose: 3000,
            position: "top-center",
          }
        );
        break;

      default:
        toast.error("An error occurred. Please try again later.", {
          autoClose: 3000,
          position: "top-center",
        });
        break;
    }
  }

  function handleAPIAuthResEmailPassword(response) {
    if (response.status >= 200 && response.status < 300) {
      toast.success(response.data.message, {
        autoClose: 2000,
        position: "top-center",
      });
      setLoading(false);
      navigate("/signin")
    } else {
      toast.error(response.data.message, {
        autoClose: 2000,
        position: "top-center",
      });
    }
  }
  
  function handleAPIAuthenticationResponse(response) {
    if (response.status >= 200 && response.status < 300) {
      const token = response.data.token;
      if (token) {
        localStorage.setItem("jwt_token", token);
        // console.log("set localStorage jwt_token")
        handleIdentityUpdate();
      }
      toast.success(response.data.message, {
        autoClose: 2000,
        position: "top-center",
      });
      setLoading(false);
      navigate('/')
    } else {
      toast.error(response.data.message, {
        autoClose: 2000,
        position: "top-center",
      });
    }
  }

  return (
    <>
      <div className="p-3 max-w-lg mx-auto">
      {/* <div className="max-w-6xl mx-auto p-3 flex flex-col"> */}

        {/* <h3 className="mb-4 text-center">
          Create an New Account <span></span>
        </h3> */}
        <h2 className="text-center text-3xl font-semibold text-slate-600 my-4 mb-4">
        Create an New Account
      </h2>
        <Form className="mt-4" onSubmit={handleSignUp}>
          <Form.Group controlId="formBasicUsername" className="mb-3">
            <Form.Control
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formBasicEmail" className="mb-3">
            <Form.Control
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button
            disabled={loading}
            className="mb-3"
            style={{ width: "100%", border: "none" }}
            variant="danger"
            type="submit"
          >
            {loading ? "Loading..." : "Sign up"}
          </Button>
          <br />
          <p
            className="mb-3"
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              fontSize: "15px",
              marginBottom: "0px",
            }}
          >
            or
          </p>
          <Button
            className="mb-3"
            variant="outline-secondary"
            style={{ width: "100%" }}
            onClick={handleGoogleSignIn}
          >
            {/* <img alt="Continue with Google" src={googleIcon} /> */}

            <span>Continue with Google</span>
          </Button>

          <Button
            className="mb-3"
            variant="outline-secondary"
            style={{ width: "100%" }}
            onClick={handleFacebookSignIn}
          >
            {/* <img alt="Continue with Facebook" src={facebookIcon} /> */}
            <span>Continue with Facebook</span>
          </Button>
        </Form>
        <p>
          {" "}
          Have an account? <a href="signin">Sign in</a>
        </p>
      </div>
    </>
  );
}
