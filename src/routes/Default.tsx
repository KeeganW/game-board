import React, { useContext } from 'react'
import { Stack } from 'react-bootstrap'
import { AuthContext } from 'src/Context'
import { Navigate } from 'react-router-dom'
import { CenteredPage } from '../utils/helpers'

export const Default: React.FC = () => {
  const { authenticated, playerPk } = useContext(AuthContext)
  return (
    <CenteredPage>
      <h4>
        Welcome to the Game Board!
      </h4>
      <p>
        This application allows you to keep track of games played with friends. By entering all of
        the games you play, and their outcomes, we can generate a set of interesting stats and
        graphs for you. You can use this information to track things like your win-rates, most
        played games, or who your biggest rival is! You can also start a tournament within your
        group to battle it out to be crowned the best player! ... at least until the next tournament.
      </p>
      {/* Automatically go to the player's page if we are trying to reach this page. */}
      {authenticated && (playerPk >= 0 && (playerPk >= 0 ? <Navigate replace to={`/player/${playerPk}`} /> : <Navigate replace to="/player/" />))}
    </CenteredPage>
  )
}
