// theme.js - Global Theme Manager
(function () {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark-mode");
    document.body?.classList.add("dark-mode");
  }
})();

document.addEventListener("DOMContentLoaded", function () {
  const themeBtn = document.getElementById("themeToggle");
  if (!themeBtn) return;

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    themeBtn.textContent = "☀";
  } else {
    themeBtn.textContent = "🌙";
  }

  themeBtn.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    document.documentElement.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
      localStorage.setItem("theme", "dark");
      themeBtn.textContent = "☀";
    } else {
      localStorage.setItem("theme", "light");
      themeBtn.textContent = "🌙";
    }
  });
});