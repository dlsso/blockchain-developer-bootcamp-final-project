# ETH Puzzles

## Readme checklist
- [x] Describes the project
- [x] Describes the directory structure
- [x] Describes where the frontend project can be accessed
- [x] Your public Ethereum account if you would like to receive your certification as an NFT (this is optional)
- [x] Clear instructions on installing dependencies for your project
- [x] Clear instructions on accessing or—if your project needs a server (not required)—running your project
- [x] Clear instructions on running your smart contract unit tests and which port a local testnet should be running on
## Project description
Allow users to post and solve puzzles with an ETH reward. Users can post a puzzle using the web interface and an associated smart contract will be created holding the ETH reward. Other users can submit an answer to the smart contract through the web interface. When the smart contract receives the correct answer it releases the funds to the sender.

## Directory structure
This is the directory structure. The front end lives in `/client`

![image](https://user-images.githubusercontent.com/6238782/149050375-66edf056-8b3b-4a2d-97ab-c2219de51e50.png)


## Where front end can be accessd
https://dlsso.github.io/blockchain-developer-bootcamp-final-project/

## Ethereum account to send NFT
`0xBb88013DdA8095576230Ae446e4e5047Cf56Dade`
## Installing dependencies
0. Requires `truffle`, `ganache-cli`, `yarn`, and MetaMask
1. Navigate to `blockchain-developer-bootcamp-final-project/client` and `yarn install`


## Accessing or running your project
1. Run `ganache-cli` from main directory, copy one of the private keys displayed to use later
2. In a new window run `truffle migrate --reset` from main directory
3. Run `yarn start` from client directory (many warnings will show, a side effect of the truffle react box not being up to date enough to play nice with my IPFS library)
4. Open your browser, go to MetaMask, select Localhost 8545 as your network, do Import Account and paste the private key you copied earlier. You should see near 100 ETH.
4. Navigate to `http://localhost:3000/`, you will see a 3ID Connect popup
5. On the popup click connect to existing ID and choose to link `did:3:kjzl…8dj8438vv`, signing any MetaMask requests
6. Congrats, you are now running the project and should see the create puzzle form and any existing puzzles!

## Running your smart contract unit tests and which port a local testnet should be running on
Run `truffle test` from the project directory. Local testnet should be on port `8545`.



# Project proposal (kept for reference)
## Use case
Crypto enthusiasts like puzzles. Primary use would be just for fun. Could also be used as a recruiting tool. Ultimate stretch goal would be to create a system that allows puzzle creators to accept an answer of their choosing, allowing the platform to be used for general rewards (unsolved problems, content creation, etc.).
## Puzzle creation workflow
1. User connects to MetaMask
2. User enters puzzle text, answer, and reward, then submits. (Stretch goal: ability to add image)
4. Puzzle appears on site, smart contract holding puzzle reward created behind the scenes

## Puzzle solving workflow
1. User connects to MetaMask
2. User enters answer in web interface
3. If correct, the smart contract releases funds to the sender's address
4. If incorrect, receive error message

### Notes
* Potentially easy stretch goal: limit 1-2 attempts per address
* Any way to prevent address generation brute force attacks? If not, encourage puzzles with an answer space large enough that brute forcing costs more than the reward.
  * More involved stretch goal: build calculator based on answer space, current gas price, and reward to inform user if puzzle is safe from brute forcing
* May want to use revert code if too many attempts, to prevent gas loss