import React,{ useState,useContext,useEffect} from 'react'
import { auth } from '../../firebase';
import { GoogleAuthProvider } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";

const AuthContext= React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({children}) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(false);
  
    async function signInWithGoogle(){
      const provider = new GoogleAuthProvider();
      setLoading(true);
      await signInWithPopup(auth, provider)
        .then(async(result) => {
          if(result.user.email.split('@')[1] === 'vbithyd.ac.in'){
            setCurrentUser({
              uid:result.user.uid,
              email:result.user.email,
              profileURL:result.user.photoURL,
              username:result.user.displayName,
              phoneNumber:result.user.phoneNumber
            });
            setLoading(false);
          }
          else{
            console.log("Domain Mismatch");
            setLoading(true);
            try{
              await signOut();
            }
            catch(e){
              console.log("Signout Failed");
            }
            setLoading(false);

          }
         
        })
        .catch((error) => {
          setCurrentUser(null);
          setLoading(false);
        });
    };
    
    async function signOut() {
      setLoading(true);   
      try{
        await auth.signOut();  
        setCurrentUser(null);
        setLoading(false);      
      }
      catch(e){
        setLoading(false);
      }
    }
  
    useEffect(() => {
      auth.onAuthStateChanged(user => {
        setLoading(true);
        if(user!=null){
          setCurrentUser({
            uid:user.uid,
            email:user.email,
            profileURL:user.photoURL,
            username:user.displayName,
            phoneNumber:user.phoneNumber
          })
        }
        else{
          setCurrentUser(null)
        }       
        setLoading(false)
      });  
    }, [])
  
    const value = {
      currentUser,
      loading,  
      signInWithGoogle, 
      signOut
    }

    return (  
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>          
    )
}



// import React, { createContext, useReducer,useEffect } from "react";
// import {auth} from '../../firebase.js'

// export const AuthReducer = (state, action) => {
//   switch (action.type) {
//     case "PROCESSING":
//       return {
//         ...state,
//         isLoading: action.payload,
//       };
//     case "LOGIN":
//       return {
//         ...state,
//         user: action.payload,
//         isLoading:false
//       };
//     case "LOGOUT":
//       return {
//         ...state,
//         user: action.payload,
//         isLoading:false
//       };
//       default:
//         return {
//           ...state,
//           user: null,
//           isLoading:false
//         };
//   }
// };

// const initialState = {
//   user:null,
//   isLoading:false,
// };

// export const AuthContext = createContext();

// export const AuthProvider = (props) => {

//   useEffect(() => {
//     dispatch({
//       type: "PROCESSING",
//       payload:true,
//     });

//     const unsubscribe = auth.onAuthStateChanged(user => {
//       dispatch({
//         type: "LOGIN",
//         payload: user,
//       });
//     }) 
//     return unsubscribe
//   }, [])

//   const [state, dispatch] = useReducer(AuthReducer, initialState);

//   return (
//     <AuthContext.Provider value={{ user: state.user,isLoading:state.isLoading,dispatch }}>
//       {props.children}
//     </AuthContext.Provider>
//   );
// };
