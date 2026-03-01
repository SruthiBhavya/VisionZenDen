function loadStats() {

    fetch("http://127.0.0.1:8000/stats")
    .then(res => res.json())
    .then(data => {

        document.getElementById("totalMinutes").innerText = data.total_minutes;
        document.getElementById("totalSessions").innerText = data.total_sessions;

        // Simple streak logic
        let streak = Math.floor(data.total_sessions / 2);

        document.getElementById("streak").innerText = streak;

        if (streak >= 3) {
            document.getElementById("fire").innerText = "🔥";
        }

        // -------------------------
        // Weekly Progress (NEW)
        // -------------------------

        let goal = 300; // 300 mins weekly goal (5 hours)

        let percent = (data.total_minutes / goal) * 100;
        if (percent > 100) percent = 100;

        document.getElementById("weeklyBar").style.width = percent + "%";

        document.getElementById("weeklyText").innerText =
            data.total_minutes + " / " + goal + " mins";

    });

}

loadStats();