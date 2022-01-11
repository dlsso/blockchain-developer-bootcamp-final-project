// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

/// @title A puzzle creator
/// @author dlsso
/// @notice Returns the value stored in the contract to anyone who sends the correct answer
contract Puzzle {
    bytes32 hashedAnswer;

    /// @notice Logs whether or not the solve attemt was successful
    /// @param success Boolean: whether or not the guess was successful
    event LogSolveAttempt(bool success);
	
    constructor(bytes32 answerHash) public payable {
        hashedAnswer = answerHash;
    }

    /// @notice Returns the value stored in the contract to anyone who sends the correct answer
    /// @param guess The user's guess what the answer of the puzzle is
    /// @return Boolean: whether or not the guess was successful
    function solve(string memory guess) public returns (bool) {
		if (keccak256(abi.encodePacked(guess)) == hashedAnswer) {
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
