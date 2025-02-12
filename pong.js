class Pong {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Colors
        this.backgroundColor = '#FFFFFF';  // White
        this.foregroundColor = '#1A1A1A';  // Almost black
        this.messageColor = '#6E6E6E';  // Use muted color for messages
        
        // Game objects
        this.ball = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            size: 4,
            dx: 1.5,
            dy: 1.5
        };
        
        this.paddle = {
            width: 4,
            height: 30,
            y: canvas.height / 2 - 15
        };
        
        this.aiPaddle = {
            width: 4,
            height: 30,
            y: canvas.height / 2 - 15
        };

        // Set paddle positions
        this.paddle.x = 10;
        this.aiPaddle.x = canvas.width - 14;
        
        // Add randomness to AI
        this.aiPaddleSpeed = 1.5;
        this.aiReactionDelay = 0;
        this.aiErrorMargin = 15;
        
        // Add scoring
        this.playerScore = 0;
        this.aiScore = 0;
        this.winningScore = 5;
        this.message = 'Click to Play';
        this.messageTimeout = null;
        
        // Add game state
        this.isPaused = true;
        
        // Start game loop
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('click', () => {
            this.isPaused = !this.isPaused;
            if (this.isPaused) {
                this.message = 'Paused';
            } else {
                this.message = '';
            }
        });
        this.gameLoop();
    }
    
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseY = e.clientY - rect.top;
        this.paddle.y = Math.min(Math.max(mouseY - this.paddle.height / 2, 0), 
                                this.canvas.height - this.paddle.height);
    }
    
    update() {
        if (this.isPaused) return;  // Don't update if paused
        
        // Move ball
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;
        
        // Ball collision with top and bottom
        if (this.ball.y <= 0 || this.ball.y >= this.canvas.height) {
            this.ball.dy *= -1;
        }
        
        // Ball collision with paddles
        if (this.checkPaddleCollision(this.paddle) || 
            this.checkPaddleCollision(this.aiPaddle)) {
            this.ball.dx *= -1;
        }
        
        // Reset ball if it goes past paddles
        if (this.ball.x < 0) {
            this.aiScore++;
            this.showMessage('AI scores!');
            if (this.aiScore >= this.winningScore) {
                this.showMessage('Game Over - AI wins!');
                this.resetGame();
            }
            this.resetBall();
        } else if (this.ball.x > this.canvas.width) {
            this.playerScore++;
            this.showMessage('You score!');
            if (this.playerScore >= this.winningScore) {
                this.showMessage('You win!');
                this.resetGame();
            }
            this.resetBall();
        }
        
        // More human-like AI
        const aiCenter = this.aiPaddle.y + this.aiPaddle.height / 2;
        
        // Add random delay to AI reactions
        if (Math.random() < 0.02) {
            this.aiReactionDelay = Math.random() * 10;
        }
        
        // Add random error to AI target position
        const targetY = this.ball.y + (Math.random() - 0.5) * this.aiErrorMargin;
        
        if (this.aiReactionDelay <= 0) {
            if (aiCenter < targetY - 10) {
                this.aiPaddle.y += this.aiPaddleSpeed;
            } else if (aiCenter > targetY + 10) {
                this.aiPaddle.y -= this.aiPaddleSpeed;
            }
        } else {
            this.aiReactionDelay--;
        }
    }
    
    checkPaddleCollision(paddle) {
        return this.ball.x + this.ball.size > paddle.x && 
               this.ball.x < paddle.x + paddle.width &&
               this.ball.y + this.ball.size > paddle.y && 
               this.ball.y < paddle.y + paddle.height;
    }
    
    resetBall() {
        this.ball.x = this.canvas.width / 2;
        this.ball.y = this.canvas.height / 2;
        this.ball.dx *= -1;  // Change direction after point
    }
    
    resetGame() {
        this.playerScore = 0;
        this.aiScore = 0;
        setTimeout(() => this.resetBall(), 1500);  // Brief pause before new game
    }
    
    showMessage(text) {
        this.message = text;
        clearTimeout(this.messageTimeout);
        this.messageTimeout = setTimeout(() => {
            this.message = '';
        }, 1500);  // Message disappears after 1.5 seconds
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw ball and paddles
        this.ctx.fillStyle = this.foregroundColor;
        this.ctx.fillRect(this.ball.x, this.ball.y, this.ball.size, this.ball.size);
        this.ctx.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
        this.ctx.fillRect(this.aiPaddle.x, this.aiPaddle.y, this.aiPaddle.width, this.aiPaddle.height);
        
        // Draw scores and messages
        this.ctx.fillStyle = this.messageColor;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.font = '16px system-ui, -apple-system, sans-serif';  // Use system font
        this.ctx.imageSmoothingEnabled = true;  // Enable anti-aliasing
        this.ctx.imageSmoothingQuality = 'high';
        
        // Draw pause/play message
        if (this.isPaused) {
            this.ctx.fillText(this.message, this.canvas.width / 2, this.canvas.height / 2);
        } else if (this.message) {
            this.ctx.fillText(this.message, this.canvas.width / 2, 20);
        }
        
        // Draw scores
        this.ctx.font = '16px system-ui, -apple-system, sans-serif';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(this.playerScore, 20, 20);
        this.ctx.textAlign = 'right';
        this.ctx.fillText(this.aiScore, this.canvas.width - 20, 20);
    }
    
    gameLoop = () => {
        this.update();
        this.draw();
        requestAnimationFrame(this.gameLoop);
    }
}

// Initialize game when document loads
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('pongCanvas');
    if (canvas) {
        new Pong(canvas);
    }
}); 