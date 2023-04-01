import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { capitalizeString } from 'src/utils/helpers'
import { PlayerObjectFull } from 'src/types'

export const PlayerTitle: React.FC<{
  playerInfo: PlayerObjectFull
}> = ({ playerInfo }) => (
  <Container>
    <Row>
      <h1>
        {`${capitalizeString(playerInfo.firstName)} ${capitalizeString(playerInfo.lastName)}`}
      </h1>
    </Row>
    <Row>
      <Col>
        <h6>{`@${playerInfo.username}`}</h6>
      </Col>
    </Row>
  </Container>
)
