import React from 'react'
import { Card } from 'react-bootstrap'

export const CardDisplay: React.FC<{
  children?: any
  title: any
  subtitle: any
  content: any
}> = ({ children, title, subtitle, content }) => {
  return (
    <Card className="mb-2" style={{ width: '300px', textAlign: 'left' }}>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{subtitle}</Card.Subtitle>
        <Card.Text>{content}</Card.Text>
        {children}
      </Card.Body>
    </Card>
  )
}
