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
  var HOUR = 1000 * 60 * 60;
  var DAY = HOUR * 24;
  var daysEl = document.getElementById('countdown-days');
  var hoursEl = document.getElementById('countdown-hours');
  var subEl = document.getElementById('countdown-sub');
  var daysHeaderEl = document.getElementById('countdown-days-header');
  var pendingEl = document.getElementById('countdown-pending');
  var arrivedEl = document.getElementById('countdown-arrived');
  if (!daysEl && !daysHeaderEl) return;
  function update() {
    var diff = target - Date.now();
    if (diff <= 0) {
      // 開幕を迎えたら、大きいカウントダウンは中身を全部消して「開幕」の一言だけにする
      if (pendingEl) pendingEl.style.display = 'none';
      if (arrivedEl) arrivedEl.style.display = '';
      if (subEl) subEl.textContent = '開催中／開催済み';
      if (daysHeaderEl) daysHeaderEl.textContent = '0日0時間';
      return;
    }
    // 端数を切り上げず、実際に残っている日数・時間数をそのまま表示する
    // （切り上げだと開催1時間前でも「1日」と出てしまうため）
    var days = Math.floor(diff / DAY);
    var hours = Math.floor((diff % DAY) / HOUR);
    if (daysEl) daysEl.textContent = days;
    if (hoursEl) hoursEl.textContent = hours;
    if (daysHeaderEl) daysHeaderEl.textContent = days + '日' + hours + '時間';
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

// ココフォリア非公開コマ変換ツール（日程・会場ページ）
// 貼り付けられたコマ出力JSONの data オブジェクトに secret:true を追加し、
// 任意でキャラクターメモを「PC名の読み方/PL名」に置き換え、
// チャットパレットのダイスコマンドを（正気度ロールを除いて）シークレット化して出力する

// コマンド1行の先頭トークンが「ダイスを振るコマンド」かどうかを判定する
// （例：1D100<=70 / CCB<=75 / 1D3+{DB} / 2D10分間スタン はダイスコマンド、
// 　　　スタン のような数値の無いラベルだけの行はダイスコマンドではない）
function isCcfoliaDiceToken(token) {
  return /^\d*[dD]\d|^CCB|^CC(?![A-Za-z])/i.test(token);
}
// コマンド1行が正気度ロール（SANc）かどうかを判定する
function isCcfoliaSanRoll(line) {
  return /\{SAN\}/i.test(line) || /正気度|SAN[Cc]/.test(line);
}
// 技能判定形式（CCB<= / CC<= / 1d100<= / 1D100<=）は、書き出し元によって表記が
// 揺れるため、判定部分をすべて「CCB<=」に揃える（それ以外のダメージロール等はそのまま）
function normalizeCcfoliaCheckToken(token) {
  var m = token.match(/^(?:CCB|CC|1[dD]100)(<=.*)$/i);
  return m ? 'CCB' + m[1] : null;
}
// 予めシークレットダイスとなるように、コマンド1行の先頭トークンに s を付与する
function secretizeCcfoliaCommandLine(line) {
  var m = line.match(/^(\S+)(.*)$/);
  if (!m) return line;
  var token = m[1];
  var rest = m[2];
  if (isCcfoliaSanRoll(line)) return line; // 正気度ロールは対象外

  var alreadySecret = /^[sS]/.test(token);
  var bareToken = alreadySecret ? token.slice(1) : token;

  var normalized = normalizeCcfoliaCheckToken(bareToken);
  if (normalized) return 's' + normalized + rest; // CCB / CC / 1d100 / 1D100 → sCCB<= に統一

  if (!isCcfoliaDiceToken(bareToken)) return line; // ダイスを振らない行はそのまま
  if (alreadySecret) return line; // 既にs付きのダイスコマンド
  return 's' + token + rest;
}
function convertCcfoliaSecret() {
  var input = document.getElementById('ccfolia-secret-input');
  var output = document.getElementById('ccfolia-secret-output');
  var msg = document.getElementById('ccfolia-secret-message');
  var nameInput = document.getElementById('ccfolia-secret-name');
  var readingInput = document.getElementById('ccfolia-secret-reading');
  var plnameInput = document.getElementById('ccfolia-secret-plname');
  if (!input || !output) return;
  var raw = input.value.trim();
  if (!raw) {
    if (msg) { msg.textContent = 'テキストを貼り付けてください。'; msg.style.color = 'oklch(0.65 0.16 30)'; }
    output.value = '';
    return;
  }
  try {
    var obj = JSON.parse(raw);
    if (!obj || typeof obj.data !== 'object' || obj.data === null) {
      throw new Error('data形式が見つかりません');
    }
    obj.data.secret = true;

    // PCの名前の入力があれば、名前欄をその内容に置き換える
    var name = nameInput ? nameInput.value.trim() : '';
    if (name) {
      obj.data.name = name;
    }

    // PC名の読み方／PL名 の入力があれば、メモ欄をその内容だけに置き換える
    var reading = readingInput ? readingInput.value.trim() : '';
    var plname = plnameInput ? plnameInput.value.trim() : '';
    if (reading || plname) {
      obj.data.memo = 'PC名 / PL名\n' + reading + ' / ' + plname;
    }

    // チャットパレットを、正気度ロール以外シークレットダイス（s付き）に変換する
    if (typeof obj.data.commands === 'string' && obj.data.commands) {
      obj.data.commands = obj.data.commands.split('\n').map(secretizeCcfoliaCommandLine).join('\n');
    }

    output.value = JSON.stringify(obj);
    if (msg) { msg.textContent = '変換しました。「出力をコピー」からコピーしてください。'; msg.style.color = 'oklch(0.75 0.11 85)'; }
  } catch (e) {
    output.value = '';
    if (msg) { msg.textContent = '変換できませんでした。貼り付けたテキストの形式を確認してください。'; msg.style.color = 'oklch(0.65 0.16 30)'; }
  }
}
function copyCcfoliaSecretOutput() {
  var output = document.getElementById('ccfolia-secret-output');
  var msg = document.getElementById('ccfolia-secret-message');
  if (!output) return;
  if (!output.value) {
    if (msg) { msg.textContent = '先に「非公開データに変換」を押してください。'; msg.style.color = 'oklch(0.65 0.16 30)'; }
    return;
  }
  function showCopied() {
    if (msg) { msg.textContent = 'コピーしました。ココフォリアの盤面に貼り付けてください。'; msg.style.color = 'oklch(0.75 0.11 85)'; }
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(output.value).then(showCopied).catch(function() {
      output.select();
      document.execCommand('copy');
      showCopied();
    });
  } else {
    output.select();
    document.execCommand('copy');
    showCopied();
  }
}
