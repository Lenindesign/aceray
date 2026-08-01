// Aceray Photo Gallery Modal Script (Extracted & Adapted from Hearst Plus FullscreenImageViewer)

const GALLERY_DATA = [
  { title: "GRANDE", designer: "Design: Maurizio Zilio", src: "https://aceray.com/wp-content/uploads/2026/01/0001s_0004_Grande-family-horiz-A.webp" },
  { title: "RIVA", designer: "Design: Studio Carlesi/Tonelli", src: "https://aceray.com/wp-content/uploads/2026/01/riva-1.webp" },
  { title: "ALMEA", designer: "Design: Chiaramonte-Marin", src: "https://aceray.com/wp-content/uploads/2026/01/almea.webp" },
  { title: "ARTE", designer: "Design: Balutto Associates", src: "https://aceray.com/wp-content/uploads/2026/01/0006s_0000_Arte-UU-horizontal-C.webp" },
  { title: "ALBA", designer: "Design: E. & P. Ciani Design", src: "https://aceray.com/wp-content/uploads/2026/01/Alba-4.webp" },
  { title: "CIAO", designer: "Design: Massimo Iosa Ghini", src: "https://aceray.com/wp-content/uploads/2026/01/0002s_0000_Ciao-UU-horizontal-C.webp" },
  { title: "SOLO-V", designer: "Design: Gentian Elezi", src: "https://aceray.com/wp-content/uploads/2026/01/colo-v.webp" },
  { title: "BORA", designer: "Design: E. & P. Ciani Design", src: "https://aceray.com/wp-content/uploads/2026/01/0003s_0002_Bora-horizontal-A.webp" },
  { title: "MIRA-X3", designer: "Design: A & T Studio", src: "https://aceray.com/wp-content/uploads/2024/12/mira-x3-2-1.webp" },
  { title: "CORSO", designer: "Design: Balutto Associates", src: "https://aceray.com/wp-content/uploads/2024/12/corso3.webp" },
  { title: "SPAZIO-R", designer: "Design: A & T Studio", src: "https://aceray.com/wp-content/uploads/2024/12/Spazio-R-2M-2.webp" }
];

document.addEventListener('DOMContentLoaded', () => {
  const exploreBtn = document.getElementById('explore-btn');
  const modal = document.getElementById('gallery-modal');
  const closeBtn = document.getElementById('gallery-close');
  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');
  const imgEl = document.getElementById('gallery-img');
  const titleEl = document.getElementById('gallery-title');
  const designerEl = document.getElementById('gallery-designer');
  const currentEl = document.getElementById('gallery-current');
  const totalEl = document.getElementById('gallery-total');
  const thumbsContainer = document.getElementById('gallery-thumbnails');

  if (!exploreBtn || !modal) return;

  let currentIndex = 0;
  totalEl.textContent = GALLERY_DATA.length;

  // Build thumbnails
  thumbsContainer.innerHTML = '';
  GALLERY_DATA.forEach((item, index) => {
    const thumb = document.createElement('img');
    thumb.src = item.src;
    thumb.alt = item.title;
    thumb.className = `gallery-thumb ${index === 0 ? 'active' : ''}`;
    thumb.addEventListener('click', () => renderSlide(index));
    thumbsContainer.appendChild(thumb);
  });

  function renderSlide(index) {
    currentIndex = (index + GALLERY_DATA.length) % GALLERY_DATA.length;
    const slide = GALLERY_DATA[currentIndex];

    imgEl.src = slide.src;
    imgEl.alt = `${slide.title} - ${slide.designer}`;
    titleEl.textContent = slide.title;
    designerEl.textContent = slide.designer;
    currentEl.textContent = currentIndex + 1;

    // Update active thumbnail
    const thumbs = thumbsContainer.querySelectorAll('.gallery-thumb');
    thumbs.forEach((thumb, i) => {
      if (i === currentIndex) {
        thumb.classList.add('active');
        thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        thumb.classList.remove('active');
      }
    });
  }

  function openModal(e) {
    if (e) e.preventDefault();
    renderSlide(0);
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  exploreBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  prevBtn.addEventListener('click', () => renderSlide(currentIndex - 1));
  nextBtn.addEventListener('click', () => renderSlide(currentIndex + 1));

  // Keyboard navigation & escape key
  window.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') renderSlide(currentIndex - 1);
    if (e.key === 'ArrowRight') renderSlide(currentIndex + 1);
  });

  // Background overlay click to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('gallery-stage')) {
      closeModal();
    }
  });
});
