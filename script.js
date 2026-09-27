(() => {
  const slides = [...document.querySelectorAll(".slide")];
  const progress = document.getElementById("progress");
  const currentNum = document.getElementById("currentNum");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  let index = 0;
  let locked = false;

  const pad = (n) => String(n).padStart(2, "0");

  function go(to) {
    if (locked) return;
    const next = Math.max(0, Math.min(slides.length - 1, to));
    if (next === index) return;

    locked = true;
    const prev = slides[index];
    const curr = slides[next];

    prev.classList.remove("active");
    prev.classList.add("leaving");
    curr.classList.add("active");

    index = next;
    progress.style.width = `${((index + 1) / slides.length) * 100}%`;
    currentNum.textContent = pad(index + 1);

    setTimeout(() => {
      prev.classList.remove("leaving");
      locked = false;
    }, 650);
  }

  function next() { go(index + 1); }
  function prev() { go(index - 1); }

  nextBtn.addEventListener("click", next);
  prevBtn.addEventListener("click", prev);

  document.addEventListener("keydown", (e) => {
    if (["ArrowRight", "ArrowDown", "PageDown", " ", "Enter"].includes(e.key)) {
      e.preventDefault();
      next();
    } else if (["ArrowLeft", "ArrowUp", "PageUp", "Backspace"].includes(e.key)) {
      e.preventDefault();
      prev();
    } else if (e.key === "Home") {
      e.preventDefault();
      go(0);
    } else if (e.key === "End") {
      e.preventDefault();
      go(slides.length - 1);
    } else if (e.key === "f" || e.key === "F" || e.key === "а" || e.key === "А") {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
    }
  });

  let touchX = null;
  document.addEventListener("touchstart", (e) => {
    touchX = e.changedTouches[0].screenX;
  }, { passive: true });

  document.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].screenX - touchX;
    if (Math.abs(dx) > 50) dx < 0 ? next() : prev();
    touchX = null;
  }, { passive: true });

  let wheelLock = false;
  document.addEventListener("wheel", (e) => {
    if (wheelLock) return;
    if (Math.abs(e.deltaY) < 30) return;
    wheelLock = true;
    e.deltaY > 0 ? next() : prev();
    setTimeout(() => { wheelLock = false; }, 800);
  }, { passive: true });

  progress.style.width = `${(1 / slides.length) * 100}%`;

  const start = Number(new URLSearchParams(location.search).get("slide"));
  if (start > 1 && start <= slides.length) {
    slides[0].classList.remove("active");
    index = start - 1;
    slides[index].classList.add("active");
    progress.style.width = `${((index + 1) / slides.length) * 100}%`;
    currentNum.textContent = pad(index + 1);
  }
})();
