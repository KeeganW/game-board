import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useForm, Controller } from 'react-hook-form'
import axios from 'src/axiosAuth'
import { Navigate } from 'react-router-dom'
import { useUpdatePlayerInfo } from 'src/utils/hooks'
import { Typeahead } from 'react-bootstrap-typeahead'
import { AddTournamentInfo } from 'src/types'
import { CenteredPage } from 'src/utils/helpers'
import { getTokens } from 'src/utils/localStorageService'

export const AddTournament: React.FC = () => {
  useUpdatePlayerInfo()
  const authToken = getTokens()

  const { register, handleSubmit, control } = useForm()
  const [addTournamentData, setAddTournamentData] = useState<
    AddTournamentInfo | undefined
  >(undefined)
  const [tournamentAdded, setTournamentAdded] = useState<number>(-1)

  useEffect(() => {
    axios
      .get('/add_tournament_info/', {
        headers: {
          ...(authToken.access && {
            Authorization: `Bearer ${authToken.access}`,
          }),
        },
      })
      .then(res => {
        setAddTournamentData(res.data as AddTournamentInfo)
      })
  }, [])

  const handleOnSubmit = (data: any) => {
    // Get our objects
    axios
      .post('/add_tournament/', data, {})
      .then(res => {
        // Player was logged in, we should have credentials, so redirect
        setTournamentAdded(res.data.pk)
      })
      .catch(() => {
        // TODO handle incorrect credentials
      })
  }

  return (
    <CenteredPage pageWidth={300}>
      <h3>Add Tournament</h3>
      <Form onSubmit={handleSubmit(handleOnSubmit)}>
        <Form.Group className="mb-3" controlId="tournamentName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            {...register('tournamentName', { required: true })}
          />
          <Form.Text className="text-muted" />
        </Form.Group>
        <Controller
          control={control}
          name="teams"
          rules={{
            required:
              'Please, select at least two Teams to include in this tournament',
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
                  addTournamentData
                    ? addTournamentData.teams.map(value => value.name)
                    : []
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
      {tournamentAdded &&
        tournamentAdded >= 0 &&
        (tournamentAdded >= 0 ? (
          <Navigate replace to={`/tournament/${tournamentAdded}`} />
        ) : (
          <Navigate replace to="/tournament/" />
        ))}
    </CenteredPage>
  )
}
