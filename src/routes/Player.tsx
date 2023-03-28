import React, { useContext } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { Navigate, useParams } from 'react-router-dom'
import { AuthContext } from 'src/Context'
import {
  capitalizeString,
  CenteredPage,
  Loading,
  useGetPlayer, useGetPlayerStats,
  useUpdatePlayerInfo
} from 'src/helpers'
import {
  PlayerRankObject,
  RoundObject
} from 'src/types'

export const Player: React.FC = () => {
  useUpdatePlayerInfo()
  const { playerPk } = useContext(AuthContext)

  // Get the pk set in the params
  const params = useParams()
  const { pk } = params
  const paramsPk = pk || ''

  const player = useGetPlayer(parseInt(paramsPk))
  const playerStats = useGetPlayerStats(parseInt(paramsPk))

  if (
    !player.response ||
    !player.response.data ||
    !playerStats.response ||
    !playerStats.response.data ||
    player.loading ||
    playerStats.loading
  ) {
    return (
      <CenteredPage>
        <Loading />
      </CenteredPage>
    )
  }

  // Catch weird instances where we need to log out
  if (player.response.status === 401) {
    return <Navigate replace to="/logout/" />
  }
  const playerInfo = player.response.data
  const playerStatsInfo = playerStats.response.data

  return (
    <CenteredPage>
      {/* Player info container */}
      <Container>
        <Row>
          <h1>
            {`${capitalizeString(playerInfo.firstName)} ${capitalizeString(playerInfo.lastName)}`}
          </h1>
        </Row>
        <Row>
          <Col>
            <h6>
              {`@${playerInfo.username}`}
            </h6>
          </Col>
        </Row>
      </Container>

      <br />

      {/* Simple Player Stats */}
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

      <br />

      {/* Simple Player Stats */}
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
                        {round.players.filter((value: PlayerRankObject) => value.player.pk === playerInfo.pk)?.[0]?.rank}
                      </Col>
                    </Row>
                  </Col>
                )
              })}
            </Row>
          </Col>
        </Row>
      </Container>

      {/* Charting Player Stats */}
      {/* <Container> */}
      {/*   <Row> */}
      {/*     <Col>{`Wins by Month Graph: TODO`}</Col> */}
      {/*   </Row> */}
      {/*   <Row> */}
      {/*     <Col>{`Win rate over time Graph: TODO`}</Col> */}
      {/*   </Row> */}
      {/*   <Row> */}
      {/*     <Col>{`Win rate in top played Graph: TODO`}</Col> */}
      {/*   </Row> */}
      {/* </Container> */}
    </CenteredPage>
  )
}
