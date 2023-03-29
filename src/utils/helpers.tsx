import React, { useContext, useEffect, useState } from 'react'
import { ListGroup, ListGroupItem, Spinner, Stack } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { AuthContext } from 'src/Context'
import axios from 'src/axiosAuth'
import { PlayerInfo, PlayerObjectFull, PlayerStats } from 'src/types'
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import useAxios from '../useAxios'

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
  prefix?: string
  alternateDisplay?: (value: any) => any
}> = ({
  children,
  listObject,
  prefix,
  alternateDisplay,
}) => {
  const links = listObject?.map((value) => (
    <ListGroupItem as={Link} to={`${prefix || ''}${value.pk}`} key={value.pk}>{alternateDisplay ? alternateDisplay(value) : value.name}</ListGroupItem>
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

export function capitalizeString(word: string) {
  if (!word) return word;
  return word[0].toUpperCase() + word.slice(1).toLowerCase();
}

export function useParamsPk() {
  const params = useParams()
  const { pk } = params
  return pk || ''
}

export function ordinalSuffix(i: number) {
  var j = i % 10,
    k = i % 100;
  if (j == 1 && k != 11) {
    return i + "st";
  }
  if (j == 2 && k != 12) {
    return i + "nd";
  }
  if (j == 3 && k != 13) {
    return i + "rd";
  }
  return i + "th";
}
