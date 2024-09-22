const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const playerSprite = document.getElementById('playerSprite');
const alienSprite = document.getElementById('alienSprite');
const pirateSprite = document.getElementById('pirateSprite');
const asteroidSprite = document.getElementById('asteroidSprite');

const MIN_SPEED = 2; // Minimum speed to ensure the ship can move

let player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 32, // Adjust based on your sprite size
    height: 32, // Adjust based on your sprite size
    speed: Math.max(MIN_SPEED, 5), // Ensure initial speed is at least MIN_SPEED
    minerals: 0,
    shipLevel: 1,
    health: 100,
    moveLeft: false,
    moveRight: false,
    moveUp: false,
    moveDown: false
};

let asteroids = [];
let pirates = [];
let aliens = [];

// Mobile control buttons
const upButton = document.getElementById('upButton');
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');
const downButton = document.getElementById('downButton');

// Mobile control event listeners
upButton.addEventListener('touchstart', () => player.moveUp = true);
upButton.addEventListener('touchend', () => player.moveUp = false);
leftButton.addEventListener('touchstart', () => player.moveLeft = true);
leftButton.addEventListener('touchend', () => player.moveLeft = false);
rightButton.addEventListener('touchstart', () => player.moveRight = true);
rightButton.addEventListener('touchend', () => player.moveRight = false);
downButton.addEventListener('touchstart', () => player.moveDown = true);
downButton.addEventListener('touchend', () => player.moveDown = false);

// Prevent default touch behavior to avoid scrolling
document.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

function createAsteroid() {
    return {
        x: Math.random() * canvas.width,
        y: 0,
        width: 30, // Adjust based on your sprite size
        height: 30, // Adjust based on your sprite size
        speed: Math.random() * 2 + 1
    };
}

function createPirate() {
    return {
        x: Math.random() * canvas.width,
        y: 0,
        width: 30, // Adjust based on your sprite size
        height: 30, // Adjust based on your sprite size
        speed: Math.random() * 3 + 2
    };
}

function createAlien() {
    return {
        x: Math.random() * canvas.width,
        y: 0,
        width: 40, // Adjust based on your sprite size
        height: 40, // Adjust based on your sprite size
        speed: Math.random() * 1.5 + 0.5
    };
}

function drawPlayer() {
    ctx.drawImage(playerSprite, player.x - player.width / 2, player.y - player.height / 2, player.width, player.height);
}

function drawAsteroids() {
    asteroids.forEach(asteroid => {
        ctx.drawImage(asteroidSprite, asteroid.x - asteroid.width / 2, asteroid.y - asteroid.height / 2, asteroid.width, asteroid.height);
    });
}

function drawPirates() {
    pirates.forEach(pirate => {
        ctx.drawImage(pirateSprite, pirate.x - pirate.width / 2, pirate.y - pirate.height / 2, pirate.width, pirate.height);
    });
}

function drawAliens() {
    aliens.forEach(alien => {
        ctx.drawImage(alienSprite, alien.x - alien.width / 2, alien.y - alien.height / 2, alien.width, alien.height);
    });
}

function movePlayer() {
    if (player.moveLeft) player.x -= player.speed;
    if (player.moveRight) player.x += player.speed;
    if (player.moveUp) player.y -= player.speed;
    if (player.moveDown) player.y += player.speed;

    player.x = Math.max(player.width / 2, Math.min(canvas.width - player.width / 2, player.x));
    player.y = Math.max(player.height / 2, Math.min(canvas.height - player.height / 2, player.y));
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    movePlayer();
    drawPlayer();

    if (Math.random() < 0.02) asteroids.push(createAsteroid());
    asteroids.forEach((asteroid, index) => {
        asteroid.y += asteroid.speed;
        if (asteroid.y > canvas.height) {
            asteroids.splice(index, 1);
        } else if (checkCollision(player, asteroid)) {
            player.minerals += Math.floor(asteroid.width);
            asteroids.splice(index, 1);
        }
    });
    drawAsteroids();

    if (Math.random() < 0.01) pirates.push(createPirate());
    pirates.forEach((pirate, index) => {
        pirate.y += pirate.speed;
        if (pirate.y > canvas.height) {
            pirates.splice(index, 1);
        } else if (checkCollision(player, pirate)) {
            player.health -= 10;
            pirates.splice(index, 1);
        }
    });
    drawPirates();

    if (Math.random() < 0.005) aliens.push(createAlien());
    aliens.forEach((alien, index) => {
        alien.y += alien.speed;
        if (alien.y > canvas.height) {
            aliens.splice(index, 1);
        } else if (checkCollision(player, alien)) {
            player.shipLevel += 1;
            player.speed = Math.max(MIN_SPEED, player.speed + 0.5); // Ensure speed doesn't go below MIN_SPEED
            aliens.splice(index, 1);
        }
    });
    drawAliens();

    document.getElementById('minerals').textContent = player.minerals;
    document.getElementById('shipLevel').textContent = player.shipLevel;
    document.getElementById('health').textContent = player.health;

    if (player.health <= 0) {
        alert('Game Over! You collected ' + player.minerals + ' minerals and reached ship level ' + player.shipLevel);
        resetGame();
    }

    requestAnimationFrame(updateGame);
}

function checkCollision(obj1, obj2) {
    let dx = obj1.x - obj2.x;
    let dy = obj1.y - obj2.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    return distance < (obj1.width / 2 + obj2.width / 2);
}

function resetGame() {
    player = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        width: 32, // Adjust based on your sprite size
        height: 32, // Adjust based on your sprite size
        speed: Math.max(MIN_SPEED, 5), // Ensure initial speed is at least MIN_SPEED
        minerals: 0,
        shipLevel: 1,
        health: 100,
        moveLeft: false,
        moveRight: false,
        moveUp: false,
        moveDown: false
    };
    asteroids = [];
    pirates = [];
    aliens = [];
}

document.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'ArrowLeft':
            player.moveLeft = true;
            break;
        case 'ArrowRight':
            player.moveRight = true;
            break;
        case 'ArrowUp':
            player.moveUp = true;
            break;
        case 'ArrowDown':
            player.moveDown = true;
            break;
    }
});

document.addEventListener('keyup', (event) => {
    switch(event.key) {
        case 'ArrowLeft':
            player.moveLeft = false;
            break;
        case 'ArrowRight':
            player.moveRight = false;
            break;
        case 'ArrowUp':
            player.moveUp = false;
            break;
        case 'ArrowDown':
            player.moveDown = false;
            break;
    }
});

updateGame();