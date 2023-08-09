import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from 'src/Context'
import { useLogout } from 'src/utils/hooks'
import { CenteredPage } from 'src/components/CenteredPage'

export const Logout: React.FC = () => {
  const {
    authenticated,
    setAuthenticated,
    setTokenAccess,
    setTokenRefresh,
    playerPk,
    setPlayerPk,
  } = useContext(AuthContext)

  const logoutResponse = useLogout()

  if (!logoutResponse.loading && logoutResponse.response.status === 200) {
    localStorage.setItem('tokenAccess', '')
    localStorage.setItem('tokenRefresh', '')
    localStorage.setItem('initialState', '')

    setAuthenticated(false)
    setPlayerPk(-1)
    setTokenAccess('')
    setTokenRefresh('')
  }

  return (
    <CenteredPage>
      Logging you out... Your browser should redirect you automatically.
      {!authenticated && playerPk === -1 && <Navigate replace to="/" />}
    </CenteredPage>
  )
}
