const username = document.getElementById("username");
const password = document.getElementById("password");
const msg = document.getElementById("msg");

document.getElementById("registerBtn").addEventListener("click", register);
document.getElementById("loginBtn").addEventListener("click", login);

function register() {
    const id = username.value.trim();
    const pw = password.value;

    if (!id || !pw) {
        msg.textContent = "아이디와 비밀번호를 입력하세요.";
        return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "{}");

    if (users[id]) {
        msg.textContent = "이미 존재하는 아이디입니다.";
        return;
    }

    users[id] = {
        password: pw,
        coins: 0
    };

    localStorage.setItem("users", JSON.stringify(users));

    msg.textContent = "회원가입 완료!";
}

function login() {
    const id = username.value.trim();
    const pw = password.value;

    const users = JSON.parse(localStorage.getItem("users") || "{}");

    if (users[id] && users[id].password === pw) {
        localStorage.setItem("currentUser", id);
        location.href = "index.html";
    } else {
        msg.textContent = "아이디 또는 비밀번호가 틀렸습니다.";
    }
}
