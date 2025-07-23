const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let marioImg = new Image();
marioImg.src = '/static/mario.png';

const gravity = 0.5;
let keys = {};

let player = {
    x: 100,
    y: 0,
    width: 40,
    height: 50,
    velocityX: 0,
    velocityY: 0,
    onGround: false
};

let platforms = [
    { x: 0, y: 350, width: 800, height: 50 },
    { x: 150, y: 300, width: 100, height: 10 },
    { x: 300, y: 250, width: 100, height: 10 },
    { x: 500, y: 200, width: 100, height: 10 },
    { x: 700, y: 150, width: 50, height: 10 },
];

function drawPlayer() {
    ctx.drawImage(marioImg, player.x, player.y, player.width, player.height);
}

function drawPlatforms() {
    ctx.fillStyle = "#654321";
    platforms.forEach(p => {
        ctx.fillRect(p.x, p.y, p.width, p.height);
    });
}

function update() {
    // Movement
    if (keys['ArrowLeft']) player.velocityX = -8;
    else if (keys['ArrowRight']) player.velocityX = 10;
    else player.velocityX = 0;

    if (keys['Space'] && player.onGround) {
        player.velocityY = -10;
        player.onGround = false;
    }

    // Apply gravity
    player.velocityY += gravity;
    player.x += player.velocityX;
    player.y += player.velocityY;

    // Collision with platforms
    player.onGround = false;
    platforms.forEach(p => {
        if (player.x < p.x + p.width &&
            player.x + player.width > p.x &&
            player.y < p.y + p.height &&
            player.y + player.height > p.y) {

            if (player.velocityY > 0) { // falling
                player.y = p.y - player.height;
                player.velocityY = 0;
                player.onGround = true;
            }
        }
    });

    // Win condition
    if (player.x > 750 && player.y < 150) {
        alert("🎉 You Win!");
        document.location.reload();
    }

    // Keep within canvas
    if (player.y > 400) player.y = 0;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlatforms();
    drawPlayer();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (e) => {
    if (e.code === "Space" || e.key === " ") {
        e.preventDefault(); // prevent scroll
        keys["Space"] = true;
    } else {
        keys[e.key] = true;
    }
});

document.addEventListener("keyup", (e) => {
    if (e.code === "Space" || e.key === " ") {
        keys["Space"] = false;
    } else {
        keys[e.key] = false;
    }
});


marioImg.onload = () => {
    gameLoop();
};
