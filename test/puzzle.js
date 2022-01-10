const PuzzleFactory = artifacts.require("./PuzzleFactory.sol");
const Puzzle = artifacts.require("./Puzzle.sol");
const { toBN } = web3.utils;

contract("Puzzle", accounts => {
  let puzzleAddress = '';
  const reward = 1000;
  beforeEach(async () => {
    const PuzzleFactoryInstance = await PuzzleFactory.deployed();
    const response = await PuzzleFactoryInstance.createPuzzle(42, { from: accounts[0], value: reward });
    puzzleAddress = response.logs[0].args.puzzleAddress;
  });

  it("should get deployed successfully", async () => {
    const puzzleInstance = await Puzzle.at(puzzleAddress);
    assert.ok(puzzleInstance.address);
    assert.equal('function', typeof puzzleInstance.methods['solve(string)']);
  });
  it("should reward the value of the contract when given the correct answer", async () => {
    const puzzleInstance = await Puzzle.at(puzzleAddress);
    const startingBalance = await web3.eth.getBalance(accounts[1])
    console.log('startingBalance', startingBalance);
    const txInfo = await puzzleInstance.solve(42, { from: accounts[1]});
    const tx = await web3.eth.getTransaction(txInfo.tx);
    const gasPrice = toBN(tx.gasPrice);
    const gasUsed = toBN(txInfo.receipt.gasUsed);
    const gasCost = gasPrice.mul(gasUsed);
    const endingBalance = await web3.eth.getBalance(accounts[1])
    const addedEndingBalance = toBN(startingBalance).sub(gasCost).add(toBN(reward));
    assert.strictEqual(addedEndingBalance.toString(), toBN(endingBalance).toString());
  });
});
