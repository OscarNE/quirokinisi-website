"use strict";

const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".primary-navigation");
const navigationLinks = document.querySelectorAll(".primary-navigation a");
const yearElement = document.querySelector("#current-year");

function closeMenu() {
  if (!menuButton || !navigation) {
    return;
  }

  menuButton.setAttribute("aria-expanded", "false");
  navigation.classList.remove("is-open");
  document.body.classList.remove("menu-open");

  const label = menuButton.querySelector(".sr-only");
  if (label) {
    label.textContent = "Abrir menú";
  }
}

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";

    menuButton.setAttribute("aria-expanded", String(!isOpen));
    navigation.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);

    const label = menuButton.querySelector(".sr-only");
    if (label) {
      label.textContent = isOpen ? "Abrir menú" : "Cerrar menú";
    }
  });

  navigationLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      menuButton.focus();
    }
  });
}

if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}
