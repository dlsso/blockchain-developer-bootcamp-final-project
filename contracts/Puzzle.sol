// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

contract Puzzle {
  bytes32 hashedAnswer;

  event LogSolveAttempt(bool success);
	
  constructor(bytes32 answerHash) public payable {
    hashedAnswer = answerHash;
  }

  function solve(string memory guess) public returns (bool) {
		if(keccak256(abi.encodePacked(guess)) == hashedAnswer){
			// Correct! Send contract value to solver
			msg.sender.transfer(address(this).balance); // Upgrade to call?
			emit LogSolveAttempt(true);
			return true;
		}
		// Incorrect, notify failure
		emit LogSolveAttempt(false);
  	return false;
  }
}
