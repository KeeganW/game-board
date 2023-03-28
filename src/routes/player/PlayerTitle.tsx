import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { Navigate } from 'react-router-dom'
import {
  capitalizeString,
  Loading,
  useGetPlayer, useParamsPk,
} from 'src/helpers'

export const PlayerTitle: React.FC = () => {
  const paramsPk = useParamsPk()
  const player = useGetPlayer(parseInt(paramsPk))

  // Only show the page if things are still loading
  if (
    !player.response ||
    !player.response.data ||
    player.loading
  ) {
    return (
      <Loading/>
    )
  }
  // Catch weird instances where we need to log out
  if (player.response.status === 401) {
    return <Navigate replace to="/logout/"/>
  }

  const playerInfo = player.response.data

  return (
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
  )
}
