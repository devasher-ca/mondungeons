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
[⠊] Compiling...
[⠃] Compiling 47 files with Solc 0.8.26
[⠒] Solc 0.8.26 finished in 879.76ms
Compiler run successful!
Script ran successfully.

== Logs ==
  CharacterNFT implementation deployed at: 0x8C11C0eBc426740d6e39C219cD6D0148aE5E1Aa3
  CharacterNFT proxy deployed at: 0x44ff5bE110a188F1086665fffaB45F730214544f

```
