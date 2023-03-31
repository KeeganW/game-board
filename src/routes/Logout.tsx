import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from 'src/Context'
import { CenteredPage } from 'src/utils/helpers'
import { useLogout } from 'src/utils/hooks'

export const Logout: React.FC = () => {
  const {
    authenticated, setAuthenticated, playerPk, setPlayerPk,
  } = useContext(AuthContext)

  const logoutResponse = useLogout()

  if (!logoutResponse.loading && logoutResponse.response.status === 200) {
    setAuthenticated(false)
    setPlayerPk(-1)
  }

  return (
    <CenteredPage>
      Logging you out... Your browser should redirect you automatically.
      {!authenticated && (playerPk == -1 && (<Navigate replace to="/" />))}
    </CenteredPage>
  )
}
