const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const box = 20; // 한 칸 크기
let snake = [{x: 9 * box, y: 10 * box}]; // 뱀 시작 위치
let direction = null;
let currentScore = 0;
let gameOver = false;

// 먹이 위치
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

  // R 키로 재시작
  if ((event.key === "r" || event.key === "R") && gameOver) {
    restartGame();
  }
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 뱀 그리기
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "green" : "lime";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // 먹이 그리기
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  if (!gameOver) {
    // 뱀 머리 위치
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "LEFT" || direction === "a") snakeX -= box;
    if (direction === "UP" || direction === "w") snakeY -= box;
    if (direction === "RIGHT" || direction === "d") snakeX += box;
    if (direction === "DOWN" || direction === "s") snakeY += box;

    // 먹이를 먹었을 때
    if (snakeX === food.x && snakeY === food.y) {
      food = {
        x: Math.floor(Math.random() * 20) * box,
        y: Math.floor(Math.random() * 20) * box
      };
      currentScore += 1;
      scoreElement.textContent = currentScore;
    } else {
      snake.pop(); // 꼬리 제거
    }

    const newHead = {x: snakeX, y: snakeY};

    // 게임 오버 조건
    if (
      snakeX < 0 || snakeY < 0 ||
      snakeX >= canvas.width || snakeY >= canvas.height ||
      snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
    ) {
      gameOver = true;
    }

    snake.unshift(newHead);
  } else {
    // 게임 오버 메시지 표시
    ctx.fillStyle = "#ff0000";
    ctx.font = "bold 30px Pretendard";
    ctx.textAlign = "center";
    ctx.fillText("게임 오버!", canvas.width / 2, canvas.height / 2);
    ctx.fillStyle = "#0077ff";
    ctx.font = "bold 20px Pretendard";
    ctx.fillText("R 키를 눌러 재시작", canvas.width / 2, canvas.height / 2 + 40);
  }
}

function restartGame() {
  snake = [{x: 9 * box, y: 10 * box}];
  direction = null;
  currentScore = 0;
  scoreElement.textContent = currentScore;
  food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
  };
  gameOver = false;
}

const game = setInterval(draw, 100);