// SPECTRA — positions.json 기반 목록 렌더링 + 직군 필터 (PRD 10.3, 10.5)
(function () {
  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // 인트로 카드의 "현재 N개 포지션 채용 중" 카운트
  document.querySelectorAll("[data-position-count]").forEach(function (el) {
    var src = el.dataset.src;
    if (!src) return;
    fetch(src)
      .then(function (r) { return r.json(); })
      .then(function (list) { el.textContent = list.length; })
      .catch(function () { el.textContent = "7"; });
  });

  var app = document.getElementById("positions-app");
  if (!app) return;

  var src = app.dataset.src;
  var base = app.dataset.base || "./";
  var filterEl = document.getElementById("positions-filter");
  var rowsEl = document.getElementById("positions-rows");
  var headCountEl = document.getElementById("positions-head-count");

  var TRACKS = ["전체", "개발", "프로덕트"];
  var activeTrack = "전체";
  var data = [];

  function countFor(track) {
    if (track === "전체") return data.length;
    return data.filter(function (p) { return p.track === track; }).length;
  }

  function renderChips() {
    filterEl.innerHTML = TRACKS.map(function (track) {
      var active = track === activeTrack ? " is-active" : "";
      return (
        '<button type="button" class="chip' + active + '" data-track="' + esc(track) + '" aria-pressed="' + (track === activeTrack) + '">' +
        esc(track) + ' <span class="chip__count">' + countFor(track) + "</span>" +
        "</button>"
      );
    }).join("");
  }

  function renderRows() {
    var filtered = activeTrack === "전체" ? data : data.filter(function (p) { return p.track === activeTrack; });

    if (!filtered.length) {
      rowsEl.innerHTML = '<p class="positions-list__empty">해당 직군의 공고가 아직 없습니다.</p>';
      return;
    }

    rowsEl.innerHTML = filtered.map(function (p) {
      return (
        '<a class="list-row" href="' + base + esc(p.slug) + '/">' +
        '<span class="list-row__title">' + esc(p.title) + "</span>" +
        '<span class="list-row__right">' +
        '<span class="list-row__meta"><span>' + esc(p.track) + '</span><span>' + esc(p.experience) + '</span><span>' + esc(p.employment) + "</span></span>" +
        '<span class="list-row__arrow" aria-hidden="true">→</span>' +
        "</span>" +
        "</a>"
      );
    }).join("");
  }

  filterEl.addEventListener("click", function (e) {
    var btn = e.target.closest(".chip");
    if (!btn) return;
    activeTrack = btn.dataset.track;
    renderChips();
    renderRows();
  });

  fetch(src)
    .then(function (r) { return r.json(); })
    .then(function (list) {
      data = list;
      if (headCountEl) headCountEl.textContent = data.length;
      renderChips();
      renderRows();
    })
    .catch(function () {
      rowsEl.innerHTML = '<p class="positions-list__empty">공고를 불러오지 못했습니다. 로컬 서버(예: <code>npx serve</code>)로 열어주세요.</p>';
    });
})();
