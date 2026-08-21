const navLinks=[...document.querySelectorAll('.main-nav a')];
const sections=[...document.querySelectorAll('.page')];
function setActive(){
  const hash=location.hash.replace('#','')||'home';
  const page=hash==='movie-list'?'movie':hash;
  navLinks.forEach(a=>a.classList.toggle('active',a.dataset.page===page));
}
window.addEventListener('hashchange',setActive);
window.addEventListener('load',setActive);

// カードやカテゴリをクリックしたときに、対応するページへ移動するための共通処理。
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',()=>{
    const target=document.querySelector(a.getAttribute('href'));
    if(target) setTimeout(()=>target.scrollIntoView({behavior:'smooth',block:'start'}),0);
  });
});
