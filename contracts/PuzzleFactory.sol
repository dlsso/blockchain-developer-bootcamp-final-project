// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
import "./Puzzle.sol";


contract PuzzleFactory {

    event LogCreatedPuzzle(address indexed puzzleAddress, uint reward);

    function createPuzzle(string calldata answer) external payable returns(address) {
        bytes32 hashedAnswer = keccak256(abi.encodePacked(answer));
        // Should deploy Puzzle.sol to a new address and give it whatever value was sent
        Puzzle newPuzzle = (new Puzzle).value(msg.value)(hashedAnswer);
        // Emit event for front end
        emit LogCreatedPuzzle(address(newPuzzle), msg.value);
        return address(newPuzzle);
    }
}
