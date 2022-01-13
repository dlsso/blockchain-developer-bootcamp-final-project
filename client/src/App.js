import React, { Component } from "react";
import { CeramicClient } from '@ceramicnetwork/http-client';
import KeyDidResolver from 'key-did-resolver';
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver';
import { DID } from 'dids';
import { ThreeIdConnect, EthereumAuthProvider } from '@3id/connect';
import { TileDocument } from '@ceramicnetwork/stream-tile';

import PuzzleFactory from "./contracts/PuzzleFactory.json";
import Puzzle from "./contracts/Puzzle.json";
import getWeb3 from "./getWeb3";
import logo from './logo.png';

import "./App.css";

class App extends Component {
  state = {
    accounts: null,
    ceramic: {},
    contract: null,
    network: '',
    streamId: 'kjzl6cwe1jw14a485qm0p99jacbst4gyifnmm46txejgat6218yekj19owbcbrw',
    submittingAnswer: false,
    submittingPuzzle: false,
    web3: null,
  };

  componentDidMount = async () => {
    const networks = {
      '1': 'Mainnet',
      '4': 'Rinkeby',
      '1641947710321': 'Local testnet'
    };
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
      // Set web3, accounts, and contract in component state
      this.setState({ web3, accounts, contract: instance, network: networks[networkId] });
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
                       ...ThreeIdResolver.getResolver(ceramic) };
    const did = new DID({ resolver });
    ceramic.did = did;

    // 3ID Connect
    const addresses = await window.ethereum.enable();
    const threeIdConnect = new ThreeIdConnect();
    const authProvider = new EthereumAuthProvider(window.ethereum, addresses[0]);
    await threeIdConnect.connect(authProvider);
    const provider = await threeIdConnect.getDidProvider();
    ceramic.did.setProvider(provider);
    await ceramic.did.authenticate();
    this.setState({ ceramic: ceramic });

    // Load puzzles
    const doc = await TileDocument.load(this.state.ceramic, this.state.streamId);
    this.setState({ puzzles: doc.content });
  };

  submitPuzzle = async (form) => {
    // Create puzzle on chain
    const { accounts, contract, network } = this.state;
    this.setState({ submittingPuzzle: true });
    const contractResponse = await contract.methods.createPuzzle(form.answer.value).send(
      {
        from: accounts[0],
        value: this.state.web3.utils.toWei(form.reward.value, "ether")
      }
    );
    // Build puzzle object
    const puzzleAddress = contractResponse.events.LogCreatedPuzzle.returnValues.puzzleAddress;
    const puzzle = {
      address: puzzleAddress,
      network: network,
      description: form.puzzle.value,
      reward: form.reward.value,
      solved: false,
    };
    // Make sure puzzle list is fresh then add the new one
    const doc = await TileDocument.load(this.state.ceramic, this.state.streamId);
    const puzzles = doc.content;
    puzzles.push(puzzle);
    await doc.update(puzzles, {}, {pin: true}); // Updates doc variable as well
    this.setState({ puzzles: doc.content, submittingPuzzle: false });
  }

  submitAnswer = async (answer, puzzleAddress) => {
    const { accounts, web3, ceramic, streamId, puzzles } = this.state;
    // Let app know request is pending
    const thisPuzzle = puzzles.find((puzzle) => puzzle.address === puzzleAddress);
    thisPuzzle.submittingAnswer = true;
    this.setState({ puzzles: puzzles });
    // Send solve attempt
    const puzzleContract = new web3.eth.Contract(Puzzle.abi, puzzleAddress);
    try {
      const contractResponse = await puzzleContract.methods.solve(answer).send({from: accounts[0]});
      const success = contractResponse.events.LogSolveAttempt.returnValues.success;
      if (success){
        // Mark puzzle as solved
        const doc = await TileDocument.load(ceramic, streamId);
        const freshPuzzles = doc.content;
        freshPuzzles.find((puzzle) => puzzle.address === puzzleAddress).solved = true;
        await doc.update(freshPuzzles, {}, {pin: true});
        this.setState({ puzzles: doc.content });
        alert('Congratulations, you solved the puzzle!');
      } else {
        thisPuzzle.submittingAnswer = false;
        this.setState({ puzzles: puzzles });
        alert('Sorry, that was not the correct answer.');
      }
    } catch (error) {
      thisPuzzle.submittingAnswer = false;
      this.setState({ puzzles: puzzles });
      alert(`Error: ${error.message}`);
    }
  }

  handleSubmitPuzzle = async (e) => {
    e.preventDefault();
    this.submitPuzzle(e.target);
  };

  handleSubmitAnswer = async (e) => {
    e.preventDefault();
    this.submitAnswer(e.target.answer.value, e.target.getAttribute('address'));
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <>
      <div id="header">
        <div id="logo-wrap">
          <img id="logo" src={logo} alt="Credit George Puthukkeril"></img>
        </div>
      </div>
      <div id="wrapper">
        <div id="flex-wrapper">
          <div id="create-puzzle">
            <h2>Create a puzzle</h2>
            <form onSubmit={this.handleSubmitPuzzle}  id="create-puzzle-form">
              <label>Puzzle</label>
              <textarea
                name="puzzle"
                placeholder="Enter puzzle text. Answer must be exact, so be precise!"
                required
              />
              <div>
                <label>Answer</label>
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
              <button type="submit" disabled={this.state.submittingPuzzle}>
                {this.state.submittingPuzzle ? 'Pending...' : 'Create puzzle'}
              </button>
            </form>
          </div>
          <div id="puzzles">
            <h2>Puzzles</h2>
              {this.state.puzzles ? this.state.puzzles.map(puzzle => (
                <div key={puzzle.address} className={`puzzle ${puzzle.solved ? 'solved':'unsolved'}`}>
                  <div className="puzzle-group">
                    <div className="puzzle-label">Puzzle ({puzzle.network || 'Unknown testnet'})</div>
                    <div>{puzzle.description}</div>
                  </div>
                  <div className="puzzle-group">
                    <div className="puzzle-label">Reward</div>
                    <div>{puzzle.reward} ETH</div>
                  </div>
                  {puzzle.solved ? <div className="puzzle-label">This puzzle has been solved!</div> :
                  <>
                    <div className="puzzle-label">Solve</div>
                    <form onSubmit={this.handleSubmitAnswer} address={puzzle.address}>
                      <input
                        type="text"
                        name="answer"
                        placeholder="Answer, must be exact!"
                        required
                      />
                      <button type="submit" disabled={puzzle.submittingAnswer}>
                        {puzzle.submittingAnswer ? 'Pending...' : 'Submit answer'}
                      </button>
                    </form>
                  </>
                  }
                </div>
              )) : <div className="puzzle-label">Loading...</div>}
          </div>
        </div>
      </div>
      </>
    );
  }
}

export default App;
