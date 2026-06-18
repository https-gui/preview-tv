var API_BASE_URL = 'http://10.181.0.29:8085/api/api.php';

var mediaItems = [];
var selectedId = null;
var tvActive   = false;
var tvIndex    = 0;
var tvTimer, clockInterval;
var currentTvVideo = null;

// ===================== UTILS =====================
function showToast(msg, type) {
  type = type || 'success';
  var t = document.createElement('div');
  t.textContent = msg;
  t.style.cssText = 'position:fixed;bottom:24px;right:24px;color:#fff;padding:10px 18px;border-radius:8px;font-size:13px;font-weight:500;z-index:99999;font-family:Arial,sans-serif;';
  t.style.background = type === 'success' ? '#22C55E' : '#EF4444';
  document.body.appendChild(t);
  setTimeout(function() {
    t.style.opacity = '0';
    setTimeout(function() { if (t.parentNode) t.parentNode.removeChild(t); }, 400);
  }, 2500);
}

function fetchData(action, method, data, params) {
  method = method || 'GET'; params = params || '';
  var url = API_BASE_URL + '?action=' + action + (params ? '&' + params : '');
  var opts = { method: method, headers: { 'Content-Type': 'application/json' } };
  if (data) opts.body = JSON.stringify(data);
  return fetch(url, opts)
    .then(function(r) {
      if (!r.ok) return r.json().then(function(e) { throw new Error(e.message || 'Erro ' + r.status); }).catch(function() { throw new Error('Erro ' + r.status); });
      return r.json();
    })
    .catch(function(e) { console.error(action, e); showToast(e.message, 'danger'); return null; });
}

function absUrl(url) {
  if (!url) return '';
  if (url.indexOf('http') === 0) return url;
  var base = API_BASE_URL.replace('/api/api.php', '');
  return base + (url.charAt(0) === '/' ? '' : '/') + url;
}

// ===================== UPLOAD =====================
var fileInput  = document.getElementById('file-input');
var uploadArea = document.getElementById('upload-area');
uploadArea.addEventListener('dragover',  function(e) { e.preventDefault(); });
uploadArea.addEventListener('drop', function(e) { e.preventDefault(); handleFiles(e.dataTransfer.files); });
fileInput.addEventListener('change', function() { handleFiles(fileInput.files); });

function handleFiles(files) {
  var arr = Array.prototype.slice.call(files).filter(function(f) { return f.type && (f.type.match(/^image\//) || f.type.match(/^video\//)); });
  var chain = Promise.resolve();
  arr.forEach(function(file) {
    chain = chain.then(function() {
      var fd = new FormData(); fd.append('file', file);
      return fetch(API_BASE_URL + '?action=uploads', { method: 'POST', body: fd })
        .then(function(r) { return r.json(); })
        .then(function(res) {
          if (res.success) {
            var m = res.midia;
            var defaultDur = parseInt(document.getElementById('cfg-default-duration').value) || 10;
            mediaItems.push({
              id: null,
              name: m.nome_arquivo,
              type: m.tipo,
              url: absUrl(m.url),
              duration: defaultDur,
              title: '',
              subtitle: '',
              transition: 'fade',
              midia_id: m.id
            });
            showToast("'" + m.nome_arquivo + "' enviado!");
          } else showToast(res.message, 'danger');
        }).catch(function() { showToast('Erro no upload.', 'danger'); });
    });
  });
  chain.then(function() { fileInput.value = ''; return syncPlaylistToDb(); });
}

// Chamada após upload: insere novos itens no banco e sincroniza ordem
function syncPlaylistToDb() {
  return fetchData('playlist_items', 'GET', null, 'playlist_id=1').then(function(currentItems) {
    currentItems = currentItems || [];
    var existIds = {};
    currentItems.forEach(function(i) { existIds[i.midia_id] = true; });
    var chain = Promise.resolve();

    // Insere apenas itens novos que ainda não existem no banco
    mediaItems.forEach(function(item, i) {
      chain = chain.then(function() {
        if (!item.id && item.midia_id && !existIds[item.midia_id]) {
          return fetchData('playlist_items', 'POST', {
            playlist_id: 1,
            midia_id: item.midia_id,
            ordem: i,
            titulo: item.title || '',
            subtitulo: item.subtitle || '',
            duracao: item.duration || 10,
            transicao: item.transition || 'fade'
          }).then(function(res) { if (res && res.success) item.id = res.id; });
        }
      });
    });

    return chain.then(function() { return loadPlaylist(); });
  });
}

// Chamada APENAS após drag-and-drop: persiste a nova ordem no banco
function reorderPlaylist() {
  var orderedIds = mediaItems.filter(function(m) { return !!m.id; }).map(function(m) { return m.id; });
  if (!orderedIds.length) return Promise.resolve();
  return fetchData('reorder_playlist', 'POST', { playlist_id: 1, ordered_ids: orderedIds })
    .then(function(res) {
      if (res && res.success) {
        showToast('Ordem salva ✓');
        return loadPlaylist(); // recarrega IDs novos após delete+insert
      } else {
        showToast('Erro ao salvar ordem', 'danger');
      }
    });
}

// ===================== RENDER =====================
function renderList() {
  var list  = document.getElementById('media-list');
  var empty = document.getElementById('empty-msg');
  document.getElementById('count').textContent = mediaItems.length;
  document.getElementById('status-total').textContent = mediaItems.length + ' itens na playlist';
  var kids = Array.prototype.slice.call(list.children);
  kids.forEach(function(c) { if (c !== empty) list.removeChild(c); });
  if (!mediaItems.length) { empty.style.display = ''; return; }
  empty.style.display = 'none';
  mediaItems.forEach(function(item) {
    var div = document.createElement('div');
    div.className = 'media-item' + (item.id === selectedId ? ' active' : '');
    div.dataset.id = item.id; div.draggable = true;
    var thumb = document.createElement('div'); thumb.className = 'media-thumb';
    if (item.type === 'image') { var img = document.createElement('img'); img.src = item.url; thumb.appendChild(img); }
    else thumb.textContent = '🎬';
    var info = document.createElement('div'); info.className = 'media-info';
    var name = document.createElement('div'); name.className = 'media-name'; name.textContent = item.title || item.name;
    var meta = document.createElement('div'); meta.className = 'media-meta';
    meta.textContent = (item.type === 'image' ? 'Imagem' : 'Vídeo') + ' · ' + (item.duration || 10) + 's';
    info.appendChild(name); info.appendChild(meta);
    var badge = document.createElement('span'); badge.className = 'media-badge ' + (item.type === 'image' ? 'badge-img' : 'badge-vid'); badge.textContent = item.type === 'image' ? 'IMG' : 'VID';
    var drag = document.createElement('span'); drag.className = 'media-drag'; drag.textContent = '⠿';
    div.appendChild(thumb); div.appendChild(info); div.appendChild(badge); div.appendChild(drag);
    div.addEventListener('click', function() { selectItem(item.id); });

    // FIX: usa uma flag booleana em vez de manipular className para controlar
    // o estado de drag — evita acúmulo de classes e quebra no replace()
    var isDragging = false;
    div.addEventListener('dragstart', function(e) {
      isDragging = true;
      // Pequeno delay para o browser capturar o snapshot antes de adicionar a classe
      setTimeout(function() { div.classList.add('dragging'); }, 0);
    });

    div.addEventListener('dragend', function() {
      isDragging = false;
      div.classList.remove('dragging');

      // Lê a ordem visual dos elementos no DOM após o drag
      var order = Array.prototype.slice.call(list.querySelectorAll('.media-item'))
        .map(function(el) { return el.dataset.id; });

      // Reordena o array mediaItems conforme posição visual
      mediaItems.sort(function(a, b) {
        var ia = order.indexOf(String(a.id));
        var ib = order.indexOf(String(b.id));
        if (ia === -1) return 1;
        if (ib === -1) return -1;
        return ia - ib;
      });

      // Atualiza UI imediatamente, depois persiste no banco
      renderList();
      reorderPlaylist();
    });

    div.addEventListener('dragover', function(e) {
      e.preventDefault();
      var dragging = list.querySelector('.dragging');
      if (!dragging || dragging === div) return;
      var mid = div.getBoundingClientRect().top + div.getBoundingClientRect().height / 2;
      list.insertBefore(dragging, e.clientY > mid ? div.nextSibling : div);
    });

    list.appendChild(div);
  });
}

function selectItem(id) {
  selectedId = id;
  var item = null; mediaItems.forEach(function(m) { if (m.id === id) item = m; });
  if (!item) return;
  renderList();
  var pImg = document.getElementById('preview-img');
  var pVid = document.getElementById('preview-vid');
  var pPh  = document.getElementById('preview-placeholder');
  document.getElementById('preview-name').textContent = item.name;
  pImg.style.display = 'none'; pVid.style.display = 'none'; pPh.style.display = 'none';
  if (item.type === 'image') { pImg.src = item.url; pImg.style.display = 'block'; }
  else { pVid.src = item.url; pVid.style.display = 'block'; }
  document.getElementById('item-settings').style.display = 'block';
  document.getElementById('set-title').value    = item.title || '';
  document.getElementById('set-subtitle').value = item.subtitle || '';
  document.getElementById('set-duration').value = item.duration || 10;
  document.getElementById('set-duration').disabled = false;
  document.getElementById('set-transition').value  = item.transition || 'fade';
}

document.getElementById('btn-save-item').addEventListener('click', function() {
  if (!selectedId) return;
  var item = null; mediaItems.forEach(function(m) { if (m.id === selectedId) item = m; });
  if (!item) return;
  item.title    = document.getElementById('set-title').value.trim();
  item.subtitle = document.getElementById('set-subtitle').value.trim();
  item.duration   = parseInt(document.getElementById('set-duration').value) || 10;
  item.transition = document.getElementById('set-transition').value;
  fetchData('playlist_items', 'PUT', {
    id: item.id,
    titulo: item.title,
    subtitulo: item.subtitle,
    duracao: item.duration,
    transicao: item.transition
  }).then(function(res) { if (res && res.success) { renderList(); showToast('Salvo ✓'); } });
});

document.getElementById('btn-remove-item').addEventListener('click', function() {
  if (!selectedId) return;
  fetchData('playlist_items', 'DELETE', { id: selectedId }).then(function(res) {
    if (res && res.success) {
      mediaItems = mediaItems.filter(function(m) { return m.id !== selectedId; });
      selectedId = null;
      document.getElementById('item-settings').style.display = 'none';
      document.getElementById('preview-placeholder').style.display = '';
      renderList(); showToast('Removido');
      // Renumera a ordem após remoção
      reorderPlaylist();
    }
  });
});

document.getElementById('btn-clear-all').addEventListener('click', function() {
  if (!mediaItems.length || !confirm('Limpar playlist?')) return;
  var chain = Promise.resolve();
  mediaItems.forEach(function(item) { if (item.id) chain = chain.then(function() { return fetchData('playlist_items', 'DELETE', { id: item.id }); }); });
  chain.then(function() { mediaItems = []; selectedId = null; document.getElementById('item-settings').style.display = 'none'; renderList(); showToast('Playlist limpa'); });
});

// ===================== CONFIGS =====================
document.getElementById('cfg-loop').addEventListener('change', savePlaylistConfig);
document.getElementById('cfg-default-duration').addEventListener('change', savePlaylistConfig);
document.getElementById('cfg-clock').addEventListener('change', savePlaylistConfig);
function savePlaylistConfig() {
  fetchData('playlists', 'PUT', { id: 1, loop_mode: document.getElementById('cfg-loop').value, default_duration: parseInt(document.getElementById('cfg-default-duration').value) || 10, show_clock: document.getElementById('cfg-clock').value })
    .then(function() { showToast('Configurações salvas ✓'); });
}
function loadPlaylistConfig() {
  return fetchData('playlists').then(function(res) {
    if (res && res.length) {
      var p = res[0];
      document.getElementById('cfg-loop').value             = p.loop_mode;
      document.getElementById('cfg-default-duration').value = p.default_duration;
      document.getElementById('cfg-clock').value            = p.show_clock;
    }
  });
}
function loadPlaylist() {
  return fetchData('playlist_items', 'GET', null, 'playlist_id=1').then(function(res) {
    if (res) {
      mediaItems = res.map(function(item) {
        return {
          id: item.id,
          midia_id: item.midia_id,
          name: item.nome_arquivo,
          type: item.tipo,
          url: absUrl(item.url),
          duration: item.duracao || 10,
          title: item.titulo,
          subtitle: item.subtitulo,
          transition: item.transicao
        };
      });
      renderList();
    }
  });
}

// ===================== TV =====================
function destroyTvVideo() {
  if (!currentTvVideo) return;
  try {
    currentTvVideo.onloadedmetadata = null;
    currentTvVideo.onloadeddata     = null;
    currentTvVideo.oncanplay        = null;
    currentTvVideo.onended          = null;
    currentTvVideo.onerror          = null;
    currentTvVideo.pause();
    currentTvVideo.removeAttribute('src');
    currentTvVideo.load();
  } catch(e) {}
  if (currentTvVideo.parentNode) currentTvVideo.parentNode.removeChild(currentTvVideo);
  currentTvVideo = null;
  var c = document.getElementById('tv-vid-container');
  if (c) c.className = '';
}

function tvImgShow(show) {
  var el = document.getElementById('tv-img');
  if (show) el.className = 'visible'; else el.className = '';
}

document.getElementById('btn-start-tv').addEventListener('click', startTV);
document.getElementById('tv-exit-btn').addEventListener('click', stopTV);
window.exitTV = stopTV;

function startTV() {
  if (!mediaItems.length) { alert('Playlist vazia!'); return; }
  tvActive = true; tvIndex = 0;
  document.getElementById('tv-screen').className = 'active';
  document.getElementById('status-dot').className = 'status-dot active';
  document.getElementById('status-text').textContent = 'Em exibição...';
  document.getElementById('btn-start-tv').disabled = true;
  startClock(); showTvItem();
}

function stopTV() {
  tvActive = false;
  clearTimeout(tvTimer); clearInterval(clockInterval);
  destroyTvVideo();
  document.getElementById('tv-screen').className = '';
  document.getElementById('status-dot').className = 'status-dot';
  document.getElementById('status-text').textContent = 'Parado';
  document.getElementById('btn-start-tv').disabled = false;
  tvImgShow(false);
}

function showTvItem() {
  if (!tvActive || !mediaItems.length) return;
  var item = mediaItems[tvIndex];
  var fade = document.getElementById('tv-fade');

  document.getElementById('tv-counter').textContent = (tvIndex + 1) + ' / ' + mediaItems.length;

  fade.className = 'fading';

  setTimeout(function() {
    tvImgShow(false);
    destroyTvVideo();

    var overlay = document.getElementById('tv-overlay');
    if (item.title) {
      document.getElementById('tv-title-text').textContent = item.title;
      document.getElementById('tv-sub-text').textContent   = item.subtitle || '';
      overlay.className = 'show';
    } else {
      overlay.className = '';
    }

    var dur = (parseInt(item.duration) || 10) * 1000;

    if (item.type === 'image') {
      var tvImg = document.getElementById('tv-img');
      tvImg.onload = function() {
        tvImg.onload = null; tvImg.onerror = null;
        tvImgShow(true);
        fade.className = '';
        startProgress(dur);
        tvTimer = setTimeout(nextTvItem, dur);
      };
      tvImg.onerror = function() {
        tvImg.onload = null; tvImg.onerror = null;
        fade.className = '';
        tvTimer = setTimeout(nextTvItem, 3000);
      };
      tvImg.src = item.url + (item.url.indexOf('?') === -1 ? '?' : '&') + '_t=' + Date.now();

    } else {
      var container = document.getElementById('tv-vid-container');
      var vid = document.createElement('video');
      vid.autoplay = true;
      vid.muted    = true;
      vid.setAttribute('playsinline', '');
      vid.setAttribute('webkit-playsinline', '');
      vid.preload  = 'auto';
      currentTvVideo = vid;

      container.innerHTML = '';
      container.appendChild(vid);
      container.className = 'visible';

      var fallback = setTimeout(function() {
        fallback = null;
        vid.muted = true;
        try { vid.play(); } catch(e) {}
        fade.className = '';
        startProgress(dur);
        tvTimer = setTimeout(nextTvItem, dur + 500);
      }, 3000);

      vid.onloadedmetadata = function() {
        if (fallback) { clearTimeout(fallback); fallback = null; }
        var realDur = (vid.duration && isFinite(vid.duration)) ? vid.duration * 1000 : dur;
        fade.className = '';
        startProgress(realDur);
        tvTimer = setTimeout(nextTvItem, realDur + 500);
      };

      vid.oncanplay = function() {
        vid.oncanplay = null;
        try {
          var p = vid.play();
          if (p && p.catch) p.catch(function() { vid.muted = true; try { vid.play(); } catch(e) {} });
        } catch(e) {}
      };

      vid.onended = function() {
        clearTimeout(tvTimer);
        nextTvItem();
      };

      vid.onerror = function() {
        if (fallback) { clearTimeout(fallback); fallback = null; }
        fade.className = '';
        tvTimer = setTimeout(nextTvItem, 3000);
      };

      vid.src = item.url;
      vid.load();
    }
  }, 380);
}

function nextTvItem() {
  clearTimeout(tvTimer);
  tvIndex++;
  if (tvIndex >= mediaItems.length) {
    if (document.getElementById('cfg-loop').value === 'once') { stopTV(); return; }
    tvIndex = 0;
  }
  showTvItem();
}

function startProgress(duration) {
  var bar = document.getElementById('tv-progress-bar');
  bar.style.transition = 'none';
  bar.style.width = '0%';
  void bar.offsetWidth;
  bar.style.transition = 'width ' + duration + 'ms linear';
  bar.style.width = '100%';
}

function startClock() {
  clearInterval(clockInterval);
  var el = document.getElementById('tv-clock');
  if (document.getElementById('cfg-clock').value === '0') { el.textContent = ''; return; }
  function tick() { var d = new Date(); el.textContent = (d.getHours()<10?'0':'')+d.getHours()+':'+(d.getMinutes()<10?'0':'')+d.getMinutes(); }
  tick(); clockInterval = setInterval(tick, 10000);
}

document.addEventListener('keydown', function(e) {
  if (!tvActive) return;
  if (e.key === 'Escape') stopTV();
  if (e.key === 'ArrowRight' || e.key === ' ') {
    e.preventDefault();
    clearTimeout(tvTimer);
    destroyTvVideo();
    nextTvItem();
  }
});

function init() { loadPlaylistConfig().then(function() { return loadPlaylist(); }); }
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
