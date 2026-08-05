// The section must not be in the theme.js (body) file because it can create a quick flash (switch between light and dark).
// Project override of themes/hextra/assets/js/head/theme.js — adds a 4th, manually-selected
// "favourite" theme (lilac/sage gradient background) alongside Hextra's light/dark/system.

function setTheme(theme) {
  document.documentElement.classList.remove("light", "dark", "favourite");

  if (theme !== "light" && theme !== "dark" && theme !== "favourite") {
    theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  document.documentElement.classList.add(theme);
  // "favourite" reuses light-mode foreground colors, so report "light" to the UA/scrollbars/form controls.
  document.documentElement.style.colorScheme = theme === "favourite" ? "light" : theme;
}

setTheme("color-theme" in localStorage ? localStorage.getItem("color-theme") : 'system')

;
// The section must not be in the banner.js (body) file because it can create a quick flash.

//
