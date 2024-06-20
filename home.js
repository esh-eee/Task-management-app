document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const navList = document.getElementById("nav-list");

  hamburger.addEventListener("click", () => {
    navList.classList.toggle("expanded"); // Toggle the expanded class
  });
});
