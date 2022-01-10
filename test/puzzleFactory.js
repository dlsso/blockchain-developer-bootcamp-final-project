const PuzzleFactory = artifacts.require("./PuzzleFactory.sol");

contract("PuzzleFactory", accounts => {
  it("should deploy successfully", async () => {
    const puzzleFactoryInstance = await PuzzleFactory.deployed();
    assert.ok(puzzleFactoryInstance.address);
    assert.equal('function', typeof puzzleFactoryInstance.methods['createPuzzle(string)']);
  });
  it("should log the address when creating a new puzzle", async () => {
    const puzzleFactoryInstance = await PuzzleFactory.deployed();
    const response = await puzzleFactoryInstance.createPuzzle(42, { from: accounts[0], value: 1000 });
    assert.ok(response.logs[0].args.puzzleAddress);
  });
});
