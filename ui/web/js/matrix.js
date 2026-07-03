/**
 * Cyber-Tactical Matrix Falling Rain Effect
 * Renders sparse, faint characters in the background matching the game theme.
 * Resolves HTML5 canvas alpha blending residue by doing complete clears and explicit trail math.
 */
export function initMatrixRain() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Match canvas size to browser viewport
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Chess coordinates, binary and tactical symbols
    const chars = "01WBEPKN+A1B5C3D7E8F2G4H6";
    const charArray = chars.split("");

    const fontSize = 28; // Large premium fonts
    const spacing = 120; // Sparse columns (unas pocas columns)
    let columns = Math.floor(canvas.width / spacing);

    // Initialize drops position and colors
    const drops = [];
    const columnColors = [];
    
    // Reset columns spacing if width changes
    window.addEventListener('resize', () => {
        columns = Math.floor(canvas.width / spacing);
        adjustDrops();
    });

    function adjustDrops() {
        for (let i = 0; i < columns; i++) {
            if (drops[i] === undefined) {
                // Stagger starting grid positions far off-screen
                drops[i] = -Math.random() * 40;
                // Assign a color randomly to match the title (50% white, 50% purple)
                columnColors[i] = Math.random() > 0.5 ? 'white' : 'purple';
            }
        }
    }
    adjustDrops();

    function draw() {
        // Complete clear of the viewport - guarantees 0% visual ghosting or remnants
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.font = '600 ' + fontSize + 'px "JetBrains Mono"';

        for (let i = 0; i < columns; i++) {
            const yHead = drops[i];

            // Render a trail of 8 fading characters behind the head
            const trailLength = 8;
            for (let j = 0; j < trailLength; j++) {
                const yChar = yHead - j;
                
                // Snap to discrete cell lines for a rigid terminal spec layout
                const gridY = Math.floor(yChar);
                const pixelY = gridY * fontSize;

                // Only render if visible on screen
                if (pixelY > 0 && pixelY < canvas.height + fontSize) {
                    // Decay opacity down the trail (Increased visibility by ~20%)
                    const alpha = (1 - (j / trailLength)) * 0.14;
                    
                    // Style matching either the white or purple title theme
                    if (columnColors[i] === 'white') {
                        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                    } else {
                        ctx.fillStyle = `rgba(221, 183, 255, ${alpha})`;
                    }

                    // Shimmer: randomize characters dynamically in the trail
                    const text = charArray[Math.floor(Math.random() * charArray.length)];
                    const pixelX = i * spacing;

                    ctx.fillText(text, pixelX, pixelY);
                }
            }

            // Move the drop slowly (approx. 3-4 grid cells per second)
            drops[i] += 0.12;

            // Reset logic when the whole trail goes off the screen
            const maxRows = canvas.height / fontSize;
            if (yHead - trailLength > maxRows) {
                // Reset to off-screen height to create a gap of silence
                drops[i] = -Math.random() * 30;
                // Randomize color again for the next spawn
                columnColors[i] = Math.random() > 0.5 ? 'white' : 'purple';
            }
        }
    }

    // Execute drawing loop (approx 30 FPS)
    setInterval(draw, 33);
}
