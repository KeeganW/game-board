import React from 'react'
import { ListGroup, ListGroupItem } from 'react-bootstrap'
import { Link } from 'react-router-dom'

/**
 * Generates a bootstrap formatted list.
 *
 * @param children Any children to insert after the list
 * @param listObject The list to format
 * @param prefix Any prefix to apply to the link for the list
 * @param alternateDisplay Any display override for the list that you want to do
 * @param reverse
 */
export const BasicList: React.FC<{
  children?: any
  listObject: any[] | undefined
  prefix?: string
  reverse?: boolean
  // eslint-disable-next-line no-unused-vars
  alternateDisplay?: (value: any) => any
}> = ({ children, listObject, prefix, alternateDisplay, reverse }) => {
  const links = listObject?.map(value => (
    <ListGroupItem as={Link} to={`${prefix || ''}${value.pk}`} key={value.pk}>
      {alternateDisplay ? alternateDisplay(value) : value.name}
    </ListGroupItem>
  ))
  return (
    <>
      <ListGroup variant="flush" className="align-items-center">
        {reverse ? links?.reverse() : links}
      </ListGroup>
      {children}
    </>
  )
}
