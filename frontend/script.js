let time = 25*60;   // 25 minutes in seconds
let timerRunning = false;

const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const circle = document.querySelector(".circle");
const totalTime = 25*60;
const resetBtn = document.getElementById("resetBtn");
const statusText = document.getElementById("status");

let interval;

startBtn.onclick = function () {

    if (timerRunning) return;

    timerRunning = true;
    statusText.innerText = "Focus session running...";

    interval = setInterval(() => {

        let minutes = Math.floor(time / 60);
        let seconds = time % 60;

        timerDisplay.innerText =
            `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

        time--;

        let progress = ((totalTime - time) / totalTime) * 100;

        circle.style.background = `conic-gradient(
            #60a5fa ${progress}%,
            #334155 ${progress}%
        )`;

        if (time < 0) {
            clearInterval(interval);

            timerDisplay.innerText = "Done!";
            statusText.innerText = "Session completed!";
            timerRunning = false;

            // Send session to backend
            fetch("http://127.0.0.1:8000/sessions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    duration_minutes: 25
                })
            })
            .then(res => res.json())
            .then(data => {
                console.log("Saved:", data);
                loadStats();
            });
        }
    }, 1000);
};

resetBtn.onclick = function () {

    clearInterval(interval);

    time = totalTime;
    timerRunning = false;

    timerDisplay.innerText = "25:00";
    statusText.innerText = "";

    circle.style.background = `conic-gradient(
        #60a5fa 0%,
        #334155 0%
    )`;
};

// Load stats when page opens
function loadStats() {

    fetch("http://127.0.0.1:8000/stats")
    .then(res => res.json())
    .then(data => {

        document.getElementById("totalMinutes").innerText = data.total_minutes;
        document.getElementById("totalSessions").innerText = data.total_sessions;

    });
}

loadStats();