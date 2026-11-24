const emailLink = document.querySelector(".copy-email");
const message = document.querySelector(".copy-message");

if (emailLink && message) {
  emailLink.addEventListener("click", async function(event) {
    event.preventDefault();

    const email = emailLink.dataset.email;

if (!email) {
  message.textContent = "Адрес почты не указан";
  return;
}

    try {
      await navigator.clipboard.writeText(email);
      message.textContent = "Спасибо, что заглянули в NOVA!";
    } catch (error) {
      message.textContent = "Не удалось скопировать почту";
      console.log(error);
    }
  });
}

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

// Открытие и закрытие меню
menuToggle.addEventListener("click", function() {
  const isOpen = nav.classList.toggle("active");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

// Закрытие меню после выбора ссылки
const navLinks = nav.querySelectorAll("a");

navLinks.forEach(function(link) {
  link.addEventListener("click", function() {
    nav.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

const revealElements = document.querySelectorAll(
  ".services__top, .service-card, .project-card, .about__content, .stat"
);

const observer = new IntersectionObserver(function(entries) {

  entries.forEach(function(entry) {

    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }

  });

}, {
  threshold: 0.15
});

revealElements.forEach(function(element) {
  element.classList.add("reveal");
  observer.observe(element);
});


// PROJECT MODAL

const projectCards = document.querySelectorAll(".project-card");
const projectModal = document.querySelector("#project-modal");
const modalClose = projectModal.querySelector(".project-modal__close");
const focusableElements = projectModal.querySelectorAll(
  'button, a, input, textarea, select, [tabindex]:not([tabindex="-1"])'
);
let lastFocusedElement = null;
function closeModal() {
  projectModal.classList.remove("is-open");
  document.body.style.overflow = "";

  projectModal.addEventListener("transitionend", function handler(event) {

    if (
      event.target === projectModal &&
      event.propertyName === "opacity"
) {
      projectModal.hidden = true;
      projectModal.removeEventListener("transitionend", handler);

      if (lastFocusedElement) {
        lastFocusedElement.focus();
      }
    }

  });
}

// Открытие окна при нажатии на карточку
projectCards.forEach(function(card) {

  card.addEventListener("click", function() {

    const category = card.dataset.category;
    const title = card.dataset.title;
    const description = card.dataset.description;

    document.querySelector("#project-modal-category").textContent = category;
    document.querySelector("#project-modal-title").textContent = title;
    document.querySelector("#project-modal-description").textContent = description;

    lastFocusedElement = card;
    projectModal.hidden = false;

    requestAnimationFrame(function() {
      projectModal.classList.add("is-open");
    });

    document.body.style.overflow = "hidden";
    modalClose.focus();

  });

  // Управление карточкой с клавиатуры
  card.addEventListener("keydown", function(event) {

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      card.click();
    }

  });

});


// Закрытие окна по нажатию на крестик
modalClose.addEventListener("click", function() {
  closeModal();
});

// Закрытие окна при клике на затемнённый фон
projectModal.addEventListener("click", function(event) {
  if (event.target === projectModal) {
    closeModal();
  }
});

// Ограничение клавиатурного фокуса внутри модального окна
projectModal.addEventListener("keydown", function(event) {

  if (event.key !== "Tab") {
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  // Если нажали Shift + Tab на первом элементе
  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  }

  // Если нажали Tab на последнем элементе
  else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }

});

// Закрытие окна по нажатию на Escape
document.addEventListener("keydown", function(event) {
  if (
    event.key === "Escape" &&
    !projectModal.hidden &&
    projectModal.classList.contains("is-open")
  ) {
    closeModal();
  }
});
