import React from 'react'
import { ListGroup, ListGroupItem, Spinner, Stack } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'

/**
 * A centered page, to make all our pages look the same.
 *
 * @param pageWidth If we want to limit the width of the page, pass in the width here
 * @param children The rest of the page we want to display.
 */
export const CenteredPage: React.FC<{
  pageWidth?: number
  children?: any
}> = ({
  pageWidth,
  children,
}) => {
  return (
    <Stack className="mx-auto">
      <main className="p-3 mx-auto text-center" style={pageWidth ? { width: pageWidth + 'px' } : {}}>
        {children}
      </main>
    </Stack>
  )
}

/**
 * A bootstrap formatted loading spinner, which can be popped in wherever needed.
 */
export const Loading: React.FC = () => (
  <CenteredPage>
    <Spinner animation="border" variant="primary" />
  </CenteredPage>
)

/**
 * Generates a bootstrap formatted list.
 *
 * @param children Any children to insert after the list
 * @param listObject The list to format
 * @param prefix Any prefix to apply to the link for the list
 * @param alternateDisplay Any display override for the list that you want to do
 */
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
    <CenteredPage>
      <ListGroup variant="flush" className="align-items-center">
        {links}
      </ListGroup>
      {children}
    </CenteredPage>
  )
}

/**
 * Capitalizes any given string.
 *
 * @param word The string to capitalize
 * @returns a capitalized string.
 */
export function capitalizeString(word: string) {
  if (!word) return word;
  return word[0].toUpperCase() + word.slice(1).toLowerCase();
}

/**
 * Gets the param `pk` from the params of the page.
 *
 * @returns Returns the pk, or an empty string
 */
export function useParamsPk() {
  const params = useParams()
  const { pk } = params
  return pk || ''
}

/**
 * Computes the suffix of a number, using the following rules:
 * st is used with numbers ending in 1 (e.g. 1st, pronounced first)
 * nd is used with numbers ending in 2 (e.g. 92nd, pronounced ninety-second)
 * rd is used with numbers ending in 3 (e.g. 33rd, pronounced thirty-third)
 * As an exception to the above rules, all the "teen" numbers ending with 11, 12 or 13 use -th (e.g. 11th, pronounced eleventh, 112th, pronounced one hundred [and] twelfth)
 * th is used for all other numbers (e.g. 9th, pronounced ninth).
 *
 * @param input The number we want to add the suffix to.
 * @returns The number with its suffix, as a string
 */
export function ordinalSuffix(input: number) {
  var ones = input % 10,
    tens = input % 100;
  if (ones == 1 && tens != 11) {
    return input + "st";
  }
  if (ones == 2 && tens != 12) {
    return input + "nd";
  }
  if (ones == 3 && tens != 13) {
    return input + "rd";
  }
  return input + "th";
}
