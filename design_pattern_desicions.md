# Design Patterns

Patterns used:
- Emergency Stop
    - My implementation of the emergency stop requires someone to own 51% of the ABA tokens (representing majority ownership). It turns off all functions that change the state of the BasketBallLeagueStorage contract.
- ERC20 (Basic Token)
    - I inherited from OpenZeppelin's ERC20 Basic Token contract to represent the ABA Tokens that represent ownership in the league.


Patterns not used:
- ERC721 (ERC1155)
    - My original plan was to turn the basketball players into ERC-721 NFTs or even use the new ERC1155 standard from EnjinCoin, however for the scope of this project I didn't want to complicate the project as I wanted to focus on a prototype for now. In the future I plan on continuing the project and turning the basketball players and other basketball league assets into NFTs either using ERC721 or ERC1155 as the base. That being said, I did take the idea of having a (metadata) string property tied to each player so that an IPFS hash could be saved on the blockchain that could represent further data values that don't need to be stored in the blockchain.