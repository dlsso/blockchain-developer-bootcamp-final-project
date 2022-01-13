The security measures I used were

## Use Specific Compiler Pragma (SWC-103)
* Done in both Puzzle.sol and puzzleFactory.sol

## Proper use of .call and .delegateCall (SWC-134)
* Used call instead of `msg.sender.transfer` in Puzzle.sol

## Proper Use of Require, Assert and Revert (SWC-123)
* No overly strong `require` in Puzzle.sol
