// Smooth transitions between pages
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll("a[href]");
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) return; // Skip anchor links

      e.preventDefault();
      document.body.style.opacity = 0; // Fade out
      setTimeout(() => {
        window.location.href = href; // Navigate after fade-out
      }, 300); // Match the transition duration
    });
  });
});