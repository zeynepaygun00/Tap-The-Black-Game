//since you said that you can add extras we added 2 features the point bar changes color as it decreases, and the timer turns red in the last 3 seconds.

// Game state and score variables


let score = 0, 
timeLeft = 10,
currentPoints = 10,
gameActive = false,
firstTapDone = false, 
pointInterval, 
gameTimer;

// Gets the highest score from the  storage

function getHiScore() {
    var score = localStorage.getItem("tileGameHiScore");
    if (score == null) return 0;
    return parseInt(score);
}

document.getElementById("hi-score").innerText = getHiScore()

// Starts the game when the screen is clicked

function startApp() {
    var cover = document.getElementById("cover-page");

    
   
        document.removeEventListener("click", startApp);
        runCountdown();
    
}

document.addEventListener("click", startApp);


// Shows a countdown before the game starts

function runCountdown() {
    var cover = document.getElementById("cover-page");
    var countdownScreen = document.getElementById("countdown-screen");
    var text = document.getElementById("countdown-text");

   
    if (cover.className.indexOf("hidden") === -1) {
        cover.className = cover.className + " hidden";
    }

    if (countdownScreen.className.indexOf("hidden") !== -1) {
    countdownScreen.className = "screen";
    }


    var count = 3;

    var cd = setInterval(function () {
        count--;

        if (count > 0) {
            text.innerText = count;
        } else {
            clearInterval(cd);
            initGame();
        }
    }, 1000);
}
// Initializes the game and creates the tiles

function initGame() {
    var countdownScreen = document.getElementById("countdown-screen");
    var gameScreen = document.getElementById("game-screen");
    var container = document.getElementById("grid-container");

    
    if (countdownScreen.className.indexOf("hidden") === -1) {
        countdownScreen.className = countdownScreen.className + " hidden";
    }

   
    if (gameScreen.className.indexOf("hidden") !== -1) {
    gameScreen.className = "screen";
}


    gameActive = true;

  
    container.innerHTML = "";

    
    for (var i = 0; i < 16; i++) {
        container.innerHTML = container.innerHTML +
            '<div class="tile" onclick="handleTileClick(this)"></div>';
    }

    spawnTiles(3);
    startTimers();
}

// Randomly adds black tiles to the grid

function spawnTiles(count) {
    const tiles = document.querySelectorAll(".tile");
    const available = Array.from(tiles).filter(t => !t.classList.contains("black") && !t.classList.contains("green-feedback"));
    
    let added = 0;
    while (added < count && available.length > 0) {
        let r = Math.floor(Math.random() * available.length);
        available[r].classList.add("black");
        available.splice(r, 1);
        added++;
    }
}
// Handles clicking on a black tile and updates the score

function handleTileClick(tile) {
    if (!gameActive || !tile.classList.contains("black")) return;
    if (!firstTapDone) { document.getElementById("game-instruction").style.opacity = "0"; firstTapDone = true; }
    
    score += currentPoints;
    document.getElementById("current-score").innerText = score;
    
    tile.classList.remove("black");
    tile.classList.add("green-feedback");
    tile.innerText = "+" + currentPoints;
    
    setTimeout(() => { 
        tile.classList.add("fade-out");
        setTimeout(() => {
            tile.classList.remove("green-feedback", "fade-out"); 
            tile.innerText = ""; 
            if (gameActive) spawnTiles(1); 
        }, 500);
    }, 300);
    resetPointBar();
}

function resetPointBar() {
    clearInterval(pointInterval);
    currentPoints = 10;
    const bar = document.getElementById("point-bar");
    bar.style.width = "100%";
    bar.style.backgroundColor = "#2ecc71";
    pointInterval = setInterval(() => {
        currentPoints--;
        bar.style.width = (currentPoints * 10) + "%";
        if (currentPoints > 6) bar.style.backgroundColor = "#2ecc71";
        else if (currentPoints > 3) bar.style.backgroundColor = "#f1c40f";
        else bar.style.backgroundColor = "#e74c3c";
        if (currentPoints <= 0) clearInterval(pointInterval);
    }, 100);
}
// Starts the main game timer

function startTimers() {
    gameTimer = setInterval(() => {
        timeLeft--;
        const timerEl = document.getElementById("timer");
        timerEl.innerText = timeLeft;
        if (timeLeft <= 3) timerEl.style.color = "#e74c3c"; 
        if (timeLeft <= 0) finalizeGame();
    }, 1000);
    resetPointBar();
}
// Ends the game and shows the result screen

function finalizeGame() {
    gameActive = false;
    clearInterval(gameTimer);
    clearInterval(pointInterval);
    
    const resultOverlay = document.getElementById("result-overlay");
    const status = document.getElementById("status-message");
    const f5Msg = document.getElementById("f5-msg");
    
    resultOverlay.classList.remove("hidden");
    f5Msg.classList.remove("hidden");
    
    const currentHi = getHiScore();
    if (score > currentHi) {
        localStorage.setItem("tileGameHiScore", score);
        document.getElementById("hi-score").innerText = score; 
        status.innerText = "New Hiscore WOW!!!!!!!!";
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    } else {
        status.innerText = "Time is up!!!";
        status.style.color = "#e74c3c";
    }
}