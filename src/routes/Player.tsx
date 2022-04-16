import React, { useContext, useState } from 'react'
import { Stack } from 'react-bootstrap'
import axios from 'src/axiosAuth'
import { useParams } from 'react-router-dom'
import { AuthContext } from 'src/Context'

export const Player: React.FC = () => {
  // Get player info if provided
  const params = useParams()
  const { pk } = params
  const playerPk = pk || ''
  const { player } = useContext(AuthContext);
  console.log(player)

  // TODO on 401, redirect
  axios.get('http://localhost:8000/player/' + playerPk).then(res => console.log(res.data))

  return (
    <Stack className="mx-auto">
      <main className="p-3 mx-auto text-center">
        Player info {playerPk && 'for player ' + playerPk}
      </main>
    </Stack>
  )
}
