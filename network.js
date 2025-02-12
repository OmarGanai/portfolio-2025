class NeuralViz {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.nodes = [];
        this.connections = [];
        this.animationFrame = null;
        this.isAnimating = false;

        // Create initial network
        this.initNetwork();
        
        // Add interaction
        this.canvas.addEventListener('click', this.handleClick.bind(this));
        
        // Start animation
        this.animate();
    }

    initNetwork() {
        // Create 12 nodes in a grid-like pattern
        const rows = 3;
        const cols = 4;
        const spacing = {
            x: this.canvas.width / (cols + 1),
            y: this.canvas.height / (rows + 1)
        };

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                this.nodes.push({
                    x: spacing.x * (col + 1),
                    y: spacing.y * (row + 1),
                    radius: 4,
                    activity: 0,
                    connections: []
                });
            }
        }

        // Create connections between nodes
        this.nodes.forEach((node, i) => {
            this.nodes.forEach((otherNode, j) => {
                if (i !== j && Math.random() < 0.3) {  // 30% chance of connection
                    this.connections.push({
                        from: node,
                        to: otherNode,
                        strength: Math.random() * 0.5
                    });
                    node.connections.push(otherNode);
                }
            });
        });
    }

    handleClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Find clicked node
        const clickedNode = this.nodes.find(node => {
            const dx = node.x - x;
            const dy = node.y - y;
            return Math.sqrt(dx * dx + dy * dy) < node.radius * 2;
        });

        if (clickedNode) {
            clickedNode.activity = 1;  // Activate node
            this.propagateActivity(clickedNode);
        }
    }

    propagateActivity(node, depth = 0) {
        if (depth > 3) return;  // Limit propagation depth

        node.connections.forEach(connectedNode => {
            connectedNode.activity = Math.max(
                connectedNode.activity,
                node.activity * 0.5  // Reduce activity as it propagates
            );
            this.propagateActivity(connectedNode, depth + 1);
        });
    }

    draw() {
        const { ctx, canvas } = this;
        
        // Clear canvas
        ctx.fillStyle = getComputedStyle(document.documentElement)
            .getPropertyValue('--color-light-accent');
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw connections
        this.connections.forEach(conn => {
            const gradient = ctx.createLinearGradient(
                conn.from.x, conn.from.y,
                conn.to.x, conn.to.y
            );
            
            const alpha = Math.max(conn.from.activity, conn.to.activity) * conn.strength;
            const color = getComputedStyle(document.documentElement)
                .getPropertyValue('--color-text');
            
            gradient.addColorStop(0, `${color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`);
            gradient.addColorStop(1, `${color}00`);
            
            ctx.beginPath();
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1;
            ctx.moveTo(conn.from.x, conn.from.y);
            ctx.lineTo(conn.to.x, conn.to.y);
            ctx.stroke();
        });

        // Draw nodes
        this.nodes.forEach(node => {
            ctx.beginPath();
            ctx.fillStyle = getComputedStyle(document.documentElement)
                .getPropertyValue('--color-text');
            ctx.globalAlpha = 0.3 + node.activity * 0.7;
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        });

        // Update node activity
        this.nodes.forEach(node => {
            node.activity *= 0.95;  // Decay activity
        });
    }

    animate() {
        this.draw();
        this.animationFrame = requestAnimationFrame(this.animate.bind(this));
    }

    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
} 