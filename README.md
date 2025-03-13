## Mon Dungeons

### Project Description

Mondungeons is a Dungeons & Dragons inspired on-chain RPG built on the Monad blockchain. Players create dynamic NFT characters, explore a procedurally generated world, engage in fast-paced turn-based battles, and progress their characters through on-chain achievements, leveraging Monad's high performance for a seamless and engaging blockchain gaming experience.

### Problem Statement

Current blockchain RPG strategy games often fall short in delivering a truly engaging player experience due to two key limitations. Firstly, interaction smoothness is compromised by slow transaction speeds and high gas fees, hindering fluid gameplay, especially in complex RPGs requiring frequent on-chain actions. Secondly, many games fail to fully leverage the potential of blockchain, offering limited innovative gameplay mechanics beyond basic asset ownership. This results in on-chain games that don't yet capture the depth and richness of traditional RPG experiences, leaving players wanting more dynamic and truly blockchain-native gameplay.

### Proposed Solution

Mondungeons addresses these issues by focusing on two core pillars: enhancing player engagement through blockchain innovation and ensuring a fluid, high-performance experience.

### Key Features

- Innovative Dynamic NFT Character Minting

- Strategic On-Chain Equipment System

- Reactive and Dynamic Game World

### Target Users

Our target users remain RPG and blockchain game enthusiasts, but now with a sharper focus on players seeking innovative and truly on-chain gameplay experiences.

## Technical Documentation

### Project Architecture

Mondungeons follows a modern web3 architecture with two main components:

1. **Smart Contracts (Backend)**: Solidity contracts deployed on the Monad blockchain
2. **Web Application (Frontend)**: Next.js-based web application for user interaction

#### Smart Contract Architecture

The smart contract system is built using Solidity and follows a modular design pattern:

- **Core Contracts**:

  - `CharacterNFT.sol`: ERC721-based NFT implementation for character management
  - `GameRegistry.sol`: Central registry for game state and coordination

- **Gameplay Contracts**: Handle game mechanics, battles, and world interaction

- **Item Contracts**: Manage in-game items, equipment, and their properties

- **Libraries**: Utility functions and shared logic

#### Frontend Architecture

The frontend is built with Next.js and follows a component-based architecture:

- **App Router**: Modern Next.js app router for page routing and layout management
- **Components**: Reusable UI components built with React
- **Providers**: Context providers for global state management
- **Hooks**: Custom React hooks for blockchain interaction and game logic

### Technologies Used

#### Smart Contracts

- **Language**: Solidity ^0.8.20
- **Development Framework**: Foundry
- **Libraries**:
  - OpenZeppelin Contracts (ERC721, Access Control, Upgradeable Contracts)
  - Forge Standard Library

#### Frontend

- **Framework**: Next.js 15.x
- **UI Libraries**:
  - React 19.x
  - Tailwind CSS
  - Radix UI Components
  - Lucide React (Icons)
- **Web3 Integration**:
  - ConnectKit
  - wagmi
  - viem
- **State Management**:
  - React Context API
  - React Query

### Design Choices

#### Smart Contract Design

- **Upgradeable Contracts**: Using OpenZeppelin's upgradeable contract patterns to allow for future improvements
- **Access Control**: Role-based access control for different permission levels
- **Gas Optimization**: Optimized for Monad's high-performance environment
- **Security**: Implementing reentrancy guards and other security best practices

#### Frontend Design

- **Server Components**: Leveraging Next.js server components for improved performance
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Web3 UX**: Streamlined wallet connection and transaction experience
- **Component Library**: Custom UI components built on Radix UI primitives

### External Dependencies

#### Smart Contract Dependencies

- OpenZeppelin Contracts
- Forge Standard Library

#### Frontend Dependencies

- Next.js ecosystem
- Tailwind CSS
- Radix UI component library
- ConnectKit and wagmi for wallet integration
- React Query for data fetching

### Development Environment

#### Smart Contract Development

- Foundry for compilation, testing, and deployment
- Monad testnet for development and testing

#### Frontend Development

- Node.js
- pnpm package manager
- TypeScript for type safety
- ESLint for code quality

### Getting Started

#### Prerequisites

- Node.js
- pnpm
- MetaMask or compatible wallet
- Foundry (for smart contract development)

#### Installation

1. Clone the repository:

   ```
   git clone git@github.com:devasher-ca/mondungeons.git
   cd mondungeons/client/
   ```

2. Install dependencies:

   ```
   pnpm install
   ```

3. Configure environment variables:
   ```
   cp .env.example .env
   ```
   Edit the `.env` file with NEXT_PUBLIC_GHOST_API_URL

#### Running the Project

1. Start the development server:

   ```
   pnpm dev
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

### Live Website

You can access the live application at [https://app.mondungeons.xyz/](https://app.mondungeons.xyz/)
