# Augmented Basketball Association

This project is a proof of concept for the Consensys Academy final project.

It is a fantasy basketball league run by smart contracts.

It is called the Augmented Basketball Association or ABA because it is inspired by the science fiction setting of the [Cellarius Universe](https://cellarius.network/) where basketball players have augmented themselves in order to improve their performance.

Players are fictional characters that basketball team owners can draft based on their stats. People playing would own a team and try to draft the best team; you can also have DAOs instead of individuals own/manage the team.

This is basically a blockchain game similar to a basketball league simulator, but the players and their teams are on the blockchain. I plan on continuing this in the future and turning the players into NFTs (Non-Fungible tokens), as well as creating an off-chain simulation program that will pit the teams together. The results of those games will be logged onto the blockchain on a seperate oracle contract.

### Features:
- A Commisioner who creates the players
- An ABA Token that represents shares in the league and gives those with elevated privileges
    - Change the commisioner
    - Turn on/off the emergency shutdown 
    - Add a new team
- Team owners can draft players they like and renounce those they don't

### Unimplemented features:
- Trading between teams
- A more complex DAO to manage the league and teams.
- IPFS character creator (player stats are not saved in the blockchain, my idea would be to create the player and save their stats as json in IPFS and save the IPFS hash in the blockchain instead)
- Complex player contracts

### Other information:
- Uses SafeMath library and BasicToken (ERC20) contract templates from OpenZeppelin

### Setup/Video

Please watch the following video to see setup and a demo of the project:
[https://youtu.be/wEKZfkXsdKs](https://youtu.be/wEKZfkXsdKs)

## Prerequisites
1) Ensure node/npm is installed (at least version 8 and above or the current LTS version)
2) Ensure truffle is installed

```
npm install -g truffle
```

3) Install ganache to run your own local blockchain

## Project setup
1) git clone the project
2) run npm install to install dependencies (lite-server)

```
npm install
```

3) run truffle compile to compile the smart contracts

```
truffle compile
```

4) turn on ganache or your local blockchain (if not using ganache or running on default ports be sure to edit truffle.js with your configurations)
5) run truffle migrate

```
truffle migrate
```

6) you can run truffle test to run the js test suite included

```
truffle test
```

7) run the server using either commands below

```
lite-server
npm run dev
```
