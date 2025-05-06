document.getElementById("submit_button").addEventListener("click", function () {
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirm-password").value.trim();
    const sex = document.getElementById("sex").value.trim();

    // 입력값 검증
    if (!username || !email || !password || !confirmPassword || !sex) {
        alert("모든 필드를 입력해주세요.");
        return;
    }

    if (password !== confirmPassword) {
        alert("비밀번호가 비밀번호 확인란과 다릅니다.");
        return;
    }

    if (!validateEmail(email)) {
        alert("유효한 이메일 주소를 입력해주세요.");
        return;
    }

    // 사용자 저장 시 중복 아이디 확인
    UserManager.saveUser(username, email, password, sex);
});

// 이메일 유효성 검사 함수
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 간단한 이메일 정규식
    return emailRegex.test(email);
}

// 사용자 관리 객체
const UserManager = {
    saveUser: async function (username, email, password, sex) {
        const encodePassword = await hashSHA256(password);

        const newUser = {
            username: username,
            email: email,
            password: encodePassword,
            sex: sex
        };

        // 기존 사용자 목록 가져오기 (없으면 빈 배열 생성)
        const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

        // 중복 아이디 확인
        if (existingUsers.some(user => user.username === username)) {
            alert("이미 존재하는 사용자입니다.");
            return false;
        }

        // 새로운 사용자 추가
        existingUsers.push(newUser);

        // 업데이트된 사용자 목록을 로컬 스토리지에 저장
        localStorage.setItem("users", JSON.stringify(existingUsers));
        console.log("사용자 정보가 저장되었습니다.");
    }
};

async function hashSHA256(message) {
    // TextEncoder를 사용해 문자열을 Uint8Array로 변환
    const encoder = new TextEncoder();
    const data = encoder.encode(message);

    // Web Crypto API를 사용해 SHA-256 해싱
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);

    // ArrayBuffer를 Base64 또는 Hex 문자열로 변환
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, "0")).join("");
    return hashHex; // Hex 형식 반환
}
