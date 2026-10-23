/* viz.js — 포트폴리오 케이스 도식 (라인아트 SVG)
   flow   : 격자(c,r) 위 노드·엣지·그룹. 좁은 폭에서는 행/열을 바꿔 세로로 흐르게 배치
   layers : 아이소메트릭 슬랩 적층 + 지시선 라벨
   compare: 이전/이후 flow 두 개
   상태: 각 요소는 data-s(단계: 0 문제, 1 해결, 2 결과). setStep(k) → s<=k 요소가 잉크로 그려지고(on), 나머지는 와이어(ghost).
   실제 픽셀 폭으로 레이아웃 → 글자 크기가 화면에서 항상 13px.
*/
(function () {
  "use strict";
  var ISO = window.ISO, svgEl = ISO.s, pathOf = ISO.pathOf;

  /* ---------- text measure (estimate; Pretendard / JetBrains Mono) ---------- */
  function charW(ch, fs, mono) {
    if (/[ㄱ-힝一-鿿]/.test(ch)) return fs * (mono ? 1.0 : 0.94);
    if (ch === " ") return fs * (mono ? 0.6 : 0.28);
    if (mono) return fs * 0.6;
    if (/[A-Z]/.test(ch)) return fs * 0.66;
    if (/[0-9a-z]/.test(ch)) return fs * 0.55;
    return fs * 0.4;
  }
  function textW(str, fs, mono) { var w = 0; for (var i = 0; i < str.length; i++) w += charW(str[i], fs, mono); return w; }
  function wrap(str, maxW, fs, mono) {
    var words = String(str).split(" "), lines = [], cur = "";
    words.forEach(function (wd) {
      var test = cur ? cur + " " + wd : wd;
      if (textW(test, fs, mono) <= maxW || !cur) cur = test;
      else { lines.push(cur); cur = wd; }
      while (textW(cur, fs, mono) > maxW && cur.length > 1) { // hard split
        var cut = cur.length - 1;
        while (cut > 1 && textW(cur.slice(0, cut), fs, mono) > maxW) cut--;
        lines.push(cur.slice(0, cut)); cur = cur.slice(cut);
      }
    });
    if (cur) lines.push(cur);
    return lines;
  }
  function tspanText(x, y, lines, lh, cls, anchor) {
    var t = svgEl("text", { x: x, y: y, class: cls, "text-anchor": anchor || "middle" });
    lines.forEach(function (ln, i) { t.appendChild(svgEl("tspan", { x: x, dy: i ? lh : 0 }, [ln])); });
    return t;
  }

  /* ---------- shapes ---------- */
  function rectD(x, y, w, h, r) {
    if (!r) return "M" + x + " " + y + " h" + w + " v" + h + " h" + (-w) + " Z";
    r = Math.min(r, h / 2, w / 2);
    return "M" + (x + r) + " " + y + " h" + (w - 2 * r) + " a" + r + " " + r + " 0 0 1 " + r + " " + r + " v" + (h - 2 * r) +
      " a" + r + " " + r + " 0 0 1 " + (-r) + " " + r + " h" + (-(w - 2 * r)) + " a" + r + " " + r + " 0 0 1 " + (-r) + " " + (-r) +
      " v" + (-(h - 2 * r)) + " a" + r + " " + r + " 0 0 1 " + r + " " + (-r) + " Z";
  }
  function cylD(x, y, w, h) {
    var ry = 6, rx = w / 2;
    return "M" + x + " " + (y + ry) + " a" + rx + " " + ry + " 0 0 1 " + w + " 0 v" + (h - 2 * ry) + " a" + rx + " " + ry + " 0 0 1 " + (-w) + " 0 Z" +
      " M" + x + " " + (y + ry) + " a" + rx + " " + ry + " 0 0 0 " + w + " 0";
  }
  function shapeD(k, x, y, w, h) {
    if (k === "store" || k === "store-double") return cylD(x, y, w, h);
    if (k === "ext") return rectD(x, y, w, h, Math.min(h / 2, 20));
    return rectD(x, y, w, h, 3);
  }

  var order = 0;
  function delay(el) { el.style.setProperty("--d", (order++ % 14) * 0.06 + "s"); return el; }

  /* ---------- FLOW ---------- */
  function renderFlow(host, spec, width) {
    var nodes = spec.nodes, edges = spec.edges, groups = spec.groups || [];
    var maxC = 0, maxR = 0;
    nodes.forEach(function (n) { maxC = Math.max(maxC, n.c); maxR = Math.max(maxR, n.r); });
    var cols = maxC + 1, rows = maxR + 1;
    var transpose = width < cols * 120 && cols > rows;
    function cr(n) { return transpose ? { c: n.r, r: n.c } : { c: n.c, r: n.r }; }
    if (transpose) { var t = cols; cols = rows; rows = t; }
    var cellW = width / cols;
    var nodeW = Math.min(cellW - 18, 200);
    var FS = 13, LH = 16, SFS = 10.5, SLH = 13;
    var hlSet = {}; (spec.hl || []).forEach(function (id) { hlSet[id] = true; });

    var meas = {};
    nodes.forEach(function (n) {
      var lines = wrap(n.t, nodeW - 16, FS, false);
      var sub = n.sub ? wrap(n.sub, nodeW - 14, SFS, true) : [];
      var h = 14 + lines.length * LH + (sub.length ? 4 + sub.length * SLH : 0) + 8;
      meas[n.id] = { lines: lines, sub: sub, h: Math.max(h, 40), w: nodeW };
    });
    var hasGroup = groups.length > 0;
    var rowH = []; for (var r = 0; r < rows; r++) rowH[r] = 40;
    nodes.forEach(function (n) { var p = cr(n); rowH[p.r] = Math.max(rowH[p.r], meas[n.id].h); });
    var GAPY = 46, TOP = hasGroup ? 28 : 8;
    var rowTop = [], acc = TOP;
    for (r = 0; r < rows; r++) { rowTop[r] = acc; acc += rowH[r] + GAPY; }
    var H = acc - GAPY + 14 + (hasGroup ? 8 : 0);

    var pos = {};
    nodes.forEach(function (n) {
      var p = cr(n), m = meas[n.id];
      pos[n.id] = { x: (p.c + 0.5) * cellW, y: rowTop[p.r] + rowH[p.r] / 2, w: m.w, h: m.h };
    });

    var svg = svgEl("svg", { class: "vz-svg", viewBox: "0 0 " + width.toFixed(0) + " " + H.toFixed(0), width: width.toFixed(0), height: H.toFixed(0), role: "img" });
    var gG = svgEl("g", { class: "vz-groups" }), gE = svgEl("g", { class: "vz-edges" }), gN = svgEl("g", { class: "vz-nodes" });
    svg.appendChild(gG); svg.appendChild(gE); svg.appendChild(gN);

    groups.forEach(function (g) {
      var a = cr({ c: g.c0, r: g.r0 }), b = cr({ c: g.c1, r: g.r1 });
      var c0 = Math.min(a.c, b.c), c1 = Math.max(a.c, b.c), r0 = Math.min(a.r, b.r), r1 = Math.max(a.r, b.r);
      var x = c0 * cellW + 4, y = rowTop[r0] - 22, w = (c1 - c0 + 1) * cellW - 8, h = rowTop[r1] + rowH[r1] - rowTop[r0] + 32;
      var el = svgEl("g", { class: "vz-group", "data-s": g.s });
      el.appendChild(svgEl("path", { class: "vz-ghost", d: rectD(x, y, w, h, 6) }));
      el.appendChild(delay(svgEl("path", { class: "vz-ink vz-ink--group", d: rectD(x, y, w, h, 6), pathLength: 1 })));
      var lw = textW(g.t, 10, true) + 12;
      el.appendChild(svgEl("rect", { class: "vz-tagbg", x: x + 10, y: y - 8, width: lw, height: 16, rx: 2 }));
      el.appendChild(svgEl("text", { class: "vz-tag", x: x + 16, y: y + 3.5 }, [g.t]));
      gG.appendChild(el);
    });

    edges.forEach(function (e) {
      var A = pos[e.a], B = pos[e.b]; if (!A || !B) return;
      var dx = B.x - A.x, dy = B.y - A.y, d, end, dir, mid;
      var horiz = Math.abs(dx) > 1 && (Math.abs(dy) < 1 || Math.abs(dx) >= Math.abs(dy) * 0.9);
      if (horiz) {
        var sx = A.x + Math.sign(dx) * A.w / 2, ex = B.x - Math.sign(dx) * B.w / 2;
        if (Math.abs(dy) < 1) { d = pathOf([[sx, A.y], [ex, B.y]]); mid = [(sx + ex) / 2, A.y]; }
        else { var mx = (sx + ex) / 2; d = pathOf([[sx, A.y], [mx, A.y], [mx, B.y], [ex, B.y]]); mid = [mx, (A.y + B.y) / 2]; }
        end = [ex, B.y]; dir = [Math.sign(dx), 0];
      } else {
        var sy = A.y + Math.sign(dy) * A.h / 2, ey = B.y - Math.sign(dy) * B.h / 2;
        if (Math.abs(dx) < 1) { d = pathOf([[A.x, sy], [B.x, ey]]); mid = [A.x, (sy + ey) / 2]; }
        else { var my = (sy + ey) / 2; d = pathOf([[A.x, sy], [A.x, my], [B.x, my], [B.x, ey]]); mid = [(A.x + B.x) / 2, my]; }
        end = [B.x, ey]; dir = [0, Math.sign(dy)];
      }
      var el = svgEl("g", { class: "vz-edge" + (e.k ? " vz-edge--" + e.k : ""), "data-s": e.s });
      el.appendChild(svgEl("path", { class: "vz-ghost", d: d }));
      var dashed = e.k === "dash" || e.k === "old";
      el.appendChild(delay(svgEl("path", { class: "vz-ink", d: d, pathLength: dashed ? null : 1 })));
      if (e.k !== "old") {
        var ax = end[0], ay = end[1], px = -dir[1], py = dir[0];
        var tri = [[ax, ay], [ax - dir[0] * 7 + px * 3.6, ay - dir[1] * 7 + py * 3.6], [ax - dir[0] * 7 - px * 3.6, ay - dir[1] * 7 - py * 3.6]];
        el.appendChild(svgEl("path", { class: "vz-arrow", d: pathOf(tri, true) }));
      }
      if (e.t) {
        var lw = textW(e.t, 10.5, false) + 10;
        el.appendChild(svgEl("rect", { class: "vz-tagbg", x: mid[0] - lw / 2, y: mid[1] - 9, width: lw, height: 18, rx: 2 }));
        el.appendChild(svgEl("text", { class: "vz-elabel", x: mid[0], y: mid[1] + 4, "text-anchor": "middle" }, [e.t]));
      }
      gE.appendChild(el);
    });

    nodes.forEach(function (n) {
      var p = pos[n.id], m = meas[n.id];
      var x = p.x - p.w / 2, y = p.y - p.h / 2;
      var k = n.k || "";
      var el = svgEl("g", { class: "vz-node vz-node--" + (k || "box") + (hlSet[n.id] ? " is-hlnode" : ""), "data-s": n.s, "data-id": n.id });
      if (k === "double" || k === "store-double") {
        el.appendChild(svgEl("path", { class: "vz-shadow", d: shapeD(k, x + 5, y - 5, p.w, p.h) }));
      }
      el.appendChild(svgEl("path", { class: "vz-fill", d: shapeD(k, x, y, p.w, p.h) }));
      el.appendChild(svgEl("path", { class: "vz-ghost", d: shapeD(k, x, y, p.w, p.h) }));
      el.appendChild(delay(svgEl("path", { class: "vz-ink", d: shapeD(k, x, y, p.w, p.h), pathLength: 1 })));
      var ty = y + (k.indexOf("store") === 0 ? 8 : 0) + 14 + 11;
      var totalTxt = m.lines.length * LH + (m.sub.length ? 4 + m.sub.length * SLH : 0);
      ty = p.y - totalTxt / 2 + 12 + (k.indexOf("store") === 0 ? 4 : 0);
      el.appendChild(tspanText(p.x, ty, m.lines, LH, "vz-label"));
      if (m.sub.length) el.appendChild(tspanText(p.x, ty + m.lines.length * LH + 2, m.sub, SLH, "vz-sub"));
      if (k === "old") el.appendChild(svgEl("path", { class: "vz-strike", d: pathOf([[x + 6, y + p.h - 6], [x + p.w - 6, y + 6]]), pathLength: 1 }));
      gN.appendChild(el);
    });

    host.appendChild(svg);
    return svg;
  }

  /* ---------- LAYERS (isometric stack) ---------- */
  function renderLayers(host, spec, width) {
    var n = spec.layers.length;
    var w = Math.max(110, Math.min(170, width * 0.34)), d = w * 0.62, h = 12, gap = 30;
    var labelW = width - (w + d) * 0.866 - 40;
    var root = svgEl("g");
    var hl = {}; (spec.hl || []).forEach(function (i) { hl[i] = true; });
    var bbX0 = Infinity, bbX1 = -Infinity, bbY0 = Infinity, bbY1 = -Infinity;
    function addB(p) { bbX0 = Math.min(bbX0, p[0]); bbX1 = Math.max(bbX1, p[0]); bbY0 = Math.min(bbY0, p[1]); bbY1 = Math.max(bbY1, p[1]); }
    var slabs = [], labels = [];
    // bottom layer first (last in list)
    for (var i = n - 1; i >= 0; i--) {
      var L = spec.layers[i], z = (n - 1 - i) * (h + gap);
      var b = ISO.box(0, 0, z, w, d, h, null, "vz-slab" + (hl[i] ? " is-hlnode" : ""));
      Object.keys(b.k).forEach(function (kk) { addB(b.k[kk]); });
      var el = svgEl("g", { class: "vz-layer", "data-s": 1 }, [b.g]);
      b.wire.classList.add("vz-ink"); delay(b.wire);
      slabs.push(el);
      var a = ISO.P(w, d * 0.5, z + h / 2);
      labels.push({ a: a, L: L, i: i });
    }
    var lx = Math.max.apply(null, slabs.map(function () { return 0; })) + ISO.P(w, 0, 0)[0] + 26;
    slabs.forEach(function (s) { root.appendChild(s); });
    labels.forEach(function (o) {
      var lines = wrap(o.L.t, labelW - 10, 13, false), sub = o.L.sub ? wrap(o.L.sub, labelW - 10, 10.5, true) : [];
      var y = o.a[1] - 4;
      var g = svgEl("g", { class: "vz-layerlabel", "data-s": 1 });
      g.appendChild(delay(svgEl("path", { class: "vz-ink vz-leader", d: pathOf([o.a, [lx - 6, y], [lx, y]]), pathLength: 1 })));
      g.appendChild(svgEl("circle", { class: "vz-dot", cx: o.a[0], cy: o.a[1], r: 2.6 }));
      g.appendChild(tspanText(lx + 6, y + 4, lines, 16, "vz-label", "start"));
      if (sub.length) g.appendChild(tspanText(lx + 6, y + 4 + lines.length * 16 + 1, sub, 13, "vz-sub", "start"));
      addB([lx + labelW, y + 6 + lines.length * 16 + sub.length * 13]); addB([lx, y - 12]);
      root.appendChild(g);
    });
    var pad = 10, vw = bbX1 - bbX0 + pad * 2, vh = bbY1 - bbY0 + pad * 2;
    var svg = svgEl("svg", { class: "vz-svg vz-svg--layers", viewBox: [bbX0 - pad, bbY0 - pad, vw, vh].map(function (v) { return v.toFixed(1); }).join(" "), width: vw.toFixed(0), height: vh.toFixed(0), role: "img" });
    svg.appendChild(root);
    host.appendChild(svg);
    if (spec.side) {
      var side = document.createElement("div");
      side.className = "vz-side"; side.setAttribute("data-s", "1");
      var t = document.createElement("p"); t.className = "vz-side-title mono"; t.textContent = spec.side.t; side.appendChild(t);
      var ul = document.createElement("ul");
      spec.side.items.forEach(function (it) { var li = document.createElement("li"); li.textContent = it; ul.appendChild(li); });
      side.appendChild(ul);
      host.appendChild(side);
    }
    return svg;
  }

  /* ---------- controller ---------- */
  function create(fig, spec, opts) {
    opts = opts || {};
    var canvas = document.createElement("div");
    canvas.className = "vz-canvas";
    fig.insertBefore(canvas, fig.firstChild);
    var step = opts.initialStep == null ? -1 : opts.initialStep;
    var hlStep = opts.hlStep == null ? 2 : opts.hlStep;
    var lastW = 0;

    function draw() {
      var w = Math.floor(canvas.clientWidth || fig.clientWidth || 600);
      if (Math.abs(w - lastW) < 2 && canvas.firstChild) return;
      lastW = w;
      canvas.innerHTML = ""; order = 0;
      if (spec.type === "flow") renderFlow(canvas, spec, w);
      else if (spec.type === "layers") renderLayers(canvas, spec, w);
      else if (spec.type === "compare") {
        canvas.classList.add("vz-compare");
        var row = w >= 640;
        canvas.classList.toggle("is-row", row);
        var halfW = row ? Math.floor((w - 48) / 2) : w;
        ["before", "after"].forEach(function (key) {
          var part = document.createElement("div");
          part.className = "vz-part vz-part--" + key;
          var lab = document.createElement("p"); lab.className = "vz-part-label mono"; lab.textContent = spec[key].label;
          part.appendChild(lab);
          canvas.appendChild(part);
          renderFlow(part, spec[key].viz, halfW);
        });
      }
      apply(true);
    }
    function apply(instant) {
      if (instant) canvas.classList.add("no-anim");
      Array.prototype.forEach.call(canvas.querySelectorAll("[data-s]"), function (el) {
        var s = +el.getAttribute("data-s");
        el.classList.toggle("on", s <= step);
        el.classList.toggle("cur", s === step);
      });
      canvas.classList.toggle("is-hl", step >= hlStep);
      canvas.classList.toggle("is-past0", step >= 1);
      if (instant) { void canvas.offsetWidth; canvas.classList.remove("no-anim"); }
    }
    function setStep(k) { if (k === step) return; step = k; apply(false); }
    draw();
    return { setStep: setStep, redraw: function () { lastW = 0; draw(); }, resize: draw, get step() { return step; } };
  }

  window.VIZ = { create: create, wrap: wrap, textW: textW };
})();
