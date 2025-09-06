//===> Toast message
function showToast(message, type = "error") {
  const container = document.getElementById("toast-container");

  const toast = document.createElement("div");
  toast.classList.add("toast");

  // handle toast types
  if (type === "success") {
    toast.style.backgroundColor = "#4CAF50";
  } else if (type === "warning") {
    toast.style.backgroundColor = "#FF9800";
  } else {
    toast.style.backgroundColor = "#f44336";
  }

  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 100);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

//===> Logout
const logout = document.getElementById("logout");

function handleLogout() {
  localStorage.removeItem("auth-token");
  showToast("Logged out", "success");
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1200);
}

logout.onclick = handleLogout;
