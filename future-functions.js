(() => {
  const DATA_URL = 'data/memories.json';
  const STORAGE_KEY = 'astudio-local-visibility';
  const nav = document.querySelector('.main-nav');
  const moviePage = document.querySelector('#movie');
  if (!moviePage) return;

  const categories = ['すべて', 'Summer vacation', "New Year's", 'Travel', 'Event', 'Memory', 'Others'];
  const state = { query: '', year: 'all', category: 'すべて' };
  let videos = [];

  const visibility = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  const isVisible = video => visibility[video.id] ?? (video.status === 'public');

  const panel = document.createElement('div');
  panel.className = 'future-panel';
  panel.innerHTML = `
    <div class="future-panel-head">
      <div><span class="eyebrow">Future Functions</span><h3>思い出を、もっと探しやすく。</h3></div>
      <span class="future-badge">β</span>
    </div>
    <div class="future-search-row">
      <label class="future-search"><span>⌕</span><input id="futureSearch" type="search" placeholder="動画名・年・カテゴリーで検索" autocomplete="off"></label>
      <select id="futureYear" aria-label="年で絞り込み"><option value="all">すべての年</option></select>
      <select id="futureCategory" aria-label="カテゴリーで絞り込み">${categories.map(c => `<option>${c}</option>`).join('')}</select>
    </div>
    <div class="future-actions">
      <button type="button" data-future="qr">▣ QRコード</button>
      <button type="button" data-future="photos">▧ 写真を整理</button>
      <button type="button" data-future="related">↗ 関連する思い出</button>
      <button type="button" data-future="manage">⚙ 公開設定</button>
    </div>
    <div id="futureResults" class="future-results" aria-live="polite"></div>
  `;
  moviePage.appendChild(panel);

  const modal = document.createElement('dialog');
  modal.className = 'future-modal';
  modal.innerHTML = `<button class="modal-close" type="button" aria-label="閉じる">×</button><div id="futureModalBody"></div>`;
  document.body.appendChild(modal);

  const search = panel.querySelector('#futureSearch');
  const year = panel.querySelector('#futureYear');
  const category = panel.querySelector('#futureCategory');
  const results = panel.querySelector('#futureResults');
  const body = modal.querySelector('#futureModalBody');

  function render() {
    const q = state.query.trim().toLowerCase();
    const filtered = videos.filter(v => {
      if (!isVisible(v)) return false;
      const text = `${v.title} ${v.year} ${v.category} ${v.categoryJa}`.toLowerCase();
      return (!q || text.includes(q)) && (state.year === 'all' || String(v.year) === state.year) && (state.category === 'すべて' || v.category === state.category);
    });
    results.innerHTML = filtered.length ? filtered.map(v => `
      <article class="future-result" data-video-id="${v.id}">
        <div><span>${v.year}</span><small>${v.categoryJa}</small></div>
        <b>${v.title}</b>
        <div class="future-result-actions"><a href="${v.url}">見る</a><button type="button" data-related="${v.id}">関連</button><button type="button" data-qr="${v.id}">QR</button></div>
      </article>`).join('') : '<p class="future-empty">条件に合う公開動画はありません。</p>';
  }

  function openModal(html) { body.innerHTML = html; modal.showModal(); }

  function openQr(video) {
    const url = new URL(video.url.replace(/^#/, ''), location.href).href;
    openModal(`<h3>「${video.title}」のQRコード</h3><div id="qrcode" class="qrcode"></div><p class="modal-note">スマートフォンで読み取ると、この思い出へアクセスできます。</p>`);
    const load = () => {
      if (window.QRCode) new QRCode(document.getElementById('qrcode'), {text: url, width: 220, height: 220});
    };
    if (window.QRCode) load(); else { const s = document.createElement('script'); s.src='https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'; s.onload=load; document.head.appendChild(s); }
  }

  function openRelated(video) {
    const related = (video.related || []).map(id => videos.find(v => v.id === id)).filter(Boolean);
    openModal(`<h3>「${video.title}」に関連する思い出</h3>${related.length ? related.map(v => `<a class="related-item" href="${v.url}"><b>${v.title}</b><span>${v.categoryJa}</span></a>`).join('') : '<p class="modal-note">関連する思い出はこれから追加できます。</p>'}`);
  }

  function openPhotos() {
    openModal(`<h3>撮影した写真を整理</h3><p class="modal-note">写真を選ぶと、このブラウザ上でアルバムとして整理できます。GitHub Pagesだけではサーバーへの写真保存は行いません。</p><label class="photo-drop">写真を選択<input id="photoPicker" type="file" accept="image/*" multiple></label><div id="photoGrid" class="photo-grid"></div>`);
    document.getElementById('photoPicker').addEventListener('change', e => {
      const grid = document.getElementById('photoGrid');
      grid.innerHTML = '';
      [...e.target.files].forEach(file => { const img=document.createElement('img'); img.alt=file.name; img.src=URL.createObjectURL(file); grid.appendChild(img); });
    });
  }

  function openManage() {
    openModal(`<h3>動画の公開・非公開設定</h3><p class="modal-note">現在はデモ版です。設定はこのブラウザだけに保存されます。実際の管理画面には認証付きデータベースを接続できます。</p><div class="manage-list">${videos.map(v => `<label><span><b>${v.title}</b><small>${v.year} / ${v.categoryJa}</small></span><input type="checkbox" data-visibility="${v.id}" ${isVisible(v) ? 'checked' : ''}></label>`).join('')}</div>`);
    body.querySelectorAll('[data-visibility]').forEach(input => input.addEventListener('change', e => { visibility[e.target.dataset.visibility]=e.target.checked; localStorage.setItem(STORAGE_KEY, JSON.stringify(visibility)); render(); }));
  }

  panel.addEventListener('input', e => { if(e.target===search){state.query=e.target.value;render();} });
  year.addEventListener('change', e => {state.year=e.target.value;render();});
  category.addEventListener('change', e => {state.category=e.target.value;render();});
  panel.addEventListener('click', e => {
    const qr = e.target.closest('[data-qr]'); const rel = e.target.closest('[data-related]'); const action = e.target.closest('[data-future]');
    if(qr){const v=videos.find(x=>x.id===qr.dataset.qr); if(v) openQr(v);}
    else if(rel){const v=videos.find(x=>x.id===rel.dataset.related); if(v) openRelated(v);}
    else if(action==='') return;
    else if(action?.dataset.future==='qr' && videos[0]) openQr(videos[0]);
    else if(action?.dataset.future==='photos') openPhotos();
    else if(action?.dataset.future==='related' && videos[0]) openRelated(videos[0]);
    else if(action?.dataset.future==='manage') openManage();
  });
  modal.querySelector('.modal-close').addEventListener('click', () => modal.close());
  modal.addEventListener('click', e => { if(e.target===modal) modal.close(); });

  fetch(DATA_URL).then(r => r.json()).then(data => {
    videos=data.videos || [];
    [...new Set(videos.map(v=>v.year))].sort((a,b)=>b-a).forEach(y => year.insertAdjacentHTML('beforeend', `<option value="${y}">${y}年</option>`));
    render();
  }).catch(() => { results.innerHTML='<p class="future-empty">データを読み込めませんでした。</p>'; });
})();
