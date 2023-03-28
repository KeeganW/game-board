import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { Navigate } from 'react-router-dom'
import {
  Loading,
  useGetPlayerStats,
  useParamsPk,
} from 'src/helpers'
import { PlayerRankObject, RoundObject } from 'src/types'

export const PlayerRecentGames: React.FC = () => {
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
            <Col>
              <h4>Last 3 Games Played</h4>
            </Col>
          </Row>
          <Row>
            {playerStatsInfo.lastGamesPlayed.map((round: RoundObject) => {
              return (
                <Col key={`lastGamesPlayed${round.pk}`}>
                  <Row>
                    <Col>
                      {round.game.name}
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      {round.players.filter((value: PlayerRankObject) => value.player.pk === playerStatsInfo.playerPk)?.[0]?.rank}
                    </Col>
                  </Row>
                </Col>
              )
            })}
          </Row>
        </Col>
      </Row>
    </Container>
  )
}
