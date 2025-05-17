const backendURL = "http://localhost:3000";

document.getElementById("authForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const form = new FormData(e.target);
    const action = e.submitter.value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (action === "login") {
      try {
        const res = await fetch(`${backendURL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: username, password }) 
        });

        if (!res.ok) {
          const errorText = await res.json();
          alert("Login gagal: " + errorText.message);
          return;
        }

        const data = await res.json();
        if (data.accessToken) {
          localStorage.setItem("token", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);
          window.location.href = "note.html";
        } else {
          alert("Login gagal. Periksa username atau password.");
        }
      } catch (error) {
        alert("Terjadi kesalahan saat login: " + error.message);
        console.error("Login Error:", error);
      }
    }

    else if (action === "register") {
      const res = await fetch(`${backendURL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: username, password }) 
      });

      if (res.ok) {
        alert("Registrasi berhasil");
      } else {
        alert("Registrasi gagal");
      }
    }
});
