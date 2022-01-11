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
			// Correct! Send amount in contract to solver's address
            (bool success, ) = msg.sender.call.value(address(this).balance)("");
            // Refund remaining gas if failed
            require(success, "Failed to send reward");
			emit LogSolveAttempt(true);
			return true;
		}
		// Incorrect, notify failure
		emit LogSolveAttempt(false);
  	return false;
  }
}
