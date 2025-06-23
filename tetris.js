const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const nextCanvas = document.getElementById('nextCanvas');
const nextCtx = nextCanvas.getContext('2d');

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

const COLORS = {
    I: '#00f0f0',
    O: '#f0f000',
    T: '#a000f0',
    S: '#00f000',
    Z: '#f00000',
    J: '#0000f0',
    L: '#f0a000'
};

const PIECES = {
    I: [[1, 1, 1, 1]],
    O: [[1, 1], [1, 1]],
    T: [[0, 1, 0], [1, 1, 1]],
    S: [[0, 1, 1], [1, 1, 0]],
    Z: [[1, 1, 0], [0, 1, 1]],
    J: [[1, 0, 0], [1, 1, 1]],
    L: [[0, 0, 1], [1, 1, 1]]
};

class Piece {
    constructor(type) {
        this.type = type;
        this.shape = PIECES[type];
        this.color = COLORS[type];
        this.x = Math.floor((COLS - this.shape[0].length) / 2);
        this.y = 0;
    }
    
    rotate() {
        const rows = this.shape.length;
        const cols = this.shape[0].length;
        const rotated = Array(cols).fill(null).map(() => Array(rows).fill(0));
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                rotated[col][rows - 1 - row] = this.shape[row][col];
            }
        }
        
        return rotated;
    }
}

class Tetris {
    constructor() {
        this.board = Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
        this.currentPiece = null;
        this.nextPiece = null;
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.dropInterval = 1000;
        this.lastDrop = 0;
        this.gameOver = false;
        this.isPaused = false;
        
        this.init();
    }
    
    init() {
        this.currentPiece = this.createPiece();
        this.nextPiece = this.createPiece();
        this.updateStats();
        this.gameLoop();
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
    }
    
    createPiece() {
        const types = Object.keys(PIECES);
        const type = types[Math.floor(Math.random() * types.length)];
        return new Piece(type);
    }
    
    gameLoop(timestamp = 0) {
        if (this.gameOver) return;
        
        const deltaTime = timestamp - this.lastDrop;
        
        if (deltaTime > this.dropInterval) {
            this.drop();
            this.lastDrop = timestamp;
        }
        
        this.draw();
        requestAnimationFrame(this.gameLoop.bind(this));
    }
    
    draw() {
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = '#222';
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                ctx.strokeRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
        
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                if (this.board[row][col]) {
                    this.drawBlock(col, row, this.board[row][col]);
                }
            }
        }
        
        if (this.currentPiece) {
            for (let row = 0; row < this.currentPiece.shape.length; row++) {
                for (let col = 0; col < this.currentPiece.shape[row].length; col++) {
                    if (this.currentPiece.shape[row][col]) {
                        this.drawBlock(
                            this.currentPiece.x + col,
                            this.currentPiece.y + row,
                            this.currentPiece.color
                        );
                    }
                }
            }
        }
        
        this.drawGhostPiece();
    }
    
    drawBlock(x, y, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        
        const gradient = ctx.createLinearGradient(
            x * BLOCK_SIZE,
            y * BLOCK_SIZE,
            (x + 1) * BLOCK_SIZE,
            (y + 1) * BLOCK_SIZE
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
        ctx.fillStyle = gradient;
        ctx.fillRect(x * BLOCK_SIZE + 2, y * BLOCK_SIZE + 2, BLOCK_SIZE - 4, BLOCK_SIZE - 4);
    }
    
    drawGhostPiece() {
        if (!this.currentPiece) return;
        
        let ghostY = this.currentPiece.y;
        while (this.isValidMove(this.currentPiece.x, ghostY + 1, this.currentPiece.shape)) {
            ghostY++;
        }
        
        ctx.globalAlpha = 0.3;
        for (let row = 0; row < this.currentPiece.shape.length; row++) {
            for (let col = 0; col < this.currentPiece.shape[row].length; col++) {
                if (this.currentPiece.shape[row][col]) {
                    this.drawBlock(
                        this.currentPiece.x + col,
                        ghostY + row,
                        this.currentPiece.color
                    );
                }
            }
        }
        ctx.globalAlpha = 1;
    }
    
    drawNextPiece() {
        nextCtx.fillStyle = '#0a0a0a';
        nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
        
        if (!this.nextPiece) return;
        
        const blockSize = 25;
        const offsetX = (nextCanvas.width - this.nextPiece.shape[0].length * blockSize) / 2;
        const offsetY = (nextCanvas.height - this.nextPiece.shape.length * blockSize) / 2;
        
        for (let row = 0; row < this.nextPiece.shape.length; row++) {
            for (let col = 0; col < this.nextPiece.shape[row].length; col++) {
                if (this.nextPiece.shape[row][col]) {
                    nextCtx.fillStyle = this.nextPiece.color;
                    nextCtx.fillRect(
                        offsetX + col * blockSize,
                        offsetY + row * blockSize,
                        blockSize,
                        blockSize
                    );
                    
                    nextCtx.strokeStyle = '#000';
                    nextCtx.lineWidth = 2;
                    nextCtx.strokeRect(
                        offsetX + col * blockSize,
                        offsetY + row * blockSize,
                        blockSize,
                        blockSize
                    );
                }
            }
        }
    }
    
    drop() {
        if (this.isValidMove(this.currentPiece.x, this.currentPiece.y + 1, this.currentPiece.shape)) {
            this.currentPiece.y++;
        } else {
            this.lock();
        }
    }
    
    hardDrop() {
        while (this.isValidMove(this.currentPiece.x, this.currentPiece.y + 1, this.currentPiece.shape)) {
            this.currentPiece.y++;
            this.score += 2;
        }
        this.lock();
        this.updateStats();
    }
    
    move(dir) {
        if (this.isValidMove(this.currentPiece.x + dir, this.currentPiece.y, this.currentPiece.shape)) {
            this.currentPiece.x += dir;
        }
    }
    
    rotatePiece() {
        const rotated = this.currentPiece.rotate();
        if (this.isValidMove(this.currentPiece.x, this.currentPiece.y, rotated)) {
            this.currentPiece.shape = rotated;
        } else {
            if (this.isValidMove(this.currentPiece.x - 1, this.currentPiece.y, rotated)) {
                this.currentPiece.x--;
                this.currentPiece.shape = rotated;
            } else if (this.isValidMove(this.currentPiece.x + 1, this.currentPiece.y, rotated)) {
                this.currentPiece.x++;
                this.currentPiece.shape = rotated;
            }
        }
    }
    
    isValidMove(x, y, shape) {
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const newX = x + col;
                    const newY = y + row;
                    
                    if (newX < 0 || newX >= COLS || newY >= ROWS) {
                        return false;
                    }
                    
                    if (newY >= 0 && this.board[newY][newX]) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    
    lock() {
        for (let row = 0; row < this.currentPiece.shape.length; row++) {
            for (let col = 0; col < this.currentPiece.shape[row].length; col++) {
                if (this.currentPiece.shape[row][col]) {
                    const y = this.currentPiece.y + row;
                    const x = this.currentPiece.x + col;
                    
                    if (y < 0) {
                        this.endGame();
                        return;
                    }
                    
                    this.board[y][x] = this.currentPiece.color;
                }
            }
        }
        
        this.clearLines();
        this.currentPiece = this.nextPiece;
        this.nextPiece = this.createPiece();
        this.drawNextPiece();
        
        if (!this.isValidMove(this.currentPiece.x, this.currentPiece.y, this.currentPiece.shape)) {
            this.endGame();
        }
    }
    
    clearLines() {
        let linesCleared = 0;
        
        for (let row = ROWS - 1; row >= 0; row--) {
            if (this.board[row].every(cell => cell !== 0)) {
                this.board.splice(row, 1);
                this.board.unshift(Array(COLS).fill(0));
                linesCleared++;
                row++;
            }
        }
        
        if (linesCleared > 0) {
            const points = [0, 100, 300, 500, 800];
            this.score += points[linesCleared] * this.level;
            this.lines += linesCleared;
            
            const newLevel = Math.floor(this.lines / 10) + 1;
            if (newLevel > this.level) {
                this.level = newLevel;
                this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100);
            }
            
            this.updateStats();
        }
    }
    
    updateStats() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        this.drawNextPiece();
    }
    
    endGame() {
        this.gameOver = true;
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOver').style.display = 'block';
    }
    
    handleKeyPress(e) {
        if (this.gameOver) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.move(-1);
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.move(1);
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.drop();
                this.score++;
                this.updateStats();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.rotatePiece();
                break;
            case ' ':
                e.preventDefault();
                this.hardDrop();
                break;
        }
    }
}

let game;

function restartGame() {
    document.getElementById('gameOver').style.display = 'none';
    game = new Tetris();
}

window.onload = () => {
    game = new Tetris();
};