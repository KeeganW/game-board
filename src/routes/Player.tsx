import React, { useContext, useEffect, useState } from 'react'
import { Stack } from 'react-bootstrap'
import axios from 'src/axiosAuth'
import { useParams } from 'react-router-dom'
import { AuthContext } from 'src/Context'
import { useUpdatePlayerInfo } from 'src/helpers'

export const Player: React.FC = () => {
  useUpdatePlayerInfo()
  const { playerPk } = useContext(AuthContext)
  const [extraInfo, setExtraInfo] = useState(undefined)

  // Get player info if provided
  const params = useParams()
  const { pk } = params
  const paramsPk = pk || ''
  useEffect(() => {
    // TODO on 401, redirect
    axios.get(`http://localhost:8000/player/${paramsPk}`).then((res) => {
      setExtraInfo(res.data)
      console.log(res.data)
    })
  }, [paramsPk])

  return (
    <Stack className="mx-auto">
      <main className="p-3 mx-auto text-center">
        {playerPk && paramsPk && extraInfo ? `Player name: ${extraInfo['username']}` : 'Player info is limited to logged in users.'}
      </main>
    </Stack>
  )
}
