import React, { useContext } from 'react'
import { ListGroup, ListGroupItem, Spinner, Stack } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { AuthContext } from 'src/Context'
import axios from 'src/axiosAuth'
import { PlayerInfo } from 'src/types'

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
