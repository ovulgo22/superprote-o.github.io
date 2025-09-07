document.addEventListener("DOMContentLoaded", () => {
  const searchBox = document.getElementById("search-box");
  const sidebarLinks = document.querySelectorAll(".sidebar a");

  searchBox.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    sidebarLinks.forEach((link) => {
      const text = link.textContent.toLowerCase();
      if (text.includes(query)) {
        link.parentElement.style.display = "block";
      } else {
        link.parentElement.style.display = "none";
      }
    });
  });
});