function Gameboard() {
    const rows = 3, columns = 3;
    const board = [];
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Gamefield());
        }
    }
    const getBoard = () => board;

    const resetBoard = () => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                board[i][j].addValue('');
            }
        }
    }
    const fillGameField = (player, row, column) => {
        // Convert row and column to 0-indexed
        row--;
        column--;

        if (row < 0 || row >= rows || column < 0 || column >= columns || board[row][column].getValue() !== '') {
            console.error("Invalid row or column");
            return false;
        }

        board[row][column].addValue(player);
        return true;
    }

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithCellValues);
    }

    const checkWinner = () => {
        // Check rows
        for (let i = 0; i < rows; i++) {
            if (board[i][0].getValue() !== '' && board[i][0].getValue() === board[i][1].getValue() && board[i][1].getValue() === board[i][2].getValue()) {
                return board[i][0];
            }
        }
        // Check columns
        for (let j = 0; j < columns; j++) {
            if (board[0][j].getValue() !== '' && board[0][j].getValue() === board[1][j].getValue() && board[1][j].getValue() === board[2][j].getValue()) {
                return board[0][j];
            }
        }
        // Check diagonals
        if (board[0][0].getValue() !== '' && board[0][0].getValue() === board[1][1].getValue() && board[1][1].getValue() === board[2][2].getValue()) {
            return board[0][0];
        }
        if (board[0][2].getValue() !== '' && board[0][2].getValue() === board[1][1].getValue() && board[1][1].getValue() === board[2][0].getValue()) {
            return board[0][2];
        }
        // No winner
        return null;
    }

    function checkTie() {
        let tieFLag = true;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j].getValue() === '') tieFLag=false;
            }
        }
        return tieFLag;

    }

    return {getBoard, fillGameField, printBoard, checkWinner, resetBoard, checkTie};
}

function Gamefield() {
    let value = '';
    const addValue = (player) => {
        if (value === '' || player==='') {
            value = player;
        }
    }
    const getValue = () => value;

    return {addValue, getValue};
}

function Player(name, value) {
    let score = 0;
    const getName = () => name;
    const getValue = () => value;
    const incrementScore = () => { score++; }
    const getScore = () => score;

    return {getName, getValue, incrementScore, getScore};
}

function Gamecontroller() {
    const board = Gameboard();
    const players = [Player(`${prompt('Enter player X name')}`, 'X'), Player(`${prompt('Enter player O name')}`, 'O')];
    let playerTurn = players[0];
    let header = document.querySelector('h1');
    header.textContent = `Its ${playerTurn.getName()}\'s turn`;
    const getPlayers = () => players;
    const getPlayerTurn = () => playerTurn;
    const switchTurn = () => {
        playerTurn = playerTurn === players[0] ? players[1] : players[0];
    }
    const play = (row, column) => {
        if (board.fillGameField(playerTurn.getValue(), row, column)) {
            let winner = board.checkWinner();
            if (winner) {
                header.textContent = `${playerTurn.getName()} wins! It\'s ${playerTurn.getName()}s turn`;
                playerTurn.incrementScore();
                updateScoreboard();
                board.resetBoard();
                return;
            }
            switchTurn();
            header.textContent = `Its ${playerTurn.getName()}\'s turn`;
            let tie = board.checkTie();
            if (tie) {
                header.textContent = `It\'s a tie! It\'s ${playerTurn.getName()}s turn`;
                board.resetBoard();
            }
        }
    };

    const updateScoreboard = () => {
        const scoreBoard = document.getElementById('scoreBoard');
        // scoreBoard.textContent = ''; // Clear existing scores

        const playersScores = document.querySelectorAll('.scoreBoardPlayerScore');
        playersScores.forEach((score, index) => {
            score.textContent = players[index].getScore();
        })
    }

    return {getPlayerTurn, switchTurn, play, getBoard: board.getBoard, fillGameField: board.fillGameField, getPlayers};
}

function Screencontroller() {
    const playGround = document.getElementById('gameWrapper');
    const gameController = Gamecontroller();
    const activePlayer = gameController.getPlayerTurn();

    const updateScreen = () => {
        playGround.textContent = '';
        let board = gameController.getBoard();

        board.forEach((row, rowIndex) => {
            row.forEach((gameField, colIndex) => {
                const gameFieldButton = document.createElement('button');
                gameFieldButton.classList.add('cell');
                gameFieldButton.textContent = gameField.getValue();
                gameFieldButton.dataset.row = rowIndex + 1; // Store row index
                gameFieldButton.dataset.col = colIndex + 1; // Store column index
                playGround.appendChild(gameFieldButton);
            });
        });

        // Add event listeners after creating buttons
        const gameFields = document.querySelectorAll('.cell');
        gameFields.forEach(cell => {
            cell.addEventListener('click', () => {
                const row = cell.dataset.row;
                const col = cell.dataset.col;
                gameController.play(row, col);
                updateScreen();
            });
        });
    };
    updateScreen();


    const InitializaScoreboard = () => {
        const scoreBoard = document.getElementById('scoreBoard');
        const players = gameController.getPlayers();

        const player1Span = document.createElement('span');
        player1Span.textContent = players[0].getName();
        player1Span.classList.add('scoreBoardPlayerName');
        scoreBoard.appendChild(player1Span);
        const player2Span = document.createElement('span');
        player2Span.textContent = players[1].getName();
        player2Span.classList.add('scoreBoardPlayerName');
        scoreBoard.appendChild(player2Span);

        const player1Score = document.createElement('span');
        player1Score.textContent = players[0].getScore();
        player1Score.classList.add('scoreBoardPlayerScore');
        scoreBoard.appendChild(player1Score);
        const player2Score = document.createElement('span');
        player2Score.textContent = players[1].getScore();
        player2Score.classList.add('scoreBoardPlayerScore');
        scoreBoard.appendChild(player2Score);
    }
    InitializaScoreboard();
}


Screencontroller();
