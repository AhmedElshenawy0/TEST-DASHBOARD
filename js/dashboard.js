// Check if authinticated
document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("auth-token")) {
    window.location.href = "index.html";
  } else {
    renderPosts();
  }
});
