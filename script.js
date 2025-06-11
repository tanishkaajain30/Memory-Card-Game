const cards = document.querySelectorAll('.memory-card');
const timerElement = document.getElementById('timer');
const movesElement = document.getElementById('moves');
const restartButton = document.getElementById('restart');
const darkModeButton = document.getElementById('dark-mode-toggle');
const flipSound = new Audio('sounds/flip.mp3');
const matchSound = new Audio('sounds/match.mp3');
const winSound = new Audio('sounds/win.mp3');

let flippedCards = [];
let matchedCards = 0;
let moves = 0;
let timer;
let seconds = 0;
let gameStarted = false;

function startTimer() {
    timer = setInterval(() => {
        seconds++;
        timerElement.textContent = seconds;
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
    seconds = 0;
    timerElement.textContent = seconds;
}

function flipCard() {
    if(!gameStarted) {
        startTimer();
        gameStarted = true;
    }

    if(flippedCards.length < 2 && !this.classList.contains('flipped')) {
        this.classList.add('flipped');
        flippedCards.push(this);
        moves++;
        movesElement.textContent = moves;

        flipSound.play();

        if(flippedCards.length == 2) {
            checkForMatch();
        }
    }
}

function checkForMatch() {
    const [firstCard, secondCard] = flippedCards;

    if(firstCard.dataset.framework === secondCard.dataset.framework) {
        matchedCards += 2;
        flippedCards = [];
        matchSound.play();

        if(matchedCards == cards.length) {
            setTimeout(() => {
                clearInterval(timer);
                winSound.play();
                alert(`🎉 You win! Time: ${seconds}s, Moves: ${moves}`);
                triggerConfetti();
        }, 500);
    }
}
        else {
            setTimeout(() => {
                firstCard.classList.remove('flipped');
                secondCard.classList.remove('flipped');
                flippedCards = [];
            }, 1000)
        }
    }

function restartGame() {
    clearInterval(timer);
    seconds = 0;
    moves = 0;
    matchedCards = 0;
    gameStarted = false;
    timerElement.textContent = seconds;
    movesElement.textContent = moves;

    cards.forEach(card => {
        card.classList.remove('flipped');
    });

    shuffleCards();
}

function shuffleCards() {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 12);
        card.style.order = randomPos;
    });
}

darkModeButton.addEventListener('click', () => {
        document.body.classList.toggle('dark');
});

function triggerConfetti() {
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: {x:0}
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: {x:1}
        });

        if(Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
}

cards.forEach(card => card.addEventListener('click', flipCard));
restartButton.addEventListener('click', restartGame);

shuffleCards();