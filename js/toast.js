/*
  toast.js
  Avisos dentro da própria página (no lugar dos pop-ups do navegador).
  Uso: mostrarAviso("Mensagem", "sucesso" | "erro" | "info")
*/
(function () {
  function area() {
    let el = document.getElementById("avisos");
    if (!el) {
      el = document.createElement("div");
      el.id = "avisos";
      el.className = "avisos";
      el.setAttribute("role", "status");
      el.setAttribute("aria-live", "polite");
      document.body.appendChild(el);
    }
    return el;
  }

  window.mostrarAviso = function (mensagem, tipo, duracao) {
    const aviso = document.createElement("div");
    aviso.className = "aviso aviso--" + (tipo || "info");
    aviso.textContent = mensagem;
    area().appendChild(aviso);
    requestAnimationFrame(() => aviso.classList.add("aviso--visivel"));
    setTimeout(() => {
      aviso.classList.remove("aviso--visivel");
      setTimeout(() => aviso.remove(), 300);
    }, duracao || 3500);
  };
})();
