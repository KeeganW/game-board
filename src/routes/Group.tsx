import React, { useContext, useEffect, useState } from 'react'
import { Stack } from 'react-bootstrap'
import axios from 'src/axiosAuth'
import { Navigate, useParams } from 'react-router-dom'
import { AuthContext } from 'src/Context'
import { useGetGroup, useGetPlayer, useGetPlayerStats, useUpdatePlayerInfo } from 'src/utils/hooks'
import {
  BasicList,
  BasicResponse,
  capitalizeString,
  CenteredPage,
  Loading,
  useParamsPk
} from '../utils/helpers'

export const Group: React.FC = () => {
  useUpdatePlayerInfo()
  const paramsPk = useParamsPk()
  const groupResponse = useGetGroup(paramsPk)
  const playerResponse = useGetPlayer()

  // Only show the page if things are still loading
  if (
    !groupResponse.response ||
    !groupResponse.response.data ||
    groupResponse.loading ||
    !playerResponse.response ||
    !playerResponse.response.data ||
    playerResponse.loading
  ) {
    return (
      <CenteredPage>
        <Loading/>
      </CenteredPage>
    )
  }
  // Catch weird instances where we need to log out
  if (groupResponse.response.status === 401) {
    return <Navigate replace to="/logout/"/>
  }

  const group = groupResponse.response.data
  const players = playerResponse.response.data

  return (
    <BasicResponse>
      <h1>{group.name}</h1>
      <h4>Players</h4>
      <BasicList listObject={players} prefix={'/player/'} alternateDisplay={(player: any) => `${capitalizeString(player.firstName)} ${capitalizeString(player.lastName)} (${player.username})`} />
    </BasicResponse>
  )
}
