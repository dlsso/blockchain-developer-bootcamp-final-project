// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
import "./Puzzle.sol";

/// @title A puzzle creator
/// @author dlsso
/// @notice Creates a puzzles with a reward of the value sent to it
contract PuzzleFactory {

    /// @notice Logs the address and reward amount of the created puzzle
    /// @param puzzleAddress The address of the created puzzle
    /// @param reward The amount of the reward in wei
    event LogCreatedPuzzle(address indexed puzzleAddress, uint reward);

    /// @notice Creates a puzzles with a reward of the value sent to it
    /// @param answer The answer to the puzzle
    /// @return The address of the new puzzle
    function createPuzzle(string calldata answer) external payable returns(address) {
        bytes32 hashedAnswer = keccak256(abi.encodePacked(answer));
        // Should deploy Puzzle.sol to a new address and give it whatever value was sent
        Puzzle newPuzzle = (new Puzzle).value(msg.value)(hashedAnswer);
        // Emit event for front end
        emit LogCreatedPuzzle(address(newPuzzle), msg.value);
        return address(newPuzzle);
    }
}
