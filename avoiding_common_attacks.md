# Security - Avoiding common attacks

- Implemented the emergency stop pattern to stop state changes in case bugs are found.

- Used SafeMath library to stop integer overflow/underflow in my ABAToken contract.

- Locked the pragma to specific solidity compiler version to reduce risk of undiscovered bugs of future deployments.

- Prevent a race condition where if two teams are drafting the same player at the same time it could overwrite one team's draft and mess up the roster count.
    - In order to do this I added an extra require statement before emiting the event in the draftPlayer function to check that the player's team is the curren team Id. That way only the first team to draft will successfully do this, and the other team will have the transaction fail.
