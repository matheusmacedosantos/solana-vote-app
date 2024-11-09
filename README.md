
# Voting on Solana Blockchain

This project implements a voting application using Anchor to the Solana blockchain. Users can vote between two candidates through a decentralized system, ensuring transparency and immutability. The project utilizes Solana's Web3 infrastructure to handle transactions securely, making it ideal for decentralized voting and polling applications.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Technology Stack](#technology-stack)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

This project uses the Solana blockchain to create a decentralized voting application where users can vote between two candidates: "DJ Trump" and "Kamala Harrys." The app is designed to interact with the Solana blockchain through a simple API, allowing users to submit votes and view the results in real time. By leveraging blockchain technology, this project aims to provide a tamper-proof voting process, where every vote is securely recorded on-chain.

## Features

- **Decentralized Voting**: Built on the Solana blockchain to ensure transparency.
- **Simple User Interface**: Users can easily vote between two candidates.
- **Immutable Record**: Each vote is permanently recorded on the blockchain.
- **Real-time Results**: Users can view vote counts immediately after submitting their vote.

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/matheusmacedosantos/solana-vote-app.git
   cd solana-vote-app
   ```

2. **Install Dependencies**:
   Install the required packages with npm:
   ```bash
   npm install
   ```

3. **Set Up Solana Test Validator**:
   Ensure you have the Solana CLI installed, then run:
   ```bash
   solana-test-validator
   ```

4. **Start the Application**:
   ```bash
   npm start
   ```

## Usage

- **Voting**: Users can vote for their chosen candidate through the API endpoint `/api/vote?candidate=<candidate_name>`.
- **Accessing Results**: Once a vote is submitted, users can view vote counts in real time.
  
To submit a vote, ensure you are connected to the Solana network. This project includes the necessary configuration for interacting with the Solana test network.

## API Endpoints

### GET `/api/vote`
Returns information about the voting event, including candidate details and voting status.

### POST `/api/vote?candidate=<candidate_name>`
Submits a vote for the specified candidate. This request must include a valid Solana account ID.

- **Parameters**:
  - `candidate`: The name of the candidate (either `trump` or `kamala`).
  - **Example**:
    ```bash
    curl -X POST "http://localhost:3000/api/vote?candidate=trump"
    ```

## Technology Stack

- **Blockchain**: Solana
- **Backend**: Node.js, Solana Web3.js, Anchor
- **API**: RESTful API with JSON responses
- **Smart Contract Language**: Rust


## License

This project is licensed under the MIT License. See `LICENSE` for more information.
