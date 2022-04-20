export const calculateBracketRound = (numberOfTeams: number, sizeOfTeams: number, offset?: number): any => {
  // Starting placement is the provided offset, or 1 (since first team doesn't need to place on own)
  let startingPlacement = offset || 1

  // Quickly initialize the current week to have every team play a home game
  const currentWeek = []
  for (let currentTeam = 0; currentTeam < numberOfTeams; currentTeam++) {
    currentWeek.push([currentTeam])
  }

  // Now we want to loop through every team, and add them to their games for the week
  for (let currentTeam = 0; currentTeam < numberOfTeams; currentTeam++) {
    // Starting placement, offset by the current team number
    let currentPlacementForTeam = (startingPlacement + currentTeam) % numberOfTeams
    // We want every member of the team to play one game this week
    let numberLeftToPlace = sizeOfTeams - 1

    while (numberLeftToPlace > 0) {
      // Move forward one position if we are trying to place at our home game
      if (currentPlacementForTeam === currentTeam) {
        currentPlacementForTeam += 1
      }
      // If we are over the limit, wrap
      else if (currentPlacementForTeam >= numberOfTeams) {
        currentPlacementForTeam = 0
      }
      else {
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

export const calculateBracket = (numberOfRounds: number, numberOfTeams: number, sizeOfTeams: number): any => {
  /*
    Algorithm:
    - Everyone gets a "home" game every week
    - Place (teamSize - 1) spots in consecutive order
    - Do not place, on a board where a teammate is playing TODO edge case to handle in future
    - Wrap, so if you would place in an invalid location, go to start
    - In the following week week, shift + 1 the spot you started placing from before
   */
  // We only calculate fair brackets (with no extra matches, always playing everyone equally).
  const minBracketSize = numberOfTeams - 1
  const totalBracketSize = Math.ceil(numberOfRounds / minBracketSize) * minBracketSize

  // Calculate all weeks of bracket
  const allWeeksBracket = []
  for (let currentWeek = 0; currentWeek < totalBracketSize; currentWeek++) {
    allWeeksBracket.push(calculateBracketRound(numberOfTeams, sizeOfTeams, currentWeek))
  }

  /*
    TODO Validation
    - You would play on your own board every time.
    - You would play on every non home board 3 times
    - You should have the exact same combination twice
   */
  return allWeeksBracket
}
