import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import { Link } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { storeInSession } from "../common/session";
import { useSession } from "../context/User.context";
import React from "react";
import { Navigate } from "react-router-dom";
import { authWithGoogle } from "../common/firebase";
const UserAuthForm = ({ type }) => {
  const data = useSession();
  const { userAuth, setUserAuth } = data;
  // console.log(userAuth.accessToken);
  const { accessToken } = userAuth;

  const UserAuthThroughServer = (serverRoute, formData) => {
    axios
      .post(import.meta.env.VITE_SERVER_URL + serverRoute, formData)
      .then(({ data }) => {
        // Corrected to destructure data
        storeInSession("User", JSON.stringify(data));
        // console.log(sessionStorage);
        // console.log(data);
        setUserAuth(data);
      })
      .catch(({ response }) => {
        toast.error(response.data.error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const serverRoute = type == "sign-in" ? "/signin" : "/signup";

    //retrieve the data from
    const form = new FormData(formElement);
    const formData = {};
    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }
    // console.log(formData);

    //form validation
    const { fullname, email, password } = formData;

    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

    if (fullname) {
      if (fullname.length < 3) {
        return toast.error("fullname must be 3 letter long");
      }
    }

    if (!email.length) {
      return toast.error("email is required");
    }

    // toast.error(email);

    if (!emailRegex.test(email)) {
      return toast.error("invalid email");
    }

    if (!passwordRegex.test(password)) {
      return toast.error(
        "password should be 6-20 characters with a numeric, lowercase and uppercase letter"
      );
    }

    UserAuthThroughServer(serverRoute, formData);
  };

  const handleGoogleAuth = async (e) => {
    e.preventDefault();
    await authWithGoogle()
      .then((user) => {
        // console.log(user);
        const serverRoute = "/google-auth";
        const formData = {
          accessToken: user.accessToken,
        };

        UserAuthThroughServer(serverRoute, formData);
      })
      .catch((error) => {
        toast.error("trouble login in with google");
        return console.log(error);
      });
  };

  return accessToken ? (
    <Navigate to="/" />
  ) : (
    <AnimationWrapper keyvalue={type}>
      <section className="h-cover flex items-center justify-center">
        <Toaster />
        <form id="formElement" className="w-[80%] max-w-[400px]">
          <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
            {type == "sign-in" ? "Welcome back" : "Join us Today"}
          </h1>

          {type != "sign-in" ? (
            <InputBox
              name="fullname"
              type="text"
              placeholder="Full Name"
              icon="fi-rr-user"
            />
          ) : (
            ""
          )}
          <InputBox
            name="email"
            type="email"
            placeholder="Email"
            icon="fi-rr-envelope"
          />

          <InputBox
            name="password"
            type="password"
            placeholder="Password"
            icon="fi-rr-key"
          />

          <button
            className="btn-dark center mt-14"
            type="submit"
            onClick={handleSubmit}
          >
            {type}
          </button>

          <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
            <hr className="w-1/2 border-black" />
            <p>or</p>
            <hr className="w-1/2 border-black" />
          </div>

          <button
            className="btn-dark flex items-center justify-center gap-4 w-[90%] center"
            onClick={handleGoogleAuth}
          >
            <img src={googleIcon} className="w-5" />
            continue with google
          </button>

          {type == "sign-in" ? (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Don't have an account ?
              <Link to="/signup" className="underline text-black text-xl ml-1">
                join us today
              </Link>
            </p>
          ) : (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Already have an account ?
              <Link to="/signin" className="underline text-black text-xl ml-1">
                sign in here
              </Link>
            </p>
          )}
        </form>
      </section>
    </AnimationWrapper>
  );
};
export default UserAuthForm;
