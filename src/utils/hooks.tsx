import React, { useContext } from 'react'
import { AuthContext } from 'src/Context'
import axios from 'src/axiosAuth'
import { PlayerInfo, PlayerObjectFull, PlayerStats } from 'src/types'
import useAxios from 'src/useAxios'

export function useUpdatePlayerInfo() {
  const {
    authenticated, setAuthenticated, setPlayerPk, setGroupPk, setGroupName, setGroupImageUrl,
  } = useContext(AuthContext)
  if (!authenticated) {
    axios.get('http://localhost:8000/player_info/').then((playerInfoRes) => {
      const playerInfoResObj = playerInfoRes.data as PlayerInfo
      setAuthenticated(true)
      setPlayerPk(playerInfoResObj.playerPk)
      setGroupPk(playerInfoResObj.groupPk)
      setGroupName(playerInfoResObj.groupName)
      setGroupImageUrl(playerInfoResObj.groupImageUrl)
    })
  }
}

export function useGetPlayer(playerPk: number) {
  const url = `/player/${playerPk}`
  const hookResponse =  useAxios({
    method: "GET",
    url: url,
  })
  // Specifically set the data type to be PlayerObjectFull
  return {
    ...hookResponse,
    response: hookResponse.response ? {
      ...hookResponse.response,
      data: hookResponse.response.data
        ? hookResponse.response.data as PlayerObjectFull
        : hookResponse.response.data,
    } : hookResponse.response,
  }
}

export function useGetPlayerStats(playerPk: number) {
  const response =  useAxios({
    method: "GET",
    url: `/player_stats/${playerPk}`,
  })
  // Specifically set the data type to be PlayerStats
  return {
    ...response,
    response: response.response ? {
      ...response.response,
      data: response.response.data
        ? response.response.data as PlayerStats
        : response.response.data,
    } : response.response,
  }
}
