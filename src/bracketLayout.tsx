/**
 * Calculate a single round of a bracket. See `calculateBracket` for more information on how this
 * is done.
 *
 * @param numberOfTeams The number of teams in the bracket.
 * @param sizeOfTeams How many individual players are on each team.
 * @param offset When starting to match teams up, which team to start placing them on
 */
export const calculateBracketRound = (
  numberOfTeams: number,
  sizeOfTeams: number,
  offset?: number,
): number[][] => {
  // Starting placement is the provided offset, or 1 (since first team doesn't need to place on own)
  const startingPlacement = offset || 1

  // Quickly initialize the current week to have every team play a home game
  const currentWeek = []
  for (let currentTeam = 0; currentTeam < numberOfTeams; currentTeam += 1) {
    currentWeek.push([currentTeam])
  }

  // Now we want to loop through every team, and add them to their games for the week
  for (let currentTeam = 0; currentTeam < numberOfTeams; currentTeam += 1) {
    // Starting placement, offset by the current team number
    let currentPlacementForTeam = (startingPlacement + currentTeam) % numberOfTeams
    // We want every member of the team to play one game this week
    let numberLeftToPlace = sizeOfTeams - 1

    while (numberLeftToPlace > 0) {
      // Move forward one position if we are trying to place at our home game
      if (currentPlacementForTeam === currentTeam) {
        currentPlacementForTeam += 1
      } else if (currentPlacementForTeam >= numberOfTeams) {
        // If we are over the limit, wrap
        currentPlacementForTeam = 0
      } else {
        // We are good to place here, so add it
        currentWeek[currentPlacementForTeam].push(currentTeam)
        // Now move forward and reduce how many we still need to place
        currentPlacementForTeam += 1
        numberLeftToPlace -= 1
      }
    }
  }
  return currentWeek
}

/**
 * Calculates a round-robin bracket for given inputs. Bracket is fair, in that there will always be
 * enough rounds for each team to match up equally.
 *
 * Algorithm:
 * - Everyone gets a "home" game every week
 * - Place (teamSize - 1) spots in consecutive order
 * - Do not place, on a board where a teammate is playing TODO edge case to handle in future
 * - Wrap, so if you would place in an invalid location, go to start
 * - In the following week, shift + 1 the spot you started placing from before
 *
 * @param numberOfRounds The number of times individual members on teams should play.
 * @param numberOfTeams The number of teams in the bracket.
 * @param gamesPerWeek How many individual players are on each team.
 * @param maxNumberOfWeeks How many weeks we should make the bracket, even if it is uneven.
 */
export const calculateBracket = (
  numberOfRounds: number,
  numberOfTeams: number,
  gamesPerWeek: number,
  maxNumberOfWeeks?: number,
): number[][][] => {
  // Get the number of rounds needed for there to be even matchups.
  const minBracketSize = numberOfTeams - 1
  const totalBracketSize = Math.ceil(numberOfRounds / minBracketSize) * minBracketSize

  // Calculate all weeks of bracket
  const allWeeksBracket = []
  for (let currentWeek = 0; currentWeek < totalBracketSize; currentWeek += 1) {
    allWeeksBracket.push(calculateBracketRound(numberOfTeams, gamesPerWeek, currentWeek))
  }

  /*
    TODO Validation
    - You would play on your own board every time.
    - You would play on every non home board 3 times
    - You should have the exact same combination twice
   */
  if (maxNumberOfWeeks) {
    return allWeeksBracket.slice(0, maxNumberOfWeeks)
  }
  return allWeeksBracket
}
