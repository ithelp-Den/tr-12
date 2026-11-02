document.addEventListener('DOMContentLoaded', () => {
  const reviewsSliderEl = document.querySelector('.reviews__swiper');
  if (!reviewsSliderEl) return;

  // 1rem = 10px на ширині макету — відступ масштабується разом зі сторінкою
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const dots = document.querySelectorAll('.reviews__dots .dot');

  // Зупиняємо всі відео й повертаємо постери
  const killAllVideos = () => {
    reviewsSliderEl.querySelectorAll('.review-slide video').forEach((video) => {
      video.pause();
      video.removeAttribute('src');
      video.load();
      video.remove();
    });
  };

  // Відео відкривається поверх постера по кліку
  const openVideo = (slide, url) => {
    killAllVideos();

    const video = document.createElement('video');
    video.src = url;
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.preload = 'auto';
    video.addEventListener('ended', killAllVideos);
    slide.appendChild(video);

    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        video.muted = true;
        video.play();
      });
    }
  };

  // Крапки показують прогрес гортання, як у макеті
  const updateDots = (sw) => {
    const total = sw.slides.length - (sw.loopedSlides || 0) * 2 || sw.slides.length;
    const active = Math.round((sw.realIndex / Math.max(total - 1, 1)) * (dots.length - 1));
    dots.forEach((d, i) => d.classList.toggle('is-active', i === active));
  };

  const swiper = new Swiper(reviewsSliderEl, {
    loop: true,
    slidesPerView: 'auto', // ширина слайда задається в CSS, наступний слайд видно справа
    spaceBetween: 2 * rem,
    navigation: {
      nextEl: '.reviews__next',
      prevEl: '.reviews__prev',
    },
    on: {
      init: updateDots,
      slideChange: updateDots,
    },
  });

  swiper.on('slideChangeTransitionStart', killAllVideos);
  swiper.on('sliderMove', killAllVideos);

  reviewsSliderEl.addEventListener('click', (e) => {
    if (e.target.tagName === 'VIDEO') return;
    const slide = e.target.closest('.review-slide');
    const url = slide && slide.dataset.video;
    if (!url) return;
    openVideo(slide, url);
  });
});
