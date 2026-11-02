document.addEventListener("DOMContentLoaded", () => {
  const faqTriggers = document.querySelectorAll(".faq__question");

  faqTriggers.forEach((trigger) => {
    const contentPanel = trigger.nextElementSibling;

    // За макетом усі відповіді відкриті одразу — без обмеження висоти, щоб не залежати від завантаження шрифтів
    contentPanel.style.maxHeight = trigger.getAttribute("aria-expanded") === "true" ? "none" : "0";

    // Після розгортання знімаємо обмеження, щоб текст ніколи не обрізався
    contentPanel.addEventListener("transitionend", () => {
      if (trigger.getAttribute("aria-expanded") === "true") contentPanel.style.maxHeight = "none";
    });

    trigger.addEventListener("click", () => {
      const isExpanded = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", String(!isExpanded));

      // Висота з scrollHeight — плавна анімація незалежно від обсягу тексту
      contentPanel.style.maxHeight = contentPanel.scrollHeight + "px";
      if (isExpanded) {
        contentPanel.offsetHeight; // фіксуємо стартову висоту перед згортанням
        contentPanel.style.maxHeight = "0";
      }
    });
  });
});
