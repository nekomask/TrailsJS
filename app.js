/* Get canvas and its 2D context JS documentation on Canvas getContext:
        https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext */

        const canvas = document.getElementById("gameCanvas");
        const ctx = canvas.getContext("2d");

        /** Set grid size and tile count **/
        const gridSize = 20;
        const tileCountX = canvas.width / gridSize;
        const tileCountY = canvas.height / gridSize;
        //determines grid size of apple and snek && the tile units of space in which occupy the game canvas
        //tileCountX: The number of horizontal tiles (cells) in the grid of the game canvas.
        //tileCountY: The number of vertical tiles (cells) in the grid of the game canvas.



        const tileCount = canvas.width / gridSize;

        /* Initialize snake, velocity*/
        let snake = [{ x: 10, y: 10 }];
let compSnake = [{ x: 5, y: 15 }];

        // x and y: determine starting position of snake 

        let velocity = { x: 0, y: 0 };
        
// Initialize computer snake and its velocity

let compVelocity = { x: 1, y: 0 };
        //determines the starting x and y velocity of the snake, must be an integer to avoid collision issues 




        let gameStarted = false;
let gameOver = false;


        function renderTitleScreen() {
    ctx.fillStyle = "#fff";
    ctx.font = "30px Arial";
    ctx.fillText("Trails", canvas.width / 2 - 75, canvas.height / 2 - 30);
    ctx.font = "20px Arial";
    ctx.fillText("by Brandon Kiefer", canvas.width / 2 - 95, canvas.height / 2);
    ctx.font = "20px Arial";
    ctx.fillText("Press and hold arrow key to start the game", canvas.width / 2 - 135, canvas.height / 2 + 100);
}



        /*** Main game loop ***/
        function gameLoop() {
    if (!gameStarted) {
        renderTitleScreen();
    } else if (gameOver) { 
        renderGameOver();
    } else {
        updateGame();
        updateCompSnake();
        renderGame();
    }
    setTimeout(gameLoop, 1000 / 15); // 15 FPS
}





      // Update game state
      function updateGame() {
    // Calculate new head position
    const head = { ...snake[0] };
    head.x += velocity.x;
    head.y += velocity.y;

    // Check if snake hits the border or itself, and reset the game if it does
    if (head.x < 0 || head.y < 0 || head.x >= tileCountX || head.y >= tileCountY) {
        return resetGame();
    }

    for (const segment of snake.slice(1)) {
        if (head.x === segment.x && head.y === segment.y) {
            return resetGame();
        }
    }

    // Check if player snake hits the computer snake's trail
    for (const compSegment of compSnake) {
        if (head.x === compSegment.x && head.y === compSegment.y) {
            return resetGame();
        }
    }

    // Add new head to the snake
    snake.unshift(head);

}




function updateCompSnake() {
    // Only update the computer snake when the game is started
    if (!gameStarted) {
        return;
    }

    const compHead = { ...compSnake[0] };
    compHead.x += compVelocity.x;
    compHead.y += compVelocity.y;

    // Check if computer snake is about to collide with itself, canvas border, player trail or player's head
    if (
        isCollidingWithSnake(compSnake.slice(1), compHead) ||
        compHead.x < 0 ||
        compHead.y < 0 ||
        compHead.x >= tileCountX ||
        compHead.y >= tileCountY ||
        isCollidingWithSnake(snake, compHead)
    ) {
        turnCompSnake();
        return;
    }

    // Add new head to the computer snake
    compSnake.unshift(compHead);
}




function turnCompSnake() {
    const availableDirections = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 },
    ];

    // Remove opposite direction of the current velocity from availableDirections
    availableDirections.splice(
        availableDirections.findIndex(
            (dir) => dir.x === -compVelocity.x && dir.y === -compVelocity.y
        ),
        1
    );

    // Filter out directions that would lead to collisions
    const validDirections = availableDirections.filter((dir) => {
        const newCompHead = {
            x: compSnake[0].x + dir.x,
            y: compSnake[0].y + dir.y,
        };

        return (
            newCompHead.x >= 0 &&
            newCompHead.y >= 0 &&
            newCompHead.x < tileCountX &&
            newCompHead.y < tileCountY &&
            !isCollidingWithSnake(snake, newCompHead) &&
            !isCollidingWithSnake(compSnake.slice(1), newCompHead)
        );
    });

    // If there are valid directions, choose one at random
    if (validDirections.length > 0) {
        const randomIndex = Math.floor(Math.random() * validDirections.length);
        compVelocity = validDirections[randomIndex];
    } else {
        // If no valid directions are available, reset the game
        resetGame();
        return;
    }
}



function isCollidingWithSnake(targetSnake, position) {
  return targetSnake.some(
    (segment) => segment.x === position.x && segment.y === position.y
  );
}

function renderGameOver() {
    ctx.fillStyle = "#fff";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 75, canvas.height / 2 - 30);
    ctx.font = "20px Arial";
    ctx.fillText("Press and HOLD an arrow key to restart the game", canvas.width / 2 - 135, canvas.height / 2);
}

function resetGame() {
    gameOver = true; // Set gameOver to true
    renderGameOver(); // Call renderGameOver function here
}




// Render game state on the canvas
function renderGame() {
            // Clear canvas and set background color
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw player snake
            ctx.fillStyle = "#FFF";
            for (const segment of snake) {
                ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
            }

            // Draw computer snake
            ctx.fillStyle = "#00f";
            for (const segment of compSnake) {
                ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
            }

        }

        // Handle arrow key inputs for snake movement
        function handleKeydown(event) {
    const key = event.key;

    if (gameOver) { // condition to reset the game when gameOver is true
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
            snake = [{ x: 10, y: 10 }];
            compSnake = [{ x: 5, y: 15 }];
            velocity = { x: 0, y: 0 };
            compVelocity = { x: 1, y: 0 };
            gameOver = false;
            gameStarted = true;
        }
        return;
    }

    if (!gameStarted) {
        if (key === "ArrowUp") {
            gameStarted = true;
            velocity = { x: 0, y: -1 };
        }
        if (key === "ArrowDown") {
            gameStarted = true;
            velocity = { x: 0, y: 1 };
        }
        if (key === "ArrowLeft") {
            gameStarted = true;
            velocity = { x: -1, y: 0 };
        }
        if (key === "ArrowRight") {
            gameStarted = true;
            velocity = { x: 1, y: 0 };
        }
    } else {
        if (key === "ArrowUp" && velocity.y === 0) velocity = { x: 0, y: -1 };
        if (key === "ArrowDown" && velocity.y === 0) velocity = { x: 0, y: 1 };
        if (key === "ArrowLeft" && velocity.x === 0) velocity = { x: -1, y: 0 };
        if (key === "ArrowRight" && velocity.x === 0) velocity = { x: 1, y: 0 };
    }
}



        // Event listener for keydown events
        document.addEventListener("keydown", handleKeydown);


        // Start the game loop
        gameLoop();