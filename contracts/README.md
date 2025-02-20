## Mon Dungeons

## Contracts file structure

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
