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
