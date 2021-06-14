import { useEffect, useState } from "react";

// styles
import '../styles/global.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// toaster
import { Toaster } from "react-hot-toast";

// firebase auth
import { auth } from "../utils/firebase";

// SignIn modal
import { SignInModal } from '../components';


export default function App({ Component, pageProps }) {
  // handling auth user
  const [user, setUser] = useState([]);
  const [open, setOpen] = useState(false);

  const props = {
    open,
    setOpen,
    user,
    setUser
  };

  // handling auth and storing user if found
  auth().onAuthStateChanged((user) => {
    if (user) {
      setUser(user);
    }
  });

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Component {...pageProps} {...props} />
      <SignInModal open={open} setOpen={setOpen} />
    </>
  );
}
