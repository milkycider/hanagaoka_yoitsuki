/* ============================================================
   探索者・NPCモーダル まわりは全部このファイルにまとまっています。
   index.html 側は触らなくてOKです。

   ▼ PC名／PL／人物情報を書き足したい時
   下の CHAR_DATA の該当する ho1〜ho12（またはnpc-〜）のオブジェクトに
   文字を入れるだけで、そのカードをクリックした時のモーダルに反映されます。
   例）HO1にPLとPC名が決まったら：
     ho1: { type: 'ho', ho: 'HO1', hoName: '松に鶴',
            pcName: 'PCの名前', plName: 'PL名', plHandle: 'twitterID', bio: '人物紹介文' },
   pcName / plName / bio を空欄のままにしておけば「未定」「今後追加予定」と表示されます。
   ============================================================ */

var CHAR_DATA = {
  ho1:  { type: 'ho', ho: 'HO1',  hoName: '松に鶴',     pcName: '', plName: '', plHandle: '', bio: '' },
  ho2:  { type: 'ho', ho: 'HO2',  hoName: '梅に鶯',     pcName: '', plName: '', plHandle: '', bio: '' },
  ho3:  { type: 'ho', ho: 'HO3',  hoName: '桜に幕',     pcName: '', plName: '', plHandle: '', bio: '' },
  ho4:  { type: 'ho', ho: 'HO4',  hoName: '藤に不如帰',  pcName: '', plName: '', plHandle: '', bio: '' },
  ho5:  { type: 'ho', ho: 'HO5',  hoName: '菖蒲に八橋',  pcName: '', plName: '', plHandle: '', bio: '' },
  ho6:  { type: 'ho', ho: 'HO6',  hoName: '牡丹に蝶',   pcName: '', plName: '', plHandle: '', bio: '' },
  ho7:  { type: 'ho', ho: 'HO7',  hoName: '萩に猪',     pcName: '', plName: '', plHandle: '', bio: '' },
  ho8:  { type: 'ho', ho: 'HO8',  hoName: '芒に月',     pcName: '', plName: '', plHandle: '', bio: '' },
  ho9:  { type: 'ho', ho: 'HO9',  hoName: '菊に盃',     pcName: '', plName: '', plHandle: '', bio: '' },
  ho10: { type: 'ho', ho: 'HO10', hoName: '紅葉に鹿',   pcName: '', plName: '', plHandle: '', bio: '' },
  ho11: { type: 'ho', ho: 'HO11', hoName: '柳に燕',     pcName: '', plName: '', plHandle: '', bio: '' },
  ho12: { type: 'ho', ho: 'HO12', hoName: '桐に鳳凰',   pcName: '', plName: '', plHandle: '', bio: '' },
  'npc-sugawara': {
    type: 'npc', tag: 'NPC1（表 菅原・こいこい）',
    name: '菅原 恋', kana: 'すがわら れん',
    bio: '花ヶ丘高校オカルト研究部部長。みんなを百物語に誘った張本人。<br>メガネとおさげが特徴的な、都市伝説とゴシップ好きの3年生女子。'
  },
  'npc-onomichi': {
    type: 'npc', tag: 'NPC2（柳に小野道風）',
    name: '小野道 幸雨', kana: 'おのみち こう / おのみち しう',
    bio: 'HO11の幼馴染。宇宙に関するオカルトが好き。<br>見た目、性別、性格ともにHO11と要相談。'
  },
  'npc-okada': {
    type: 'npc', tag: 'NPC3',
    name: '岡田 八矢', kana: 'おかだ やつや',
    bio: '花ヶ丘高校オカルト部の顧問。<br>今回宿泊許可を取ってくれた先生で、一応夜間も学校にいる。（彼女が実家に帰って暇なため）'
  }
};

var SILHOUETTE_SVG = '<svg width="120" height="154" viewBox="0 0 60 130" style="display:block; margin:0 auto 22px;"><circle cx="30" cy="24" r="20" fill="oklch(0.4 0.02 50)"/><path d="M8 130 L8 90 Q8 60 30 60 Q52 60 52 90 L52 130 Z" fill="oklch(0.4 0.02 50)"/></svg>';

function renderCharacterModal(data) {
  if (data.type === 'npc') {
    return ''
      + '<div style="font-size:12px; letter-spacing:0.2em; color:oklch(0.75 0.11 85); margin-bottom:18px;">' + data.tag + '</div>'
      + SILHOUETTE_SVG
      + '<h1 style="font-family:\'Shippori Mincho\', serif; font-size:24px; margin:0 0 6px; font-weight:700; color:oklch(0.97 0.008 70);">' + data.name + '</h1>'
      + '<p style="font-size:13px; color:oklch(0.55 0.02 70); margin:0 0 28px;">' + data.kana + '</p>'
      + '<div style="background:oklch(0.18 0.015 50); border:1px solid oklch(0.3 0.02 50); border-radius:10px; padding:26px 20px; text-align:left;">'
      +   '<p style="font-size:14px; line-height:1.9; color:oklch(0.75 0.012 70); margin:0;">' + data.bio + '</p>'
      + '</div>';
  }
  // type === 'ho'：HOを基準に表示。PC名／PLはまだ未定なら空欄のまま出す
  var pcLine = data.pcName ? data.pcName : '（PC名未定）';
  var plLine = data.plName
    ? 'PL：' + data.plName + (data.plHandle ? '（@' + data.plHandle + '）' : '')
    : 'PL：未定';
  var bioBlock = data.bio
    ? data.bio
    : '人物情報は今後追加予定です。<br>決まり次第、こちらのページで公開します。';
  return ''
    + '<div style="font-size:12px; letter-spacing:0.2em; color:oklch(0.8 0.13 85); margin-bottom:18px;">' + data.ho + '　' + data.hoName + '</div>'
    + SILHOUETTE_SVG
    + '<h1 style="font-family:\'Shippori Mincho\', serif; font-size:22px; margin:0 0 6px; font-weight:700; color:oklch(0.97 0.008 70);">' + pcLine + '</h1>'
    + '<p style="font-size:13px; color:oklch(0.55 0.02 70); margin:0 0 28px;">' + plLine + '</p>'
    + '<div style="background:oklch(0.18 0.015 50); border:1px solid oklch(0.3 0.02 50); border-radius:10px; padding:26px 20px; text-align:left;">'
    +   '<p style="font-size:14px; line-height:1.9; color:oklch(0.75 0.012 70); margin:0;">' + bioBlock + '</p>'
    + '</div>';
}

// ▼ モーダルの入れ物（枠・背景・閉じるボタン）をここで組み立ててbodyに追加する
(function buildModalShell() {
  var modal = document.createElement('div');
  modal.id = 'investigator-modal';
  modal.style.cssText = 'display:none; position:fixed; inset:0; z-index:100; align-items:center; justify-content:center; padding:24px;';
  modal.innerHTML = ''
    + '<div id="investigator-modal-backdrop" style="position:absolute; inset:0; background:oklch(0.05 0.01 50 / 0.8); backdrop-filter:blur(4px); -webkit-backdrop-filter:blur(4px);"></div>'
    + '<div style="position:relative; width:100%; max-width:480px; max-height:85vh; overflow-y:auto; background:oklch(0.14 0.015 50); border:1px solid oklch(0.32 0.02 50); border-radius:12px; box-shadow:0 20px 60px rgba(0,0,0,.6);">'
    +   '<button type="button" onclick="closeInvestigatorModal()" aria-label="閉じる" style="position:absolute; top:8px; right:8px; z-index:2; width:32px; height:32px; border-radius:50%; border:none; background:oklch(0.2 0.015 50 / 0.9); color:oklch(0.9 0.012 70); font-size:18px; line-height:1; cursor:pointer; display:flex; align-items:center; justify-content:center;">×</button>'
    +   '<div id="investigator-modal-body" style="padding:56px 28px 36px; text-align:center;"></div>'
    + '</div>';
  document.body.appendChild(modal);
})();

// スクロールバーが消えてガタつかないよう、消える幅ぶんを右パディングで補う
function lockBodyScroll() {
  var scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = scrollbarWidth + 'px';
  }
  document.body.style.overflow = 'hidden';
}
function unlockBodyScroll() {
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
}
function openCharacterModal(key) {
  var data = CHAR_DATA[key];
  var modal = document.getElementById('investigator-modal');
  var body = document.getElementById('investigator-modal-body');
  if (!modal || !body || !data) return;
  body.innerHTML = renderCharacterModal(data);
  modal.scrollTop = 0;
  modal.style.display = 'flex';
  lockBodyScroll();
}
function closeInvestigatorModal() {
  var modal = document.getElementById('investigator-modal');
  if (!modal) return;
  modal.style.display = 'none';
  unlockBodyScroll();
}
(function() {
  var backdrop = document.getElementById('investigator-modal-backdrop');
  if (backdrop) backdrop.addEventListener('click', closeInvestigatorModal);
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeInvestigatorModal();
  });
})();

// ▼ 探索者一覧の表示切替（1列スクロール／2段グリッド）
// 選んだ表示はブラウザに覚えさせておき、次回訪問時も同じ表示にする
function setInvestigatorView(mode) {
  var rowEl = document.getElementById('investigator-view-row');
  var gridEl = document.getElementById('investigator-view-grid');
  var btnRow = document.getElementById('view-toggle-row');
  var btnGrid = document.getElementById('view-toggle-grid');
  if (!rowEl || !gridEl) return;
  if (mode === 'grid') {
    rowEl.style.display = 'none';
    gridEl.style.display = '';
    if (btnRow) btnRow.classList.remove('active');
    if (btnGrid) btnGrid.classList.add('active');
  } else {
    mode = 'row';
    rowEl.style.display = '';
    gridEl.style.display = 'none';
    if (btnGrid) btnGrid.classList.remove('active');
    if (btnRow) btnRow.classList.add('active');
  }
  try { localStorage.setItem('investigatorView', mode); } catch (e) {}
  // 表示を切り替えた直後は幅の計算がずれるので、両端フェードの判定をやり直す
  if (window.updateCharRowFades) requestAnimationFrame(window.updateCharRowFades);
}
(function() {
  var saved = 'row';
  try { saved = localStorage.getItem('investigatorView') || 'row'; } catch (e) {}
  if (saved === 'grid') setInvestigatorView('grid');
})();
