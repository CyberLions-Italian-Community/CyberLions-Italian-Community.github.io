/* Miglioramenti facoltativi: contenuti, collegamenti e FAQ funzionano senza JS. */
"use strict";

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-navigation");

if (menuToggle && navigation) {
  const setMenuOpen = (open) => {
    menuToggle.setAttribute("aria-expanded", String(open));
    navigation.dataset.open = String(open);
  };

  navigation.dataset.enhanced = "true";
  menuToggle.hidden = false;
  setMenuOpen(false);

  menuToggle.addEventListener("click", () => {
    setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
  });

  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenuOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".header-inner")) setMenuOpen(false);
  });

  // Evita che un menu aperto su mobile riappaia dopo un cambio di viewport.
  window.matchMedia("(min-width: 961px)").addEventListener("change", () => {
    setMenuOpen(false);
  });
}

const copyStatus = document.getElementById("copia-stato");

document.querySelectorAll("[data-copy-target]").forEach((button) => {
  const address = document.getElementById(button.dataset.copyTarget);
  if (!address || !copyStatus) return;

  button.hidden = false;
  let feedbackTimer;

  button.addEventListener("click", async () => {
    const label = button.querySelector("[data-copy-label]");
    window.clearTimeout(feedbackTimer);

    try {
      if (!navigator.clipboard || !window.isSecureContext) {
        throw new Error("Appunti non disponibili in questo contesto");
      }

      await navigator.clipboard.writeText(address.textContent.trim());
      if (label) label.textContent = "Copiato";
      copyStatus.textContent = "Indirizzo copiato. Ora puoi incollarlo nella connessione di TeamSpeak.";
      feedbackTimer = window.setTimeout(() => {
        if (label) label.textContent = "Copia";
      }, 3000);
    } catch {
      // Mantiene disponibile l’indirizzo anche quando il browser nega gli appunti.
      if (label) label.textContent = "Copia";
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(address);
      address.focus();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
      copyStatus.textContent = "Copia automatica non disponibile. Puoi copiare manualmente l’indirizzo selezionato.";
    }
  });
});

const year = document.querySelector("[data-current-year]");
if (year) year.textContent = String(new Date().getFullYear());

// Miglioramento progressivo: senza supporto a dialog i link aprono il PNG.
const lightbox = document.querySelector(".screenshot-lightbox");

if (lightbox && typeof lightbox.showModal === "function") {
  const image = lightbox.querySelector(".lightbox-image");
  const title = lightbox.querySelector("#lightbox-title");
  const closeButton = lightbox.querySelector(".lightbox-close");
  let opener;

  document.querySelectorAll("[data-lightbox]").forEach((link) => {
    link.setAttribute("aria-haspopup", "dialog");
    link.addEventListener("click", (event) => {
      // Mantiene disponibili i comandi nativi per aprire o scaricare il file.
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const figure = link.closest(".server-view");
      const original = figure.querySelector(".server-view-image img");
      event.preventDefault();
      opener = link;
      image.width = Number(original.getAttribute("width"));
      image.height = Number(original.getAttribute("height"));
      image.src = link.href;
      image.alt = original.alt;
      title.textContent = figure.classList.contains("server-view-teamspeak")
        ? "Dentro CyberLions · TeamSpeak"
        : "Dentro CyberLions · Discord";
      lightbox.showModal();
    });
  });

  closeButton.addEventListener("click", () => lightbox.close());
  // Chiude solo se pressione e rilascio avvengono fuori dall’immagine e dall’header.
  let backdropPress = false;
  lightbox.addEventListener("pointerdown", (event) => {
    backdropPress = event.target === lightbox;
  });
  lightbox.addEventListener("click", (event) => {
    if (backdropPress && event.target === lightbox) lightbox.close();
    backdropPress = false;
  });
  lightbox.addEventListener("close", () => {
    opener?.focus({ preventScroll: true });
  });
}
