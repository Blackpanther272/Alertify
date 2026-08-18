document.addEventListener("DOMContentLoaded", function () {
  const themeBtn = document.getElementById("themeToggle");
  const currentTheme = localStorage.getItem("theme");

  if (currentTheme === "dark") {
    document.body.classList.add("dark-mode");
    if (themeBtn) themeBtn.textContent = "☀️";
  } else {
    document.body.classList.remove("dark-mode");
    if (themeBtn) themeBtn.textContent = "🌙";
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      document.body.classList.toggle("dark-mode");
      const isDark = document.body.classList.contains("dark-mode");
      localStorage.setItem("theme", isDark ? "dark" : "light");
      themeBtn.textContent = isDark ? "☀️" : "🌙";
    });
  }
});
