import React, { useEffect, useState } from 'react'
import { Button, Form, Stack } from 'react-bootstrap'
import { useForm, Controller } from 'react-hook-form'
import axios from 'src/axiosAuth'
import { Navigate, useParams } from 'react-router-dom'
import { useUpdatePlayerInfo } from 'src/utils/hooks'
import { Typeahead } from 'react-bootstrap-typeahead'
import { RoundObject } from 'src/types'


export const AddMatch: React.FC = () => {
  useUpdatePlayerInfo()
  const { register, handleSubmit, control, formState: { errors } } = useForm()
  const [addRoundData, setAddRoundData] = useState<RoundObject[] | undefined>(undefined)
  const [matchAdded, setMatchAdded] = useState<number>(-1)

  // Get player info if provided
  const params = useParams()
  const { tournamentPk, match } = params
  const paramsPk = tournamentPk || ''
  const matchNumber = match || ''

  useEffect(() => {
    axios.get(`http://localhost:8000/round/`).then((res) => {
      setAddRoundData(res.data as RoundObject[])
    })
  }, [paramsPk, matchNumber])

  // Good resource
  // https://medium.com/swlh/django-rest-framework-and-spa-session-authentication-with-docker-and-nginx-aa64871f29cd
  const handleOnSubmit = (data: any) => {
    // TODO: validate data
    // Get our objects
    axios.get('http://localhost:8000/set-csrf/').then((res) => {
      axios.post('http://localhost:8000/add_match/', data, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }).then((res) => {
        setMatchAdded(res.data.pk)
      }).catch((res) => {
        // TODO handle incorrect credentials
      })
    }).catch((res) => {
      // TODO handle error of unable to get csrf token
    })
  }

  if (!paramsPk) {
    return (
      <div>
        Please find this page through your associated tournament.
      </div>
    )
  }
  return (
    <Stack className="mx-auto">
      <main className="p-3 mx-auto text-center" style={{ width: '300px' }}>
        <Form onSubmit={handleSubmit(handleOnSubmit)}>
          <Form.Group className="mb-3" controlId="match">
            <Form.Label>Match</Form.Label>
            <Form.Control type="text" {...register('match', { required: true, value: match })} />
            <Form.Text className="text-muted" />
          </Form.Group>

          <Form.Control type="hidden" {...register('tournament', { required: true, value: tournamentPk })} />

          <Controller
            control={control}
            name="round"
            rules={{
              required: "Please, select at least one Round input value"
            }}
            render={({ field, fieldState }) => (
              <div className="mb-3">
                <label htmlFor="round" className="form-label">
                  Round
                </label>
                <Typeahead
                  {...field}
                  id="round"
                  // multiple
                  clearButton
                  className={fieldState.invalid ? "is-invalid" : ""}
                  aria-describedby="gameError"
                  options={addRoundData ? addRoundData.map(value => String(value.pk)) : []}
                />
                <p id="gameError" className="invalid-feedback">
                  {fieldState.error?.message}
                </p>
              </div>
            )}
          />

          {/* <RoundForm control={control} register={register} inputOptions={addRoundData} /> */}

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
        {/* If login button stops working randomly, it probably has to do with this statement */}
        {matchAdded && (matchAdded >= 0 && (matchAdded >= 0 ? <Navigate replace to={`/tournament/${matchAdded}`} /> : <Navigate replace to="/tournament/" />))}
      </main>
    </Stack>
  )
}
