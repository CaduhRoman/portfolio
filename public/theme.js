// Aplica tema e idioma salvos antes da primeira pintura, para não piscar.
// Fica num arquivo (e não inline) para a CSP em public/_headers poder bloquear scripts inline.
(function () {
  var root = document.documentElement;
  try {
    var theme = localStorage.getItem("theme");
    if (theme !== "light" && theme !== "dark") {
      theme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    root.dataset.theme = theme;
    if (localStorage.getItem("lang") === "pt") root.lang = "pt-BR";
  } catch (e) {
    root.dataset.theme = "light";
  }
})();
