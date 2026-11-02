document.addEventListener("DOMContentLoaded", () => {
  // Біжучі рядки: у макеті текст виходить за край екрана — вміст безперервно їде вліво, фон смуги стоїть.
  // Період (--period) — відстань, після якої візерунок повторюється; копії стрічки ставимо одна за одною.
  document.querySelectorAll(".js-marquee").forEach((bar) => {
    const track = document.createElement("div");
    track.className = "js-marquee__track";
    while (bar.firstChild) track.appendChild(bar.firstChild);
    bar.appendChild(track);

    for (let i = 1; i <= 2; i++) {
      const clone = track.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.style.left = `calc(var(--period) * ${i})`;
      bar.appendChild(clone);
    }
  });
});
