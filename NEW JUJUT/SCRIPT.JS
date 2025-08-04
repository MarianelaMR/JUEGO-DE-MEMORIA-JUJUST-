document.addEventListener('DOMContentLoaded', () => {
    // --- Referencias a los elementos del HTML ---
    const gameBoard = document.getElementById('game-board');
    const timerElement = document.getElementById('timer');
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modal-image');
    const restartButton = document.getElementById('restart-button');

    // ===================================================================
    //           ¡PERSONALIZA TU JUEGO AQUÍ!
    // ===================================================================

    // PASO 1: Escribe los nombres de tus 8 imágenes para las cartas.
    // Deben estar en una carpeta llamada "img".
    const cardImages = [
        'imagen1.jpg', 
        'imagen2.png', 
        'imagen3.webp',
        'imagen4.jpg', 
        'imagen5.gif', 
        'imagen6.jpg', 
        'imagen7.png', 
        'imagen8.jpg' 
    ];

    // PASO 2: Escribe el nombre de la imagen para el REVERSO de las cartas.
    const backImage = 'reverso.png';

    // PASO 3: Escribe los nombres de las imágenes para VICTORIA y DERROTA.
    const victoryImage = 'victoria.gif';
    const defeatImage = 'derrota.gif';

    // ===================================================================

    // --- Configuración y estado del juego ---
    const totalTime = 60; // Tiempo en segundos
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false; // Bloquea el tablero para evitar más de 2 clics
    let matchedPairs = 0;
    let timer;
    let timeLeft = totalTime;

    // --- Funciones del juego ---

    // Función para iniciar o reiniciar el juego
    function initGame() {
        // Reiniciar todas las variables
        matchedPairs = 0;
        lockBoard = false;
        firstCard = null;
        secondCard = null;
        gameBoard.innerHTML = ''; // Limpiar el tablero
        modal.classList.remove('visible'); // Ocultar modal

        // Duplicar y barajar el array de imágenes
        let shuffledCards = [...cardImages, ...cardImages]
            .sort(() => 0.5 - Math.random());

        // Crear cada carta en el HTML
        shuffledCards.forEach(imageName => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.name = imageName.split('.')[0]; // Identificador único

            cardElement.innerHTML = `
                <div class="card-face card-back">
                    <img src="img/${backImage}" alt="Reverso">
                </div>
                <div class="card-face card-front">
                    <img src="img/${imageName}" alt="Carta">
                </div>
            `;
            gameBoard.appendChild(cardElement);
            cardElement.addEventListener('click', handleCardClick);
        });

        startTimer();
    }

    // Maneja el evento de clic en una carta
    function handleCardClick() {
        if (lockBoard || this.classList.contains('matched') || this === firstCard) {
            return; // No hacer nada si el tablero está bloqueado o la carta ya fue clickeada/emparejada
        }

        this.classList.add('flipped');

        if (!firstCard) {
            firstCard = this; // Guardar la primera carta
            return;
        }

        secondCard = this; // Guardar la segunda carta
        lockBoard = true; // Bloquear el tablero
        checkForMatch();
    }

    // Comprueba si las dos cartas seleccionadas son iguales
    function checkForMatch() {
        const isMatch = firstCard.dataset.name === secondCard.dataset.name;
        isMatch ? disableMatchedCards() : unflipCards();
    }

    // Si las cartas coinciden, las desactiva
    function disableMatchedCards() {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        matchedPairs++;
        resetBoard();
        if (matchedPairs === cardImages.length) {
            endGame(true); // Se encontraron todos los pares: victoria
        }
    }

    // Si las cartas no coinciden, las voltea de nuevo
    function unflipCards() {
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 1200); // Espera 1.2 segundos antes de voltearlas
    }

    // Limpia las variables de selección y desbloquea el tablero
    function resetBoard() {
        [firstCard, secondCard, lockBoard] = [null, null, false];
    }

    // Inicia y controla el temporizador
    function startTimer() {
        timeLeft = totalTime;
        timerElement.textContent = `Tiempo: ${timeLeft}`;
        clearInterval(timer); // Reiniciar el intervalo si ya existe
        timer = setInterval(() => {
            timeLeft--;
            timerElement.textContent = `Tiempo: ${timeLeft}`;
            if (timeLeft <= 0) {
                endGame(false); // Se acabó el tiempo: derrota
            }
        }, 1000);
    }

    // Termina el juego y muestra el resultado
    function endGame(isWinner) {
        clearInterval(timer);
        setTimeout(() => {
            modal.classList.add('visible');
            modalImage.src = isWinner ? `img/${victoryImage}` : `img/${defeatImage}`;
        }, 500);
    }

    // --- Eventos ---
    restartButton.addEventListener('click', initGame);

    // --- Iniciar el juego por primera vez ---
    initGame();
});