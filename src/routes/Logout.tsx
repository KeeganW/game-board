import React, { useContext } from 'react'
import axios from 'src/axiosAuth'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../Context'

export const Logout: React.FC = () => {
  const { setAuthenticated, setPlayer } = useContext(AuthContext);
  axios.get('http://localhost:8000/logout/').then(res => {
    setAuthenticated(false)
    setPlayer(-1)
  })

  return (
    <Navigate replace to="/" />
  )
}
