const navLinks = [...document.querySelectorAll('.main-nav a')];
const pages = ['home','notice','movie','movie-list','memories','connect','about'];

function currentPage() {
  const hash = location.hash.slice(1);
  return pages.includes(hash) ? hash : 'home';
}

function setActive() {
  const page = currentPage();
  const navPage = page === 'movie-list' ? 'movie' : page;
  navLinks.forEach(link => link.classList.toggle('active', link.dataset.page === navPage));
  const titles = {home:'えぇ思い出を、えぇ動画で。',notice:'Notice｜お知らせ',movie:'Movie｜動画','movie-list':'Movie｜動画',memories:'Memories｜思い出',connect:'Connect｜つながる',about:'About A Studio'};
  document.title = `Aスタジオ | ${titles[page]}`;
}

function scrollToPage(smooth = true) {
  const target = document.getElementById(currentPage());
  if (!target) return;
  target.scrollIntoView({behavior: smooth ? 'smooth' : 'auto', block: 'start'});
}

window.addEventListener('hashchange', () => { setActive(); scrollToPage(true); });
window.addEventListener('load', () => { setActive(); if (location.hash) scrollToPage(false); });

document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  history.replaceState(null, '', '#home');
  setActive();
  scrollToPage(true);
});
