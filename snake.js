const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

const box = 20;
const cols = canvas.width / box;
const rows = canvas.height / box;

let snake;
let food;

let score;
let gameOver;

let direction;
let nextDirection;

const moveDelay = 100;
let moveTimer = 0;
let lastTime = 0;

init();

function init() {
    score = 0;
    gameOver = false;

    direction = null;
    nextDirection = null;

    scoreElement.textContent = score;

    snake = [
        {
            x: 9,
            y: 10,
            drawX: 9 * box,
            drawY: 10 * box
        }
    ];

    spawnFood();
}

function spawnFood() {
    do {
        food = {
            x: Math.floor(Math.random() * cols),
            y: Math.floor(Math.random() * rows)
        };
    }
    while (
        snake.some(
            part =>
                part.x === food.x &&
                part.y === food.y
        )
    );
}

document.addEventListener("keydown", e => {
    if (gameOver) {
        if (e.key === "r" || e.key === "R") {
            init();
        }
        return;
    }

    if (
        (e.key === "ArrowLeft" || e.key === "a") &&
        direction !== "RIGHT"
    ) {
        nextDirection = "LEFT";
    }

    if (
        (e.key === "ArrowRight" || e.key === "d") &&
        direction !== "LEFT"
    ) {
        nextDirection = "RIGHT";
    }

    if (
        (e.key === "ArrowUp" || e.key === "w") &&
        direction !== "DOWN"
    ) {
        nextDirection = "UP";
    }

    if (
        (e.key === "ArrowDown" || e.key === "s") &&
        direction !== "UP"
    ) {
        nextDirection = "DOWN";
    }
});

function update(delta) {
    if (gameOver) {
        return;
    }

    moveTimer += delta;

    if (moveTimer < moveDelay) {
        return;
    }

    moveTimer = 0;

    if (nextDirection) {
        direction = nextDirection;
    }

    if (!direction) {
        return;
    }

    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === "LEFT") headX--;
    if (direction === "RIGHT") headX++;
    if (direction === "UP") headY--;
    if (direction === "DOWN") headY++;

    if (
        headX < 0 ||
        headY < 0 ||
        headX >= cols ||
        headY >= rows
    ) {
        finishGame();
        return;
    }

const body =
    snake.slice(
        0,
        headX === food.x &&
        headY === food.y
            ? snake.length
            : snake.length - 1
    );

if (
    body.some(
        part =>
            part.x === headX &&
            part.y === headY
    )
    ) {
        finishGame();
        return;
    }
    const newHead = {
        x: headX,
        y: headY,
        drawX: snake[0].drawX,
        drawY: snake[0].drawY
    };

    snake.unshift(newHead);

    if (
        headX === food.x &&
        headY === food.y
    ) {
        score++;
        scoreElement.textContent = score;

        spawnFood();
    }
    else {
        snake.pop();
    }
}

function finishGame() {
    gameOver = true;

    const currentUser =
        JSON.parse(
            localStorage.getItem(
                "currentUser"
            )
        );

    if (!currentUser) {
        return;
    }

    const users =
        JSON.parse(
            localStorage.getItem(
                "users"
            )
        ) || {};

    const user =
        users[currentUser.username];

    if (!user) {
        return;
    }

    if (score > user.highScore) {
        user.highScore = score;

        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );
    }
}

function drawSnakePart(x, y, head) {
    ctx.beginPath();

    if (ctx.roundRect) {
        ctx.roundRect(
            x + 1,
            y + 1,
            box - 2,
            box - 2,
            7
        );
    }
    else {
        ctx.rect(
            x + 1,
            y + 1,
            box - 2,
            box - 2
        );
    }

    ctx.fillStyle =
        head
            ? "rgb(0,140,58)"
            : "#4dff00";

    ctx.fill();
}

function drawFood() {
    ctx.beginPath();

    if (ctx.roundRect) {
        ctx.roundRect(
            food.x * box + 2,
            food.y * box + 2,
            box - 4,
            box - 4,
            7
        );
    }
    else {
        ctx.rect(
            food.x * box + 2,
            food.y * box + 2,
            box - 4,
            box - 4
        );
    }

    ctx.fillStyle = "#ff0066";
    ctx.fill();
}

function draw() {
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    for (const part of snake) {
        const targetX =
            part.x * box;

        const targetY =
            part.y * box;

        part.drawX +=
            (targetX - part.drawX)
            * 0.25;

        part.drawY +=
            (targetY - part.drawY)
            * 0.25;
    }

    drawFood();

    for (
        let i = snake.length - 1;
        i >= 0;
        i--
    ) {
        drawSnakePart(
            snake[i].drawX,
            snake[i].drawY,
            i === 0
        );
    }

    if (gameOver) {
        ctx.fillStyle =
            "rgba(0,0,0,0.6)";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        ctx.fillStyle =
            "white";

        ctx.font =
            "bold 30px sans-serif";

        ctx.textAlign =
            "center";

        ctx.fillText(
            "게임 오버!",
            canvas.width / 2,
            canvas.height / 2
        );

        ctx.font =
            "18px sans-serif";

        ctx.fillText(
            "R 키를 눌러 재시작",
            canvas.width / 2,
            canvas.height / 2 + 40
        );
    }
}

function loop(time) {
    const delta =
        time - lastTime;

    lastTime = time;

    update(delta);
    draw();

    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
