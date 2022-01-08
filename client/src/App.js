import React, { Component } from "react";
import { CeramicClient } from '@ceramicnetwork/http-client';
import KeyDidResolver from 'key-did-resolver';
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver';
import { DID } from 'dids';
import { ThreeIdConnect, EthereumAuthProvider } from '@3id/connect';
import { TileDocument } from '@ceramicnetwork/stream-tile';

import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  streamId = '';
  ceramic = {}

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }

    // Ceramic
    const API_URL = 'https://ceramic-clay.3boxlabs.com';
    this.ceramic = new CeramicClient(API_URL);
    const resolver = { ...KeyDidResolver.getResolver(),
                       ...ThreeIdResolver.getResolver(this.ceramic) }
    const did = new DID({ resolver });
    this.ceramic.did = did;

    // 3ID Connect
    const addresses = await window.ethereum.enable();
    const threeIdConnect = new ThreeIdConnect()
    const authProvider = new EthereumAuthProvider(window.ethereum, addresses[0]);
    await threeIdConnect.connect(authProvider);
    const provider = await threeIdConnect.getDidProvider();
    this.ceramic.did.setProvider(provider);
    await this.ceramic.did.authenticate();

    // const doc = await TileDocument.create(ceramic, ['puzzle1 text', 'puzzle2 text'], {}, {pin: true});
    this.streamId = 'kjzl6cwe1jw14a485qm0p99jacbst4gyifnmm46txejgat6218yekj19owbcbrw';
    const puzzles = await TileDocument.load(this.ceramic, this.streamId);
    console.log('puzzles', puzzles.content);
    // await puzzles.update(['puzzle1 text', 'puzzle2 text', 'new puzzle text'], {}, {pin: true});

  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    // await contract.methods.set(5).send({ from: accounts[0] });

    // // Get the value from the contract to prove it worked.
    // const response = await contract.methods.get().call();

    // // Update state with the result.
    // this.setState({ storageValue: response });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    let puzzleId = Math.floor(Math.random()*1e18); // swap for uuid
    let puzzle = {
      id: puzzleId,
      description: form.puzzle.value,
      reward: form.reward.value,
    }
    const doc = await TileDocument.load(this.ceramic, this.streamId);
    const puzzles = doc.content;
    puzzles.push(puzzle);
    await doc.update(puzzles, {}, {pin: true}); // Updates the variable as well
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <>
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 42</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div>
      </div>
      <form onSubmit={this.handleSubmit}  id="create-puzzle-form">
        <div>
          <label>Puzzle</label>
          <textarea
            name="puzzle"
            placeholder="Enter puzzle text"
            required
          />
        </div>
        <div>
          <label>Anwser</label>
          <input
            type="text"
            name="answer"
            placeholder="The answer to the puzzle"
            required
          />
        </div>
        <div>
          <label>Reward</label>
          <input
            type="number"
            step="any"
            name="reward"
            placeholder="Reward amount in ETH"
            required
          />
        </div>
        <button type="submit">
          Submit
        </button>
      </form>
      </>
    );
  }
}

export default App;
