document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section");
  const sidebarLinks = document.querySelectorAll(".sidebar a");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const activeId = entry.target.id;
          sidebarLinks.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${activeId}`
            );
          });
        }
      });
    },
    { threshold: 0.5 }
  );

  sections.forEach((section) => observer.observe(section));
});