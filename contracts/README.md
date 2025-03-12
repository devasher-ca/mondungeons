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
forge script script/DeployCharacterNFT.s.sol --rpc-url https://testnet-rpc.monad.xyz --broadcast --private-key $PRIVATE_KEY

== Logs ==
  CharacterNFT implementation deployed at: 0x5aF713fDd9086876dcbedCfc5bCfe479093E08E4
  CharacterNFT proxy deployed at: 0xf5863Eb189209288F77C05e9861E6F1dc4C180AF

```
