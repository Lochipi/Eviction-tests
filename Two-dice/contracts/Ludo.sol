// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract LudoGame {
    // Structure to represent a player
    struct Player {
        uint position;
        address playerAddress;
        bool isPlaying;
    }

    // mapping happens here
    mapping(address => Player) public players;
    address[] public playerList;
    uint public totalPlayers;

    uint public constant BOARD_SIZE = 100;
    uint public constant DICE_SIDES = 6;
    uint public turn;

    // Game initialization flag
    bool public gameStarted;

    modifier isPlayerTurn() {
        require(players[msg.sender].isPlaying, "You are not in the game.");
        require(turn == getPlayerIndex(msg.sender), "It's not your turn.");
        _;
    }

    // Modifier to check if game has started
    modifier gameNotStarted() {
        require(!gameStarted, "The game has already started.");
        _;
    }

    // Initialize the contract
    constructor() {
        gameStarted = false;
        turn = 0;
    }

    function addPlayer() external gameNotStarted {
        require(totalPlayers < 4, "Maximum 4 players allowed.");
        require(
            !players[msg.sender].isPlaying,
            "Player is already in the game."
        );

        players[msg.sender] = Player({
            playerAddress: msg.sender,
            position: 0,
            isPlaying: true
        });
        playerList.push(msg.sender);
        totalPlayers++;
    }

    // Function to start the game
    function startGame() external gameNotStarted {
        require(
            totalPlayers >= 2,
            "At least 2 players are required to start the game."
        );
        gameStarted = true;
    }

    // Function to roll the dice and move the player
    function rollDice() external isPlayerTurn {
        uint diceRoll = pseudoRandomDiceRoll();
        Player storage player = players[msg.sender];

        // Updating the player's position
        player.position += diceRoll;

        if (player.position >= BOARD_SIZE) {
            player.position = BOARD_SIZE;
            gameStarted = false;
            declareWinner(msg.sender);
        } else {
            turn = (turn + 1) % totalPlayers;
        }
    }

    // Pseudorandom number generator for dice rolling
    function pseudoRandomDiceRoll() private view returns (uint) {
        uint randomNumber = (uint(
            keccak256(
                abi.encodePacked(block.timestamp, block.difficulty, msg.sender)
            )
        ) % DICE_SIDES) + 1;
        return randomNumber;
    }

    function declareWinner(address winner) private {
        gameStarted = false;
        // Emit an event (or perform any other logic like rewarding the winner)
        emit GameWon(winner);
    }

    function getPlayerIndex(address player) private view returns (uint) {
        for (uint i = 0; i < totalPlayers; i++) {
            if (playerList[i] == player) {
                return i;
            }
        }
        revert("Player not found.");
    }

    event GameWon(address winner);

    function getPlayerPosition(address player) external view returns (uint) {
        return players[player].position;
    }
}
