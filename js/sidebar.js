document.addEventListener("DOMContentLoaded", () => {
  // Put sidebare page's content inside the div in html
  fetch("sidebar.html")
    .then((res) => res.text())
    .then((data) => {
      document.getElementById("nav-placeholder").innerHTML = data;

      const links = document.querySelectorAll("nav.sidebar a");
      // Catch the current page to set activ link
      const currentPage = window.location.pathname.split("/").pop();

      links.forEach((link) => {
        if (link.getAttribute("href") === currentPage) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    })
    .catch((err) => console.error("Error loading nav:", err));
});
