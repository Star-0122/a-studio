const navLinks = [...document.querySelectorAll('.main-nav a')];
const pages = ['home', 'notice', 'movie', 'movie-list', 'memories', 'connect', 'about'];

function currentPage() {
  const hash = location.hash.replace('#', '');
  return pages.includes(hash) ? hash : 'home';
}

function setActive() {
  const page = currentPage();
  const navPage = page === 'movie-list' ? 'movie' : page;
  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.page === navPage);
  });
  document.title = page === 'home'
    ? 'Aスタジオ | えぇ思い出を、えぇ動画で。'
    : `Aスタジオ | ${page}`;
}

function scrollToHash() {
  const id = currentPage();
  const target = document.getElementById(id);
  if (!target) return;
  requestAnimationFrame(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }));
}

window.addEventListener('hashchange', () => {
  setActive();
  scrollToHash();
});
window.addEventListener('load', () => {
  setActive();
  const hash = location.hash;
  if (hash) scrollToHash();
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', () => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
    }
  });
});
