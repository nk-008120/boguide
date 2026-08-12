function setTheme(theme) {
  document.documentElement.classList.remove("light", "dark", "favourite");

  if (theme !== "light" && theme !== "dark" && theme !== "favourite") {
    theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  document.documentElement.classList.add(theme);

  document.documentElement.style.colorScheme = theme === "favourite" ? "light" : theme;
}

setTheme("color-theme" in localStorage ? localStorage.getItem("color-theme") : '{{ site.Params.theme.default | default `system`}}')
