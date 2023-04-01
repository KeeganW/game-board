import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { PlayerRankObject, PlayerStats, RoundObject } from 'src/types'
import { ordinalSuffix } from 'src/utils/helpers'

export const PlayerRecentGames: React.FC<{
  playerStatsInfo: PlayerStats
  playerPk: number
}> = ({ playerStatsInfo, playerPk }) => (
  <Container>
    <Row>
      <Col>
        <Row>
          <Col>
            <h4>Last 3 Games Played</h4>
          </Col>
        </Row>
        <Row>
          {playerStatsInfo.lastGamesPlayed.map((round: RoundObject) => (
            <Col key={`lastGamesPlayed${round.pk}`}>
              <Row>
                <Col>{round.game.name}</Col>
              </Row>
              <Row>
                <Col>
                  Placed:
                  {' '}
                  {ordinalSuffix(
                    round.playerRanks.filter(
                      (value: PlayerRankObject) => value.player.pk === playerPk,
                    )?.[0]?.rank,
                  )}
                </Col>
              </Row>
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  </Container>
)
