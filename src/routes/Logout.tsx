import React, { useContext } from 'react'
import axios from 'src/axiosAuth'
import { Navigate } from 'react-router-dom'
import { AuthContext } from 'src/Context'
import { Stack } from 'react-bootstrap'

export const Logout: React.FC = () => {
  const {
    authenticated, setAuthenticated, playerPk, setPlayerPk,
  } = useContext(AuthContext)
  axios.get('http://localhost:8000/logout/').then((res) => {
    setAuthenticated(false)
    setPlayerPk(-1)
  })

  return (
    <Stack className="mx-auto">
      <main className="p-3 mx-auto text-center">
        Logging you out... Your browser should redirect you automatically.
        {!authenticated && (playerPk == -1 && (<Navigate replace to="/" />))}
      </main>
    </Stack>
  )
}
