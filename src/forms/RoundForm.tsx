import React from 'react'
import { Controller, UseFormRegister } from 'react-hook-form'
import { Typeahead } from 'react-bootstrap-typeahead'
import { Col, Form, Row } from 'react-bootstrap'
import { Control } from 'react-hook-form/dist/types'
import moment from 'moment'
import { GameObject, PlayerObjectLite } from 'src/types'

export const RoundForm: React.FC<{
  control: Control<any>
  register: UseFormRegister<any>
  gameOptions: any
  playerOptions: any
}> = ({
  control, register, gameOptions, playerOptions,
}) => (
  <>
    <Controller
      control={control}
      name="game"
      rules={{
        required: 'Please, select at least one Game input value',
      }}
      render={({ field, fieldState }) => (
        <div className="mb-3">
          <label htmlFor="game" className="form-label">
            Game
          </label>
          <Typeahead
            {...field}
            id="game"
            clearButton
            className={fieldState.invalid ? 'is-invalid' : ''}
            aria-describedby="gameError"
            options={gameOptions?.map((value: GameObject) => value.name) || []}
          />
          <p id="gameError" className="invalid-feedback">
            {fieldState.error?.message}
          </p>
        </div>
      )}
    />
    <Form.Group className="mb-3" controlId="playedOn">
      <Form.Label>Date</Form.Label>
      <Form.Control
        type="date"
        {...register('playedOn', { required: true, value: moment().format('YYYY-MM-DD') })}
      />
      <Form.Text className="text-muted" />
    </Form.Group>
    <Controller
      control={control}
      name="players"
      rules={{
        required: 'Please, select at least one Players input value',
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
            className={fieldState.invalid ? 'is-invalid' : ''}
            aria-describedby="playerError"
            options={playerOptions?.map((value: PlayerObjectLite) => value.username) || []}
          />
          <p id="playerError" className="invalid-feedback">
            {fieldState.error?.message}
          </p>

          <Form.Group className="mb-3" controlId="scoresRanks">
            {field.value?.map((value: any) => (
              <Form.Group as={Row} className="mb-3" controlId={`scoresRanks${value}`}>
                <Form.Label column sm="8">
                  {`${value}'s Rank`}
                </Form.Label>
                <Col sm="4">
                  <Form.Control type="text" {...register(`rank-${value}`)} />
                </Col>

                <Form.Label column sm="8">
                  {`${value}'s Score`}
                </Form.Label>
                <Col sm="4">
                  <Form.Control type="text" {...register(`score-${value}`)} />
                </Col>
              </Form.Group>
            ))}
            <Form.Text className="text-muted" />
          </Form.Group>
        </div>
      )}
    />
  </>
)
