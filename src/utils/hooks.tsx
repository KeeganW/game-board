import React, { useContext } from 'react'
import { AuthContext } from 'src/Context'
import axios from 'src/axiosAuth'
import {
  FetchResponse, GameObject, GroupObject, GroupObjectLite,
  PlayerInfo,
  PlayerObjectFull, PlayerRankObject,
  PlayerStats, RoundObject,
  TournamentObject, TournamentStats
} from 'src/types'
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

export function useLogout() {
  const url = `/logout/`
  return useGetResponse<any>(url)
}

/**
 * A generic get hook which calls useAxios, and then formats the response to be a specific type.
 *
 * @param url The url to call with the get hook.
 */
function useGetResponse<Type>(url: string): FetchResponse {
  const hookResponse =  useAxios({
    method: "GET",
    url: url,
  })
  // Specifically set the data type to be Type
  return {
    ...hookResponse,
    response: hookResponse.response ? {
      ...hookResponse.response,
      data: hookResponse.response.data
        ? hookResponse.response.data as Type
        : hookResponse.response.data,
    } : hookResponse.response,
  }
}

export function useGetGroup(groupPk?: string | number): FetchResponse {
  const url = `/group/${groupPk || ''}`
  return useGetResponse<GroupObjectLite>(url)
}

export function useGetPlayer(playerPk?: string | number): FetchResponse {
  const url = `/player/${playerPk || ''}`
  return useGetResponse<PlayerObjectFull>(url)
}

export function useGetGame(gamePk?: string | number): FetchResponse {
  const url = `/game/${gamePk || ''}`
  return useGetResponse<GameObject>(url)
}

export function useGetPlayerRank(playerRankPk?: string | number): FetchResponse {
  const url = `/player_rank/${playerRankPk || ''}`
  return useGetResponse<PlayerRankObject>(url)
}

export function useGetRound(roundPk?: string | number): FetchResponse {
  const url = `/round/${roundPk || ''}`
  return useGetResponse<RoundObject>(url)
}

export function useGetTournament(tournamentPk?: string | number): FetchResponse {
  const url = `/tournament/${tournamentPk || ''}`
  return useGetResponse<TournamentObject>(url)
}

export function useGetPlayerStats(playerPk: string | number): FetchResponse {
  const url = `/player_stats/${playerPk}`
  return useGetResponse<PlayerStats>(url)
}

export function useGetTournamentStats(tournamentPk: string | number): FetchResponse {
  const url = `/tournament_stats/${tournamentPk}`
  return useGetResponse<TournamentStats>(url)
}

export function useGetTournamentInfo(tournamentPk: string | number): FetchResponse {
  const url = `/tournament_info/${tournamentPk}`
  return useGetResponse<TournamentObject>(url)
}
