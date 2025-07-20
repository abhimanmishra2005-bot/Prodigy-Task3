class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.gameMode = 'human'; // 'human' or 'ai'
        this.scores = { X: 0, O: 0, draw: 0 };
        
        this.winningConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];
        
        this.initializeGame();
    }
    
    initializeGame() {
        this.cells = document.querySelectorAll('.cell');
        this.currentPlayerElement = document.getElementById('current-player');
        this.winnerMessage = document.getElementById('winner-message');
        this.winnerText = document.getElementById('winner-text');
        this.resetGameBtn = document.getElementById('reset-game');
        this.resetScoresBtn = document.getElementById('reset-scores');
        this.playAgainBtn = document.getElementById('play-again');
        this.gameModeInputs = document.querySelectorAll('input[name="game-mode"]');
        
        this.scoreXElement = document.getElementById('score-x');
        this.scoreOElement = document.getElementById('score-o');
        this.scoreDrawElement = document.getElementById('score-draw');
        
        this.bindEvents();
        this.updateDisplay();
        this.loadScores();
    }
    
    bindEvents() {
        this.cells.forEach((cell, index) => {
            cell.addEventListener('click', () => this.handleCellClick(index));
        });
        
        this.resetGameBtn.addEventListener('click', () => this.resetGame());
        this.resetScoresBtn.addEventListener('click', () => this.resetScores());
        this.playAgainBtn.addEventListener('click', () => this.playAgain());
        
        this.gameModeInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                this.gameMode = e.target.value;
                this.resetGame();
            });
        });
    }
    
    handleCellClick(index) {
        if (!this.gameActive || this.board[index] !== '') {
            return;
        }
        
        this.makeMove(index, this.currentPlayer);
        
        if (this.gameActive && this.gameMode === 'ai' && this.currentPlayer === 'O') {
            setTimeout(() => this.makeAIMove(), 500);
        }
    }
    
    makeMove(index, player) {
        this.board[index] = player;
        this.cells[index].textContent = player;
        this.cells[index].classList.add(player.toLowerCase());
        
        if (this.checkWinner()) {
            this.endGame(`Player ${player} Wins!`);
            this.scores[player]++;
            this.updateScoreDisplay();
            this.saveScores();
        } else if (this.checkDraw()) {
            this.endGame("It's a Draw!");
            this.scores.draw++;
            this.updateScoreDisplay();
            this.saveScores();
        } else {
            this.switchPlayer();
        }
    }
    
    makeAIMove() {
        if (!this.gameActive) return;
        
        const bestMove = this.getBestMove();
        this.makeMove(bestMove, 'O');
    }
    
    getBestMove() {
        // Check if AI can win
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                this.board[i] = 'O';
                if (this.checkWinner()) {
                    this.board[i] = '';
                    return i;
                }
                this.board[i] = '';
            }
        }
        
        // Check if AI needs to block player
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                this.board[i] = 'X';
                if (this.checkWinner()) {
                    this.board[i] = '';
                    return i;
                }
                this.board[i] = '';
            }
        }
        
        // Take center if available
        if (this.board[4] === '') {
            return 4;
        }
        
        // Take corners
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(corner => this.board[corner] === '');
        if (availableCorners.length > 0) {
            return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }
        
        // Take any available space
        const availableMoves = this.board
            .map((cell, index) => cell === '' ? index : null)
            .filter(index => index !== null);
        
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
    
    checkWinner() {
        return this.winningConditions.some(condition => {
            const [a, b, c] = condition;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                this.highlightWinningCells(condition);
                return true;
            }
            return false;
        });
    }
    
    checkDraw() {
        return this.board.every(cell => cell !== '');
    }
    
    highlightWinningCells(winningCells) {
        winningCells.forEach(index => {
            this.cells[index].classList.add('winning');
        });
    }
    
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateDisplay();
    }
    
    updateDisplay() {
        if (this.gameMode === 'ai') {
            this.currentPlayerElement.textContent = 
                this.currentPlayer === 'X' ? "Your Turn" : "AI's Turn";
        } else {
            this.currentPlayerElement.textContent = `Player ${this.currentPlayer}'s Turn`;
        }
    }
    
    updateScoreDisplay() {
        this.scoreXElement.textContent = this.scores.X;
        this.scoreOElement.textContent = this.scores.O;
        this.scoreDrawElement.textContent = this.scores.draw;
    }
    
    endGame(message) {
        this.gameActive = false;
        this.winnerText.textContent = message;
        this.winnerMessage.style.display = 'flex';
    }
    
    resetGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winning');
        });
        
        this.updateDisplay();
        this.winnerMessage.style.display = 'none';
    }
    
    resetScores() {
        this.scores = { X: 0, O: 0, draw: 0 };
        this.updateScoreDisplay();
        this.saveScores();
    }
    
    playAgain() {
        this.resetGame();
    }
    
    saveScores() {
        // Note: In a real environment, you would use localStorage here
        // For this demo, scores are only maintained during the session
    }
    
    loadScores() {
        // Note: In a real environment, you would load from localStorage here
        this.updateScoreDisplay();
    }
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});

// Add some fun animations
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    container.style.opacity = '0';
    container.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        container.style.transition = 'all 0.5s ease';
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
    }, 100);
});
