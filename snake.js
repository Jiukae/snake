const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const box = 20;
let snake = [{ x: 9 * box, y: 10 * box }];
let direction = null;
let currentScore = 0;
let gameOver = false;
let speed = 3; // 속도 빠르게 (픽셀 단위)
let useButtonControls = false; // 버튼 모드 여부

let food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
};

document.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    else if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    else if (event.key === "a" && direction !== "RIGHT") direction = "LEFT";
    else if (event.key === "w" && direction !== "DOWN") direction = "UP";
    else if (event.key === "d" && direction !== "LEFT") direction = "RIGHT";
    else if (event.key === "s" && direction !== "UP") direction = "DOWN";

    if ((event.key === "r" || event.key === "R") && gameOver) {
        restartGame();
    }
});

function drawSnakePart(x, y, isHead = false) {
    ctx.beginPath();
    if (ctx.roundRect) {
        ctx.roundRect(x, y, box, box, 6);
    } else {
        const radius = 6;
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + box - radius, y);
        ctx.quadraticCurveTo(x + box, y, x + box, y + radius);
        ctx.lineTo(x + box, y + box - radius);
        ctx.quadraticCurveTo(x + box, y + box, x + box - radius, y + box);
        ctx.lineTo(x + radius, y + box);
        ctx.quadraticCurveTo(x, y + box, x, y + box - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
    }
    ctx.fillStyle = isHead ? "rgb(0, 140, 58)" : "#4dff00";
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 10;
    ctx.fill();
}

function drawFood(x, y) {
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x, y, box, box, 6) : ctx.fillRect(x, y, box, box);
    ctx.fillStyle = "#ff0066";
    ctx.shadowColor = "#ff0066";
    ctx.shadowBlur = 10;
    ctx.fill();
}

function update() {
    if (!gameOver && direction) {
        let snakeX = snake[0].x;
        let snakeY = snake[0].y;

        if (direction === "LEFT") snakeX -= speed;
        if (direction === "UP") snakeY -= speed;
        if (direction === "RIGHT") snakeX += speed;
        if (direction === "DOWN") snakeY += speed;

        // 먹이 충돌 체크
        if (
            snakeX < food.x + box &&
            snakeX + box > food.x &&
            snakeY < food.y + box &&
            snakeY + box > food.y
        ) {
            food = {
                x: Math.floor(Math.random() * 20) * box,
                y: Math.floor(Math.random() * 20) * box
            };
            currentScore += 1;
            scoreElement.textContent = currentScore;

            // 길이 더 늘리기: 먹을 때마다 3칸 추가
            for (let i = 0; i < 3; i++) {
                snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y });
            }
        } else {
            snake.pop();
        }

        const newHead = { x: snakeX, y: snakeY };

        if (
            snakeX < 0 || snakeY < 0 ||
            snakeX + box > canvas.width || snakeY + box > canvas.height ||
            snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
        ) {
            gameOver = true;
        }

        snake.unshift(newHead);
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        drawSnakePart(snake[i].x, snake[i].y, i === 0);
    }

    drawFood(food.x, food.y);

    if (gameOver) {
        ctx.fillStyle = "#ff0000";
        ctx.font = "bold 30px Pretendard";
        ctx.textAlign = "center";
        ctx.fillText("게임 오버!", canvas.width / 2, canvas.height / 2);
        ctx.fillStyle = "#0ff";
        ctx.font = "bold 20px Pretendard";
        ctx.fillText("R 키를 눌러 재시작", canvas.width / 2, canvas.height / 2 + 40);
    }
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

function restartGame() {
    snake = [{ x: 9 * box, y: 10 * box }];
    direction = null;
    currentScore = 0;
    scoreElement.textContent = currentScore;
    food = {
        x: Math.floor(Math.random() * 20) * box,
        y: Math.floor(Math.random() * 20) * box
    };
    gameOver = false;
}

// 🔹 스와이프 제스처 (누른 상태에서 연속 방향 변경 가능)
let startX, startY;
canvas.addEventListener("touchstart", e => {
    if (useButtonControls) return;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

canvas.addEventListener("touchmove", e => {
    if (useButtonControls) return;
    let moveX = e.touches[0].clientX;
    let moveY = e.touches[0].clientY;
    let dx = moveX - startX;
    let dy = moveY - startY;

    // 가로 움직임
    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 10 && direction !== "LEFT") direction = "RIGHT";   // 바로 반대(LEFT)만 막음
        else if (dx < -10 && direction !== "RIGHT") direction = "LEFT"; // 바로 반대(RIGHT)만 막음
    } 
    // 세로 움직임
    else {
        if (dy > 10 && direction !== "UP") direction = "DOWN";      // 바로 반대(UP)만 막음
        else if (dy < -10 && direction !== "DOWN") direction = "UP"; // 바로 반대(DOWN)만 막음
    }

    // 기준점 갱신 → 손가락을 누른 상태에서 연속적으로 방향 변경 가능
    startX = moveX;
    startY = moveY;
});


// 🔹 버튼 모드 토글
function toggleControls() {
    const controls = document.getElementById("mobile-controls");
    if (controls.style.display === "none") {
        controls.style.display = "flex";
        useButtonControls = true;
    } else {
        controls.style.display = "none";
        useButtonControls = false;
    }
}

loop();
