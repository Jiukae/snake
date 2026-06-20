const rankingList = document.getElementById("rankingList");

let scores =
    JSON.parse(localStorage.getItem("rankings")) || [];

if (scores.length === 0) {
    rankingList.innerHTML =
        "<p>아직 기록이 없습니다.</p>";
} else {
    scores.forEach((score, index) => {
        const div = document.createElement("div");
        div.className = "rank-item";
        div.textContent =
            `${index + 1}위 - ${score.name}: ${score.score}점`;
        rankingList.appendChild(div);
    });
}
