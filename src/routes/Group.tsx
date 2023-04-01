import React from 'react'
import { Navigate } from 'react-router-dom'
import { useGetGroup, useGetPlayer, useUpdatePlayerInfo } from 'src/utils/hooks'
import {
  BasicList, capitalizeString, CenteredPage, Loading, useParamsPk,
} from 'src/utils/helpers'

export const Group: React.FC = () => {
  useUpdatePlayerInfo()
  const paramsPk = useParamsPk()
  const groupResponse = useGetGroup(paramsPk)
  const playerResponse = useGetPlayer()

  // Only show the page if things are still loading
  if (
    !groupResponse.response
    || !groupResponse.response.data
    || groupResponse.loading
    || !playerResponse.response
    || !playerResponse.response.data
    || playerResponse.loading
  ) {
    return (
      <CenteredPage>
        <Loading />
      </CenteredPage>
    )
  }
  // Catch weird instances where we need to log out
  if (groupResponse.response.status === 401) {
    return <Navigate replace to="/logout/" />
  }

  const group = groupResponse.response.data
  const players = playerResponse.response.data

  return (
    <CenteredPage>
      <h1>{group.name}</h1>
      <h4>Players</h4>
      <BasicList
        listObject={players}
        prefix="/player/"
        alternateDisplay={(player: any) => `${capitalizeString(player.firstName)} ${capitalizeString(player.lastName)} (${
          player.username
        })`}
      />
    </CenteredPage>
  )
}
