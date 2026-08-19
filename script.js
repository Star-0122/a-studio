/* Aスタジオ: 22日にPNGを入れたあと、ここでリンク領域を設定できます。 */
const HOTSPOTS = {
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
  6: [],
  7: []
};

function makeHotspots() {
  document.querySelectorAll('.hotspots').forEach(layer => {
    const page = Number(layer.dataset.page);
    (HOTSPOTS[page] || []).forEach((item, index) => {
      const a = document.createElement('a');
      a.className = 'hotspot';
      a.href = item.href;
      a.setAttribute('aria-label', item.label || `リンク${index + 1}`);
      a.style.left = `${item.x}%`;
      a.style.top = `${item.y}%`;
      a.style.width = `${item.w}%`;
      a.style.height = `${item.h}%`;
      layer.appendChild(a);
    });
  });
}

document.querySelectorAll('.design img').forEach(img => {
  img.addEventListener('error', () => {
    img.alt = `${img.alt}（画像準備中）`;
    img.classList.add('missing-image');
  });
});

makeHotspots();
