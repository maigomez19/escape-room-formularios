let currentQuestion = 0;
let interval;
let startTime;
let penalizaciones = 0;
const tiempoInicial = 300; // 5 minutos en segundos

window.onload = () => {
    startTime = new Date();
    startTimer();
    showQuestion();
};

function startTimer() {
    interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now - startTime) / 1000);
        let tiempoRestante = tiempoInicial - elapsed - penalizaciones;

        if(tiempoRestante < 0) {
            tiempoRestante = 0;
        }

        const minutes = String(Math.floor(tiempoRestante / 60)).padStart(2, "0");
        const seconds = String(tiempoRestante % 60).padStart(2, "0");
        document.getElementById("timer").textContent = `Tiempo restante: ${minutes}:${seconds}`;

        if (tiempoRestante <= 0) {
            clearInterval(interval);
            endGame(false);
        }
    }, 1000);
}

function showQuestion() {
  const container = document.getElementById("game-container");
  const q = questions[currentQuestion];

  container.innerHTML = `
        <h2>${q.question}</h2>
        ${q.options
        .map(
            (opt) =>
            `<button onclick="checkAnswer('${opt.replace(/'/g, "\\'").replace(/"/g, '\\"')}')">${opt}</button>`
        )
        .join("")}
    `;

    document.getElementById("message").className = "desaparecer";
}

function checkAnswer(selected) {
    const correct = questions[currentQuestion].answer;

    if (selected === correct) {
        document.getElementById("message").textContent = "¡Respuesta correcta!";
        document.getElementById("message").className = "correct";
        currentQuestion++;

        if (currentQuestion < questions.length) {

            setTimeout(showQuestion, 1000);

        } else {

            clearInterval(interval);
            const now = new Date();
            const duracionReal = Math.floor((now - startTime) / 1000) + penalizaciones;
            const minutes = Math.floor(duracionReal / 60);
            const seconds = duracionReal % 60;

            document.getElementById("game-container").innerHTML = `<div class="juego-ganado"><h2>¡Felicitaciones!</h2><p>Lograste resolver el juego en ${minutes} minutos y ${seconds} segundos.</p></div>`;
            document.getElementById("message").className = "desaparecer";
        }

    } else {

        penalizaciones += 15;

        document.getElementById("message").textContent = "Respuesta incorrecta (-15 segundos).";
        document.getElementById("message").className = "incorrect";
    }
}

function endGame(won) {
    document.getElementById("game-container").innerHTML = won
        ? "<div class='juego-ganado'><h2>¡Ganaste!</h2></div>"
        : "<div class='juego-perdido'><h2>GAME OVER</h2><p>¡Te quedaste sin tiempo!</p></div>";

    document.getElementById("message").className = "desaparecer";
}