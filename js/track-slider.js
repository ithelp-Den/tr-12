document.addEventListener("DOMContentLoaded", () => {
  // Слайдер «See what's inside»: активна картка стоїть біля лівого краю (відступ як у контенту),
  // наступна визирає справа. Стрічку з картками зсуваємо на крок картки.
  document.querySelectorAll(".js-track-slider").forEach((clip) => {
    const track = clip.querySelector(".js-track");
    const section = clip.closest("section");
    const nav = section.querySelector(".js-track-nav");
    if (!track || !nav) return;

    const pitch = parseFloat(clip.dataset.pitch); // крок картки, rem
    const first = parseFloat(clip.dataset.first); // де перша картка стоїть у макеті, rem
    const gutter = parseFloat(clip.dataset.gutter); // лівий відступ активної картки, rem
    const count = parseInt(clip.dataset.count, 10);
    const dots = nav.querySelectorAll(".dot");
    let index = 0;

    // Зупиняємо всі відео й повертаємо постери
    const killVideos = () => {
      track.querySelectorAll("video").forEach((video) => {
        video.pause();
        video.removeAttribute("src");
        video.load();
        video.remove();
      });
    };

    const render = () => {
      killVideos();
      track.style.transform = `translateX(${gutter - first - index * pitch}rem)`;
      // 7 крапок показують прогрес гортання, як у макеті
      const active = Math.round((index / Math.max(count - 1, 1)) * (dots.length - 1));
      dots.forEach((d, i) => d.classList.toggle("is-active", i === active));
    };

    const go = (step) => {
      index = (index + step + count) % count;
      render();
    };

    nav.querySelector("[class$='__prev']").addEventListener("click", () => go(-1));
    nav.querySelector("[class$='__next']").addEventListener("click", () => go(1));

    // Свайп пальцем
    let x0 = null;
    clip.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    clip.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
      x0 = null;
    });

    // Відео відкривається поверх постера по кліку (як у відгуках)
    track.querySelectorAll(".js-card-video").forEach((poster) => {
      poster.style.cursor = "pointer";
      poster.addEventListener("click", () => {
        killVideos();
        const video = document.createElement("video");
        video.src = poster.dataset.video;
        video.className = "card-video";
        video.controls = true;
        video.autoplay = true;
        video.playsInline = true;
        video.setAttribute("playsinline", "");
        video.setAttribute("webkit-playsinline", "");
        // той самий бокс, що й у постера
        Object.assign(video.style, {
          left: poster.offsetLeft + "px",
          top: poster.offsetTop + "px",
          width: poster.offsetWidth + "px",
          height: poster.offsetHeight + "px",
        });
        video.addEventListener("ended", killVideos);
        poster.after(video);
        const p = video.play();
        if (p && p.catch) p.catch(() => { video.muted = true; video.play(); });
      });
    });

    track.style.transition = "transform 0.5s ease";
    render();
  });
});
