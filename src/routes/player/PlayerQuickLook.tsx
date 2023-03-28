import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { Navigate } from 'react-router-dom'
import {
  Loading,
  useGetPlayerStats,
  useParamsPk,
} from 'src/helpers'

export const PlayerQuickLook: React.FC = () => {
  const paramsPk = useParamsPk()
  const playerStats = useGetPlayerStats(parseInt(paramsPk))

  // Only show the page if things are still loading
  if (
    !playerStats.response ||
    !playerStats.response.data ||
    playerStats.loading
  ) {
    return (
      <Loading/>
    )
  }
  // Catch weird instances where we need to log out
  if (playerStats.response.status === 401) {
    return <Navigate replace to="/logout/"/>
  }

  const playerStatsInfo = playerStats.response.data

  return (
    <Container>
      <Row>
        <Col>
          <Row>
            <h5>
              Favorite Game
            </h5>
          </Row>
          <Row>
            <div>
              {playerStatsInfo.favoriteGame.name}
            </div>
          </Row>
        </Col>
        <Col>
          <Row>
            <h5>
              Number of Games Played
            </h5>
          </Row>
          <Row>
            <div>
              {playerStatsInfo.numberGamesPlayed}
            </div>
          </Row>
        </Col>
      </Row>
    </Container>
  )
}
