class PatternPredictor {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.sequence = [];
        this.userGuess = null;
        this.isWaiting = true;
        this.score = 0;
        this.shapes = ['circle', 'square', 'triangle'];
        this.colors = ['#4a9eff', '#ff4a4a', '#4aff4a'];
        
        // Initialize game
        this.generatePattern();
        
        // Add interaction
        this.canvas.addEventListener('click', this.handleClick.bind(this));
        
        // Start animation
        this.animate();
    }

    generatePattern() {
        this.sequence = [];
        const patternLength = Math.min(3 + Math.floor(this.score / 2), 6);
        
        // Simple patterns for now: alternate between shapes or colors
        const useShape = Math.random() > 0.5;
        const baseIndex = Math.floor(Math.random() * 3);
        
        for (let i = 0; i < patternLength; i++) {
            this.sequence.push({
                shape: useShape ? this.shapes[(baseIndex + i) % 3] : this.shapes[baseIndex],
                color: useShape ? this.colors[baseIndex] : this.colors[(baseIndex + i) % 3]
            });
        }
        
        this.isWaiting = true;
        this.userGuess = null;
    }

    handleClick(event) {
        if (!this.isWaiting) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Check which option was clicked
        const optionWidth = this.canvas.width / 3;
        const optionIndex = Math.floor(x / optionWidth);
        
        if (y > this.canvas.height * 0.6 && optionIndex >= 0 && optionIndex < 3) {
            this.userGuess = optionIndex;
            this.checkGuess();
        }
    }

    checkGuess() {
        const nextInSequence = {
            shape: this.shapes[(this.sequence[0].shape + 1) % 3],
            color: this.colors[(this.sequence[0].color + 1) % 3]
        };
        
        if (this.userGuess === nextInSequence) {
            this.score++;
        } else {
            this.score = Math.max(0, this.score - 1);
        }
        
        setTimeout(() => this.generatePattern(), 1000);
    }

    drawShape(shape, color, x, y, size) {
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = color;
        
        switch (shape) {
            case 'circle':
                this.ctx.beginPath();
                this.ctx.arc(x, y, size/2, 0, Math.PI * 2);
                this.ctx.fill();
                break;
            case 'square':
                this.ctx.fillRect(x - size/2, y - size/2, size, size);
                break;
            case 'triangle':
                this.ctx.beginPath();
                this.ctx.moveTo(x, y - size/2);
                this.ctx.lineTo(x + size/2, y + size/2);
                this.ctx.lineTo(x - size/2, y + size/2);
                this.ctx.closePath();
                this.ctx.fill();
                break;
        }
    }

    draw() {
        const { ctx, canvas } = this;
        
        // Clear canvas
        ctx.fillStyle = getComputedStyle(document.documentElement)
            .getPropertyValue('--color-light-accent');
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw sequence
        const itemWidth = canvas.width / (this.sequence.length + 1);
        const y = canvas.height * 0.3;
        
        this.sequence.forEach((item, i) => {
            this.drawShape(
                item.shape,
                item.color,
                itemWidth * (i + 1),
                y,
                20
            );
        });
        
        // Draw question mark
        ctx.fillStyle = getComputedStyle(document.documentElement)
            .getPropertyValue('--color-text');
        ctx.font = '20px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('?', itemWidth * (this.sequence.length + 1), y);
        
        // Draw options
        if (this.isWaiting) {
            const optionWidth = canvas.width / 3;
            const optionY = canvas.height * 0.8;
            
            this.shapes.forEach((shape, i) => {
                this.drawShape(
                    shape,
                    this.colors[i],
                    optionWidth * (i + 0.5),
                    optionY,
                    24
                );
            });
        }
        
        // Draw score
        ctx.fillStyle = getComputedStyle(document.documentElement)
            .getPropertyValue('--color-text');
        ctx.font = '14px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`Score: ${this.score}`, 10, 20);
    }

    animate() {
        this.draw();
        requestAnimationFrame(this.animate.bind(this));
    }
} 