import React, { Component } from "react";
import { CeramicClient } from '@ceramicnetwork/http-client';
import KeyDidResolver from 'key-did-resolver';
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver';
import { DID } from 'dids';
import { ThreeIdConnect, EthereumAuthProvider } from '@3id/connect';
import { TileDocument } from '@ceramicnetwork/stream-tile';

import SimpleStorageContract from "./contracts/SimpleStorage.json";
import PuzzleFactory from "./contracts/PuzzleFactory.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null, streamId: 'kjzl6cwe1jw14a485qm0p99jacbst4gyifnmm46txejgat6218yekj19owbcbrw', ceramic: {}};

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = PuzzleFactory.networks[networkId];
      const instance = new web3.eth.Contract(
        PuzzleFactory.abi,
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
    const ceramic = new CeramicClient(API_URL);
    const resolver = { ...KeyDidResolver.getResolver(),
                       ...ThreeIdResolver.getResolver(ceramic) }
    const did = new DID({ resolver });
    ceramic.did = did;

    // 3ID Connect
    const addresses = await window.ethereum.enable();
    const threeIdConnect = new ThreeIdConnect()
    const authProvider = new EthereumAuthProvider(window.ethereum, addresses[0]);
    await threeIdConnect.connect(authProvider);
    const provider = await threeIdConnect.getDidProvider();
    ceramic.did.setProvider(provider);
    await ceramic.did.authenticate();
    this.setState({ ceramic: ceramic });

    // Load puzzles
    const doc = await TileDocument.load(this.state.ceramic, this.state.streamId);
    this.setState({ puzzles: doc.content });
    console.log('puzzles', this.state.puzzles);

    // Listen for logs
    this.state.contract.events.LogCreatedPuzzle(
      {
        // Example options
        // fromBlock: 0,
        // toBlock: 'latest'
      },
      function(err, event){
        console.log('event', event);
      }
    );
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

  submitPuzzle = async (form) => {
    let puzzleId = Math.floor(Math.random()*1e18); // swap for uuid
    let puzzle = {
      id: puzzleId,
      description: form.puzzle.value,
      reward: form.reward.value,
      solved: false,
    }
    const doc = await TileDocument.load(this.state.ceramic, this.state.streamId);
    const puzzles = doc.content;
    puzzles.push(puzzle);
    await doc.update(puzzles, {}, {pin: true}); // Updates doc variable as well
    this.setState({ puzzles: doc.content });
    console.log('state puzzles', this.state.puzzles)

    // Test hitting puzzle factory and getting log
    const { accounts, contract } = this.state;
    await contract.methods.createPuzzle(form.answer.value).send(
      {
        from: accounts[0],
        value: this.state.web3.utils.toWei(form.reward.value, "ether")
      }
    );
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    this.submitPuzzle(e.target);
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
          <h2>Create a puzzle</h2>
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
      <div>
        <h2>Puzzles</h2>
          {this.state.puzzles ? this.state.puzzles.map(puzzle => (
            <div key={puzzle.id} className='puzzle'>
              <h3>Description</h3>
              <div>{puzzle.description}</div>
              <h3>Reward</h3>
              <div>{puzzle.reward}</div>
              <h3>Solve</h3>
              <input
                type="text"
                name="answer"
                placeholder="The answer to the puzzle"
                required
              />
              <button type="submit">
                Submit
              </button>
            </div>
          )) : <h3>Loading...</h3>}
      </div>
      </>
    );
  }
}

export default App;
