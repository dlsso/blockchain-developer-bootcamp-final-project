var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var PuzzleFactory = artifacts.require("./PuzzleFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(PuzzleFactory);
};
