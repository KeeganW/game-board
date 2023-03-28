import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { PlayerStats } from 'src/types'

export const PlayerQuickLook: React.FC<{
  playerStatsInfo: PlayerStats,
}> = ({
  playerStatsInfo,
}) => {

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
