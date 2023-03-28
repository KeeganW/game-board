import React from 'react'
import {
  CenteredPage,
  useUpdatePlayerInfo
} from 'src/helpers'
import { PlayerTitle } from 'src/routes/player/PlayerTitle'
import { PlayerQuickLook } from 'src/routes/player/PlayerQuickLook'
import { PlayerRecentGames } from 'src/routes/player/PlayerRecentGames'

export const Player: React.FC = () => {
  useUpdatePlayerInfo()

  return (
    <CenteredPage>
      <PlayerTitle />
      <br />
      <PlayerQuickLook />
      <br />
      <PlayerRecentGames />

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
