import React, { useEffect, useState } from 'react'
import { Stack } from 'react-bootstrap'

const useFetch = (url: string, options: RequestInit) => {
  const [data, setData] = useState(null)

  // empty array as second argument equivalent to componentDidMount
  useEffect(() => {
    async function fetchData() {
      const response = await fetch(url, options)
      const json = await response.json()
      setData(json)
    }
    fetchData()
  }, [])

  return data
}

const createFetchObjects = (body: any) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  const requestInfo: RequestInit = {
    headers: headers,
    body: JSON.stringify(body),
    method: "GET",
  }
  return requestInfo
}

export const Player: React.FC = () => {
  const [player, setPlayer] = useState(useFetch('http://localhost:8000/player/', createFetchObjects({})))

  return (
    <Stack className="mx-auto">
      <main className="p-3 mx-auto text-center">
        {player}
      </main>
    </Stack>
  )
}
