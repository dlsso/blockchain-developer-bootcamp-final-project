// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

contract Puzzle {
  hash hashedAnswer;

  event LogSolveAttempt(bool success);
	
	// Follows ConsenSys example. Find out difference between this and constructor.
  function Puzzle(answer) public payable {
    hashedAnswer = keccak256(abi.encodePacked(answer));
  }

  function solve(answer) public returns (uint) {
		if(keccak256(abi.encodePacked(answer)) == hashedAnswer){
			// Correct! Send contract value to solver
			msg.sender.transfer(address(this).balance) // Upgrade to call?
			emit LogSolveAttempt(true)
			return true;
		}
		// Incorrect, notify failure
		emit LogSolveAttempt(false)
  	return false;
  }
}
