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
  CharacterNFT implementation deployed at: 0x1e43960BE19396Bf87bDDD2a6944c495Ae0ac8CB
  CharacterNFT proxy deployed at: 0x27D0857148D7F44D05082EdEF15DA56187339a15

```

### The Graph

```
graph init mondungeons --abi=./contracts/out/CharacterNFT.sol/CharacterNFT.json --from-contract 0x27D0857148D7F44D05082EdEF15DA56187339a15 --start-block=7378955
```
