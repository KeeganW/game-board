import React from 'react'
import { capitalizeString } from 'src/utils/helpers'
import { PlayerObjectFull } from 'src/types'

export const PlayerTitle: React.FC<{
  playerInfo: PlayerObjectFull
}> = ({ playerInfo }) => (
  <>
    <h1>
      {`${capitalizeString(playerInfo.firstName)} ${capitalizeString(
        playerInfo.lastName
      )}`}
    </h1>
    <h6>{`@${playerInfo.username}`}</h6>
  </>
)
