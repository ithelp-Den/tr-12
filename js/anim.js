document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll(".js-count");
  if (!counters.length) return;

  // Розбираємо «2.2M», «60 000+», «12+»: число, роздільник тисяч (пробіл, крапка, кома), суфікс
  const parse = (text) => {
    const match = text.trim().match(/^(\d[\d.,\s\u00a0]*\d|\d)(.*)$/);
    if (!match) return null;
    const raw = match[1];
    const thousands = /^\d{1,3}([.,\s\u00a0]\d{3})+$/.test(raw);
    const value = parseFloat(thousands ? raw.replace(/[.,\s\u00a0]/g, "") : raw.replace(",", "."));
    const decimals = thousands ? 0 : (raw.split(/[.,]/)[1] || "").length;
    return { value, decimals, thousands, separator: thousands ? raw.match(/[.,\s\u00a0]/)[0] : "", suffix: match[2] };
  };

  const format = (num, p) => {
    if (p.thousands) {
      return Math.floor(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, p.separator) + p.suffix;
    }
    return num.toFixed(p.decimals) + p.suffix;
  };

  const animate = (el) => {
    const finalText = el.textContent;
    const p = parse(finalText);
    if (!p) return;

    const duration = 2000; // 2 секунди
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // Плавне уповільнення в кінці (easeOutQuad)
      const ease = progress * (2 - progress);
      el.textContent = format(ease * p.value, p);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // Гарантовано ставимо оригінальне значення в кінці
        el.textContent = finalText;
      }
    };

    requestAnimationFrame(step);
  };

  // Запуск, коли число з'являється на екрані
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animate(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.3 });

  counters.forEach((el) => observer.observe(el));
});
