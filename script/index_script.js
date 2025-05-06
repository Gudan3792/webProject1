document.getElementById("loginButton").addEventListener("click", async function () {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const E_pass = await hashSHA256(password);
  // 로컬 스토리지에서 사용자 목록 가져오기
  const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

  // 입력된 아이디와 비밀번호가 일치하는 사용자를 찾기
  const user = existingUsers.find(user => user.username === username && user.password === E_pass);

  if (user) {
      // 로그인 성공 시 사용자 이름을 URL 파라미터로 전달
      alert("로그인 성공!");
      window.location.href = `func_page.html?username=${encodeURIComponent(username)}`;
  } else {
      // 로그인 실패 시 알림
      alert("아이디 또는 비밀번호가 잘못되었습니다.");
  }
});

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
