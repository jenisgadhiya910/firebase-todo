import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth,db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";

const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  async function logIn(email, password) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async function signUp({email, password,first_name,last_name,role,avatar}) {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await addDoc(collection(db,'users'),{
        id: result?.user?.uid,
        first_name,
        last_name,
        role,
        avatar
      })
      return result;
    } catch (error) {
      throw error;
    }
  }
  async function logOut() {
    try {
      setLoading(true);
      const result = await signOut(auth);
      setLoading(false);
      return result;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }
  // async function googleSignIn() {
  //   try {
  //     setLoading(true);
  //     const googleAuthProvider = new GoogleAuthProvider();
  //     const result = await signInWithPopup(auth, googleAuthProvider);
  //     setLoading(false);
  //     return result;
  //   } catch (error) {
  //     setLoading(false);
  //     throw error;
  //   }
  // }

  useEffect(() => {
   setLoading(true)
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      setUser(currentuser);
      setLoading(false)
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <userAuthContext.Provider
      value={{ user, logIn, signUp, logOut, loading,setUser }}
    >
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}
