/* ============================================================
   全ページ共通の挙動（ヘッダー／フッターの高さ調整、TOPへ戻る、
   カード列の横スクロール、カウントダウン、BGM）をまとめたファイルです。
   ============================================================ */

// 固定ヘッダーの実際の高さをCSS変数に反映（ナビが折り返しても本文が隠れないように）
(function() {
  var header = document.getElementById('site-header');
  if (!header) return;
  function updateHeaderHeight() {
    document.documentElement.style.setProperty('--header-height', header.offsetHeight + 'px');
  }
  updateHeaderHeight();
  window.addEventListener('resize', updateHeaderHeight);
  window.addEventListener('load', updateHeaderHeight);
})();

// 固定フッターの実際の高さをCSS変数に反映（本文がフッターに隠れないように）
(function() {
  var footer = document.getElementById('site-footer');
  if (!footer) return;
  function updateFooterHeight() {
    document.documentElement.style.setProperty('--footer-height', footer.offsetHeight + 'px');
  }
  updateFooterHeight();
  window.addEventListener('resize', updateFooterHeight);
  window.addEventListener('load', updateFooterHeight);
})();

// 装飾用の花札背景の高さを、実際のページの中身の長さに合わせて調整する
// （元は一番長いページ用に固定3200pxだったため、短いページだと下が余白だらけになっていた）
(function() {
  var wrap = document.getElementById('page-wrap');
  var deco = document.getElementById('deco-cards');
  if (!wrap || !deco) return;
  function updateDecoHeight() {
    deco.style.height = '0px';
    var h = wrap.scrollHeight;
    deco.style.height = h + 'px';
  }
  updateDecoHeight();
  window.addEventListener('load', updateDecoHeight);
  window.addEventListener('resize', updateDecoHeight);
})();

// ページ上部へ戻るボタン：ある程度スクロールしたら表示
(function() {
  var btn = document.getElementById('back-to-top');
  if (!btn) return;
  function updateVisibility() {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }
  updateVisibility();
  window.addEventListener('scroll', updateVisibility, { passive: true });
})();

// ドラッグでの横スクロール対応（スクロールバー非表示のため）／ページ内の全ての探索者カード列に適用
(function() {
  document.querySelectorAll('.char-row, .bring-pair').forEach(function(row) {
    var isDown = false, startX = 0, startScroll = 0, moved = false;
    row.addEventListener('mousedown', function(e) {
      isDown = true; moved = false;
      row.classList.add('dragging');
      startX = e.pageX;
      startScroll = row.scrollLeft;
    });
    window.addEventListener('mousemove', function(e) {
      if (!isDown) return;
      var dx = e.pageX - startX;
      if (Math.abs(dx) > 4) moved = true;
      row.scrollLeft = startScroll - dx;
    });
    window.addEventListener('mouseup', function() {
      isDown = false;
      row.classList.remove('dragging');
    });
    // ドラッグ後のクリックでモーダルが誤って開かないようにする
    row.addEventListener('click', function(e) {
      if (moved) { e.stopPropagation(); e.preventDefault(); }
    }, true);
  });
})();

// 実際に横スクロールが必要な列にだけ、両端のフェードを表示する
(function() {
  function updateRowFades() {
    document.querySelectorAll('.char-row-wrap, .bring-pair-wrap').forEach(function(wrap) {
      var row = wrap.querySelector('.char-row, .bring-pair');
      if (!row) return;
      if (row.scrollWidth > row.clientWidth + 1) {
        wrap.classList.add('scrollable');
      } else {
        wrap.classList.remove('scrollable');
      }
    });
  }
  window.addEventListener('load', updateRowFades);
  window.addEventListener('resize', updateRowFades);
  document.querySelectorAll('details.info-accordion').forEach(function(details) {
    details.addEventListener('toggle', function() {
      requestAnimationFrame(updateRowFades);
    });
  });
  // 探索者一覧の表示切替（1列⇄2段）から、切替直後にフェード判定をやり直せるように公開しておく
  window.updateCharRowFades = updateRowFades;
})();

// 開幕までのカウントダウン（2027-02-03 22:00 JST）
// ヘッダーの小さいカウントダウンは全ページ共通、大きいカウントダウン（#countdown-days）は
// 概要ページ（index.html）にしかないので、どちらか片方だけでも動くようにしてある
(function() {
  var target = new Date('2027-02-03T22:00:00+09:00').getTime();
  var daysEl = document.getElementById('countdown-days');
  var subEl = document.getElementById('countdown-sub');
  var daysHeaderEl = document.getElementById('countdown-days-header');
  if (!daysEl && !daysHeaderEl) return;
  function update() {
    var diff = target - Date.now();
    if (diff <= 0) {
      if (daysEl) daysEl.textContent = '0';
      if (subEl) subEl.textContent = '開催中／開催済み';
      if (daysHeaderEl) daysHeaderEl.textContent = '0';
      return;
    }
    var days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (daysEl) daysEl.textContent = days;
    if (daysHeaderEl) daysHeaderEl.textContent = days;
  }
  update();
  setInterval(update, 60 * 1000);
})();

// BGMトグル（初期状態はミュート。ボタンでミュート解除して再生）
function toggleBgm() {
  var audio = document.getElementById('bgm');
  var iconOff = document.getElementById('bgm-icon-off');
  var iconOn = document.getElementById('bgm-icon-on');
  if (!audio) return;
  if (audio.muted || audio.paused) {
    audio.muted = false;
    audio.play().catch(function() {});
    iconOff.style.display = 'none';
    iconOn.style.display = '';
  } else {
    audio.muted = true;
    audio.pause();
    iconOff.style.display = '';
    iconOn.style.display = 'none';
  }
}
function setBgmVolume(val) {
  var audio = document.getElementById('bgm');
  if (!audio) return;
  audio.volume = val / 100;
}
(function() {
  var audio = document.getElementById('bgm');
  if (audio) audio.volume = 0.23;
})();
