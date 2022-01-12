The design patterns I used were

## Inheritance?
Would be extraneous in my project, waiting on suggestion from ConsenSys

## Optimizing Gas
* Usage of `Bytes32` over `string`
* Usage of `calldata` over `memory`
* Used factory pattern but don't know that this counts as gas saving for me since it was mentioned in relation to redeploys, and I'm using it for contract generation

## Factory pattern
* Was not on the list of patterns to use, just noting that I used this as well