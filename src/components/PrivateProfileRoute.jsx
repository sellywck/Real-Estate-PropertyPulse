import { useContext } from 'react'
import { AuthContext } from './userAuthentication/AuthProvider';
import {Outlet, Navigate } from "react-router-dom";


export default function PrivateProfileRoute() {
  const { identity } = useContext(AuthContext);

  return (
    identity ? <Outlet/> : <Navigate to="/signin"/> 
  )
}
