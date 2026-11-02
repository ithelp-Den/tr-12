document.addEventListener("DOMContentLoaded", () => {
  // Набір у групу: старт щопонеділка, записатись можна до неділі 23:59.
  // Рахуємо найближчу неділю 23:59 і понеділок після неї — дати й таймер завжди актуальні.
  const now = new Date();
  const deadline = new Date(now);
  deadline.setDate(now.getDate() + ((7 - now.getDay()) % 7)); // неділя цього тижня (сьогодні, якщо неділя)
  deadline.setHours(23, 59, 59, 999);
  if (deadline < now) deadline.setDate(deadline.getDate() + 7);

  const groupStart = new Date(deadline);
  groupStart.setDate(deadline.getDate() + 1);

  const dateText = groupStart.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" }); // «Monday 9 November»
  const [weekday, ...rest] = dateText.replace(",", "").split(" ");
  const pretty = `${weekday}, ${rest.join(" ")}`;

  document.querySelectorAll(".js-group-date").forEach((el) => {
    el.textContent = el.dataset.case === "up" ? pretty.toUpperCase() : pretty;
  });

  // Таймер «Bonuses for this group close in»: дні / години / хвилини
  const daysEl = document.querySelectorAll(".js-deadline-days");
  const hoursEl = document.querySelectorAll(".js-deadline-hours");
  const minutesEl = document.querySelectorAll(".js-deadline-minutes");
  if (!daysEl.length) return;

  const pad = (n) => String(n).padStart(2, "0");

  const update = () => {
    const left = Math.max(deadline - Date.now(), 0);
    const d = Math.floor(left / 86400000);
    const h = Math.floor((left % 86400000) / 3600000);
    const m = Math.floor((left % 3600000) / 60000);
    daysEl.forEach((el) => (el.textContent = pad(d)));
    hoursEl.forEach((el) => (el.textContent = pad(h)));
    minutesEl.forEach((el) => (el.textContent = pad(m)));
  };

  update();
  setInterval(update, 1000);
});
