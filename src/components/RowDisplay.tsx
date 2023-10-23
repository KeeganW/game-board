import React from 'react'
import { Grid } from '@mantine/core'

export const RowDisplay: React.FC<{
  rank: any
  player: any
  score: any
  greyHighlight?: boolean
  colorHighlight?: boolean
}> = ({ rank, player, score, greyHighlight, colorHighlight }) => {
  let highlight = {}
  if (colorHighlight) {
    highlight = { backgroundColor: '#bdedff' }
  } else if (greyHighlight) {
    highlight = { backgroundColor: '#e2e2e2' }
  }
  return (
    <Grid px="sm" style={highlight}>
      {rank ? <Grid.Col span={1}>{rank}</Grid.Col> : undefined}

      {player ? (
        <Grid.Col
          span="auto"
          style={{
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {player}
        </Grid.Col>
      ) : undefined}

      {score ? <Grid.Col span="content">{score}</Grid.Col> : undefined}
    </Grid>
  )
}
