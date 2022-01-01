import "./Puzzle.sol";

pragma solidity >=0.4.21 <0.7.0;

contract PuzzleFactory {
    struct PuzzleInfo {
        address puzzleAddress;
        uint reward;
        bool solved;
    }

    mapping(address => PuzzleInfo) puzzles;

    event LogCreatedPuzzle(address indexed puzzleAddress, uint reward);

    function createPuzzle(string calldata answer) external payable returns(address) {
        bytes32 hashedAnswer = keccak256(abi.encodePacked(answer));
        // Should deploy Puzzle.sol to a new address and give it whatever value was sent
        Puzzle newPuzzle = (new Puzzle).value(msg.value)(hashedAnswer);
        // Planning to store puzzle data in IPFS or firestore. Feels like I should track at least the addresses on chain,
        // but not sure if I'll need anything else. If storing more I think it would work something like this.
        puzzles[address(newPuzzle)] = PuzzleInfo({
            puzzleAddress: address(newPuzzle),
            reward: msg.value,
            solved: false
        });
        // Emit event for front end
        emit LogCreatedPuzzle(address(newPuzzle), msg.value);
        return address(newPuzzle);
    }

    // Don't think I will need a get
    // Also looks like you can't just return a mapping: https://stackoverflow.com/questions/37606839/how-to-return-mapping-list-in-solidity-ethereum-contract
    // function getPuzzles() view public returns (PuzzleInfo) {
    //     return puzzles;
    // }
}
