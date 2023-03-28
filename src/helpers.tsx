import React, { useContext, useEffect, useState } from 'react'
import { ListGroup, ListGroupItem, Spinner, Stack } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { AuthContext } from 'src/Context'
import axios from 'src/axiosAuth'
import { PlayerInfo, PlayerObjectFull, PlayerStats } from 'src/types'
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import useAxios from './useAxios'

export const BasicResponse: React.FC<{children: any}> = ({ children }) => (
  <Stack className="mx-auto">
    <main className="p-3 mx-auto text-center">
      {children}
    </main>
  </Stack>
)
export const Loading: React.FC = () => (
  <BasicResponse>
    <Spinner animation="border" variant="primary" />
  </BasicResponse>
)
export const BasicList: React.FC<{
  children?: any
  listObject: any[] | undefined
}> = ({
  children,
  listObject,
}) => {
  const links = listObject?.map((value) => (
    <ListGroupItem as={Link} to={`${value.pk}`} key={value}>{value.name}</ListGroupItem>
  ))
  return (
    <BasicResponse>
      <ListGroup variant="flush" className="align-items-center">
        {links}
      </ListGroup>
      {children}
    </BasicResponse>
  )
}
export const CenteredPage: React.FC<{
  children?: any
}> = ({
  children,
}) => {
  return (
    <Stack className="mx-auto">
      <main className="p-3 mx-auto text-center">
        {children}
      </main>
    </Stack>
  )
}

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

export function capitalizeString(word: string) {
  if (!word) return word;
  return word[0].toUpperCase() + word.slice(1).toLowerCase();
}

export function useParamsPk() {
  const params = useParams()
  const { pk } = params
  return pk || ''
}
