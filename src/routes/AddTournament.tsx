import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useForm, Controller } from 'react-hook-form'
import axios from 'src/axiosAuth'
import { Navigate } from 'react-router-dom'
import { useUpdatePlayerInfo } from 'src/utils/hooks'
import { Typeahead } from 'react-bootstrap-typeahead'
import { AddTournamentInfo } from 'src/types'
import { CenteredPage } from 'src/utils/helpers'

export const AddTournament: React.FC = () => {
  useUpdatePlayerInfo()
  const { register, handleSubmit, control } = useForm()
  const [addTournamentData, setAddTournamentData] = useState<AddTournamentInfo | undefined>(
    undefined,
  )
  const [tournamentAdded, setTournamentAdded] = useState<number>(-1)

  useEffect(() => {
    axios.get('http://localhost:8000/add_tournament_info/').then((res) => {
      setAddTournamentData(res.data as AddTournamentInfo)
    })
  }, [])

  const handleOnSubmit = (data: any) => {
    // TODO: validate data, turn into a hook
    // Get our objects
    axios
      .get('http://localhost:8000/set-csrf/')
      .then(() => {
        axios
          .post('http://localhost:8000/add_tournament/', data, {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          })
          .then((res) => {
            // Player was logged in, we should have credentials, so redirect
            setTournamentAdded(res.data.pk)
          })
          .catch(() => {
            // TODO handle incorrect credentials
          })
      })
      .catch(() => {
        // TODO handle error of unable to get csrf token
      })
  }

  return (
    <CenteredPage pageWidth={300}>
      <h3>Add Tournament</h3>
      <Form onSubmit={handleSubmit(handleOnSubmit)}>
        <Form.Group className="mb-3" controlId="tournamentName">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" {...register('tournamentName', { required: true })} />
          <Form.Text className="text-muted" />
        </Form.Group>
        <Controller
          control={control}
          name="teams"
          rules={{
            required: 'Please, select at least two Teams to include in this tournament',
          }}
          render={({ field, fieldState }) => (
            <div className="mb-3">
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="team" className="form-label">
                Teams
              </label>
              <Typeahead
                {...field}
                id="team"
                multiple
                clearButton
                className={fieldState.invalid ? 'is-invalid' : ''}
                aria-describedby="teamsError"
                options={
                  addTournamentData ? addTournamentData.teams.map((value) => value.name) : []
                }
              />
              <p id="teamsError" className="invalid-feedback">
                {fieldState.error?.message}
              </p>
            </div>
          )}
        />
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      {/* If login button stops working randomly, it probably has to do with this statement */}
      {tournamentAdded
        && tournamentAdded >= 0
        && (tournamentAdded >= 0 ? (
          <Navigate replace to={`/tournament/${tournamentAdded}`} />
        ) : (
          <Navigate replace to="/tournament/" />
        ))}
    </CenteredPage>
  )
}
