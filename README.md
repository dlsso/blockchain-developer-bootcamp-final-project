# Puzzle Rewards

## Summary
Allow users to post a puzzle with an ETH reward. The puzzle will be viewable on the web interface and an associated smart contract will be created holding the ETH reward. Allow other users to submit an answer to the smart contract through the web interface. When the smart contract receives the correct answer it releases the funds to the sender.

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


### To get project running
0. Run `npm install` in main dir, run `yarn install` in client dir
1. Run `ganache-cli` from main dir
2. In a new window run `truffle migrate --reset` from main dir
3. Run `yarn start` from client dir