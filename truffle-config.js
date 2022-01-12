const path = require("path");
const HDWalletProvider = require('@truffle/hdwallet-provider');
const infuraURL = 'https://rinkeby.infura.io/v3/b7d8ba9d703240a89e91f59d414b258a'
const fs = require('fs');
const mnemonic = fs.readFileSync(".secret").toString().trim();

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  compilers: {
    solc: { version: "0.6.12" }
  },
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, infuraURL),
      network_id: 4, // Rinkeby's network id
      gas: 5500000,
    },
    develop: {
      port: 8545
    }
  }
};
