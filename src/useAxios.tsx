import { useState, useEffect } from 'react'
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { FetchResponse } from './types'

/*
Code borrowed from...
https://blog.sreejit.dev/custom-axios-hook-useaxios-in-typescript-react
 */

const useAxios = (axiosParams: AxiosRequestConfig) => {
  const [request, setRequest] = useState<AxiosRequestConfig>()
  const [response, setResponse] = useState<AxiosResponse>()
  const [error, setError] = useState<AxiosError>()
  const [loading, setLoading] = useState(
    axiosParams.method === 'GET' || axiosParams.method === 'get'
  )

  const fetchData = async (params: AxiosRequestConfig) => {
    try {
      setRequest(params)
      const result = await axios.request(params)
      setResponse(result)
    } catch (err) {
      setError(err as any)
    } finally {
      setLoading(false)
    }
  }

  const sendData = () => {
    setLoading(true)
    fetchData(axiosParams)
  }

  useEffect(() => {
    if (axiosParams.method === 'GET' || axiosParams.method === 'get') {
      fetchData(axiosParams)
    }
  }, [])

  // Sometimes we update the hook, with a new set of params (in this case url), but a new request
  // isn't sent. In this case, we manually catch that and send a new data request.
  if (
    !loading &&
    request &&
    request.url &&
    axiosParams.url &&
    request.url !== axiosParams.url
  ) {
    setLoading(true)
    sendData()
  }

  return {
    response,
    error,
    loading,
    request,
    sendData,
  } as FetchResponse
}

export default useAxios
