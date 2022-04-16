import React, { useContext } from 'react'
import { Stack } from 'react-bootstrap'
import { AuthContext } from 'src/Context'
import { Navigate } from 'react-router-dom'

export const Default: React.FC = () => {
  const { authenticated, player } = useContext(AuthContext);
  return (
    <Stack className="mx-auto">
      <main className="col-md-6 p-3 mx-auto text-center">
        <h4>
          Learn about some sea life!
        </h4>
      </main>
      {authenticated && (player >= 0 && (player >= 0 ? <Navigate replace to={"/player/" + player} /> : <Navigate replace to="/player/" />))}
    </Stack>
  )
}
