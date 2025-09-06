//===> Check if user has already signed
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("auth-token")) {
    window.location.href = "dashboard.html";
    return;
  }
});

//===> Login
const form = document.getElementById("login-form");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Password validation
  if (password.length < 6) {
    showToast("Password must be at least 6 characters");
    return;
  }

  if (!email) {
    showToast("Please enter your email");
    return;
  }

  const token = Math.floor(Math.random() * 20);
  // Save token in local storage
  localStorage.setItem("auth-token", token);

  showToast("Login successful!", "success");

  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 1000);
});
