var PuzzleFactory = artifacts.require("./PuzzleFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(PuzzleFactory);
};
