## Mon Dungeons

### Contracts file structure

contracts/
├── src/
│ ├── core/ # core contract
│ │ ├── CharacterNFT.sol # character NFT contract
│ │ └── GameRegistry.sol # game registry contract (for managing other contract addresses)
│ │
│ ├── gameplay/ # gameplay related contracts
│ │ ├── Combat.sol # combat system
│ │ ├── Quest.sol # quest system
│ │ └── Inventory.sol # inventory system
│ │
│ ├── items/ # item related contracts
│ │ ├── Equipment.sol # equipment
│ │ ├── Consumables.sol # consumables
│ │ └── Currency.sol # game currency
│ │
│ ├── libraries/ # utility library contracts
│ │ ├── AttributeLib.sol # attribute calculations
│ │ └── CombatLib.sol # combat calculations
│ │
│ └── interfaces/ # interface definitions
│ ├── ICharacter.sol
│ └── IGameplay.sol
│
├── test/ # test files
│ ├── core/
│ ├── gameplay/
│ └── items/
│
└── script/ # deployment scripts
└── deploy/

### Contracts Deployments

```
forge script script/DeployCharacterNFT.s.sol -- --network monad
[⠊] Compiling...
No files changed, compilation skipped
Script ran successfully.
Gas used: 6466358

== Logs ==
  CharacterNFT implementation deployed at: 0xb476761507196692a8aE02b8aC12A72Cc6067D1F
  CharacterNFT proxy deployed at: 0xE31D2ef09Cd58EC4f8d5AbAB770966880e836B1C

If you wish to simulate on-chain transactions pass a RPC URL.
```
