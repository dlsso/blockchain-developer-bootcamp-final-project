The design patterns I used were

## Optimizing Gas
* Usage of `Bytes32` over `string`
* Usage of `calldata` over `memory`
* Used factory pattern but don't know that this counts as gas saving for me since it was mentioned in relation to redeploys, and I'm using it for contract generation

## Factory pattern
* This was not on the list of patterns to use, but none of the other ones on the list seemed useful for my project
* `PuzzleFactory.sol` has a puzzle generator that creates a new puzzle each time it is called, using the contract in `Puzzle.sol`

## Inheritance
* I did not need any libraries and couldn't come up with a legitmate use case, so Tom said it's fine not to use it

### Note to instructors
If the factory pattern doesn't count I am happy to go back and add another as well, just let me know. Suggestions would also be appreciated since I struggled to find a legitimate use case for the other patterns with this project.