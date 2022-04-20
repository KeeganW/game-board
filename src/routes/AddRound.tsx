import React, { useContext, useEffect, useState } from 'react'
import { Button, Col, Form, Row, Stack } from 'react-bootstrap'
import { useForm, Controller, ControllerRenderProps, ControllerFieldState } from 'react-hook-form'
import axios from 'src/axiosAuth'
import { Navigate } from 'react-router-dom'
import { AuthContext } from 'src/Context'
import { useUpdatePlayerInfo } from 'src/helpers'
import { Typeahead } from 'react-bootstrap-typeahead'
import { AddRoundInfo } from '../types'

function NewType(props: { field: any, fieldState: ControllerFieldState }) {
  const {field, fieldState} = props
  console.log(field)
  console.log(fieldState)
  return null
}

export const AddRound: React.FC = () => {
  useUpdatePlayerInfo()
  const { register, handleSubmit, control, formState: { errors } } = useForm()
  const [addRoundData, setAddRoundData] = useState<AddRoundInfo | undefined>(undefined)
  const [roundAdded, setRoundAdded] = useState<number>(-1)

  useEffect(() => {
    axios.get(`http://localhost:8000/add_round_info/`).then((res) => {
      console.log(res.data as AddRoundInfo)
      setAddRoundData(res.data as AddRoundInfo)
    })
  }, [])

  // Good resource
  // https://medium.com/swlh/django-rest-framework-and-spa-session-authentication-with-docker-and-nginx-aa64871f29cd
  const handleOnSubmit = (data: any) => {
    // TODO: validate data
    // Get our objects
    axios.get('http://localhost:8000/set-csrf/').then((res) => {
      axios.post('http://localhost:8000/add_round/', data, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }).then((res) => {
        // Player was logged in, we should have credentials, so redirect
        setRoundAdded(res.data['pk'])
      }).catch((res) => {
        // TODO handle incorrect credentials
      })
    }).catch((res) => {
      // TODO handle error of unable to get csrf token
    })
  }

  return (
    <Stack className="mx-auto">
      <main className="p-3 mx-auto text-center" style={{ width: '300px' }}>
        <Form onSubmit={handleSubmit(handleOnSubmit)}>
          {/* https://github.com/react-hook-form/react-hook-form/discussions/2624 */}
          <Controller
            control={control}
            name="game"
            rules={{
              required: "Please, select at least one Game input value"
            }}
            render={({ field, fieldState }) => (
              <div className="mb-3">
                <label htmlFor="game" className="form-label">
                  Game
                </label>
                <Typeahead
                  {...field}
                  id="game"
                  // multiple
                  clearButton
                  className={fieldState.invalid ? "is-invalid" : ""}
                  aria-describedby="gameError"
                  options={addRoundData ? addRoundData.games.map(value => value.name) : []}
                />
                <p id="gameError" className="invalid-feedback">
                  {fieldState.error?.message}
                </p>
              </div>
            )}
          />
          <Form.Group className="mb-3" controlId="playedOn">
            <Form.Label>Date</Form.Label>
            <Form.Control type="date" {...register('playedOn', { required: true })} />
            <Form.Text className="text-muted" />
          </Form.Group>
          <Controller
            control={control}
            name="players"
            rules={{
              required: "Please, select at least one Players input value"
            }}
            render={({ field, fieldState }) => (
              <div className="mb-3">
                <label htmlFor="game" className="form-label">
                  Players
                </label>
                <Typeahead
                  {...field}
                  id="game"
                  multiple
                  clearButton
                  className={fieldState.invalid ? "is-invalid" : ""}
                  aria-describedby="gameError"
                  options={addRoundData ? addRoundData.group.players.map(value => value.username) : []}
                />
                <p id="gameError" className="invalid-feedback">
                  {fieldState.error?.message}
                </p>

                <Form.Group className="mb-3" controlId="scoresRanks">
                  {field.value?.map((value: any) => {
                    return (
                      <Form.Group as={Row} className="mb-3" controlId={"scoresRanks" + value}>
                        <Form.Label column sm="8">
                          {`${value}'s Rank`}
                        </Form.Label>
                        <Col sm="4">
                          <Form.Control type="text" {...register('rank-' + value)} />
                        </Col>

                        <Form.Label column sm="8">
                          {`${value}'s Score`}
                        </Form.Label>
                        <Col sm="4">
                          <Form.Control type="text" {...register('score-' + value)} />
                        </Col>
                      </Form.Group>
                    )
                  })}
                  <Form.Text className="text-muted" />
                </Form.Group>
              </div>
            )}
          />
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
        {/* If login button stops working randomly, it probably has to do with this statement */}
        {roundAdded && (roundAdded >= 0 && (roundAdded >= 0 ? <Navigate replace to={`/round/${roundAdded}`} /> : <Navigate replace to="/round/" />))}
      </main>
    </Stack>
  )
}
