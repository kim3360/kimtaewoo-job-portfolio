/* iso.js — 아이소메트릭 라인아트 생성기 (SVG)
   - P(x,y,z): 30° 아이소메트릭 투영
   - box(): 상자 1개 = wire(12개 모서리, 연한 선) + solid(보이는 3면 + 외곽선)
   - hero(): 회사별 재직 개월 수 기둥 6개 + 슬랩 + 격자 + 스캔 평면 + 콜아웃
   - building(): 경력 장면의 프로젝트 층 건물 (층 1개 = 프로젝트 1건)
   데이터에 없는 값은 그리지 않는다: 기둥 높이 = months(재직 개월), 층 수 = projects.length
*/
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  var C30 = Math.cos(Math.PI / 6), S30 = 0.5;

  function s(tag, attrs, kids) {
    var el = document.createElementNS(NS, tag);
    if (attrs) for (var k in attrs) if (attrs[k] != null) el.setAttribute(k, attrs[k]);
    if (kids) kids.forEach(function (c) { if (c) el.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return el;
  }
  function P(x, y, z) { return [(x - y) * C30, (x + y) * S30 - z]; }
  function pts(list) { return list.map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" "); }
  function pathOf(list, close) {
    return list.map(function (p, i) { return (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); }).join(" ") + (close ? " Z" : "");
  }

  /* bounding box tracker */
  function BB() { this.x0 = Infinity; this.y0 = Infinity; this.x1 = -Infinity; this.y1 = -Infinity; }
  BB.prototype.add = function (p) { this.x0 = Math.min(this.x0, p[0]); this.y0 = Math.min(this.y0, p[1]); this.x1 = Math.max(this.x1, p[0]); this.y1 = Math.max(this.y1, p[1]); };
  BB.prototype.view = function (pad) { return [this.x0 - pad, this.y0 - pad, this.x1 - this.x0 + pad * 2, this.y1 - this.y0 + pad * 2].map(function (v) { return v.toFixed(1); }).join(" "); };

  function corners(x, y, z, w, d, h) {
    return {
      a: P(x, y, z), b: P(x + w, y, z), c: P(x + w, y + d, z), dd: P(x, y + d, z),
      e: P(x, y, z + h), f: P(x + w, y, z + h), g: P(x + w, y + d, z + h), hh: P(x, y + d, z + h)
    };
  }

  /* one box -> { g, wire, solid, faces:{top,left,right}, k } */
  function box(x, y, z, w, d, h, bb, cls) {
    var k = corners(x, y, z, w, d, h);
    if (bb) Object.keys(k).forEach(function (n) { bb.add(k[n]); });
    var wireD = [
      [k.a, k.b], [k.b, k.c], [k.c, k.dd], [k.dd, k.a],
      [k.e, k.f], [k.f, k.g], [k.g, k.hh], [k.hh, k.e],
      [k.a, k.e], [k.b, k.f], [k.c, k.g], [k.dd, k.hh]
    ].map(function (seg) { return pathOf(seg); }).join(" ");
    var wire = s("path", { class: "iso-wire", d: wireD, pathLength: 1 });
    var top = s("polygon", { class: "iso-face iso-top", points: pts([k.e, k.f, k.g, k.hh]) });
    var left = s("polygon", { class: "iso-face iso-left", points: pts([k.dd, k.c, k.g, k.hh]) });
    var right = s("polygon", { class: "iso-face iso-right", points: pts([k.b, k.c, k.g, k.f]) });
    var solid = s("g", { class: "iso-solid" }, [left, right, top]);
    var g = s("g", { class: "iso-box" + (cls ? " " + cls : "") }, [wire, solid]);
    return { g: g, wire: wire, solid: solid, faces: { top: top, left: left, right: right }, k: k };
  }

  function isoGrid(x0, x1, y0, y1, step, bb) {
    var d = [];
    for (var x = x0; x <= x1; x += step) d.push(pathOf([P(x, y0, 0), P(x, y1, 0)]));
    for (var y = y0; y <= y1; y += step) d.push(pathOf([P(x0, y, 0), P(x1, y, 0)]));
    if (bb) { bb.add(P(x0, y0, 0)); bb.add(P(x1, y1, 0)); bb.add(P(x1, y0, 0)); bb.add(P(x0, y1, 0)); }
    return s("path", { class: "iso-grid", d: d.join(" ") });
  }

  function text(x, y, str, cls, anchor) {
    return s("text", { x: x.toFixed(1), y: y.toFixed(1), class: cls || "iso-label", "text-anchor": anchor || "start" }, [str]);
  }

  /* ---------------- HERO: tenure pillars ---------------- */
  function hero(svg, exp, opt) {
    svg.innerHTML = "";
    var bb = new BB();
    var PW = 30, GAP = 22, maxM = Math.max.apply(null, exp.map(function (e) { return e.months; }));
    var HMAX = 170, BASE = 16;
    var n = exp.length, len = n * PW + (n - 1) * GAP;
    var grid = isoGrid(-90, len + 90, -90, 130, 20, null);
    var slab = box(-18, -18, -10, len + 36, PW + 36, 10, bb, "iso-slab");
    var pillars = exp.map(function (e, i) {
      var h = BASE + (e.months / maxM) * HMAX;
      var b = box(i * (PW + GAP), 0, 0, PW, PW, h, bb, "iso-pillar");
      b.h = h; b.x = i * (PW + GAP);
      // year label on slab front edge
      var lp = P(b.x + PW / 2, PW + 30, -10);
      b.label = text(lp[0], lp[1] + 4, e.period.start.slice(0, 4), "iso-year", "middle");
      bb.add([lp[0], lp[1] + 8]);
      return b;
    });
    var cur = pillars[n - 1];
    // scan plane (vertical, perpendicular to the slab axis)
    var plane = s("polygon", { class: "iso-plane", points: "" });
    function planeAt(xx) {
      plane.setAttribute("points", pts([P(xx, -22, -10), P(xx, PW + 22, -10), P(xx, PW + 22, HMAX + BASE + 26), P(xx, -22, HMAX + BASE + 26)]));
    }
    planeAt(-30);

    /* ---- callouts for every pillar: side/height chosen per pillar so text & leaders
       never cross other pillars, year labels or the slab (convex SAT test) ---- */
    var obstacles = pillars.map(function (p) { return hull(cornerList(p.k)); });
    var slabHull = hull(cornerList(slab.k));
    var labelRects = pillars.map(function (p) {
      var x = +p.label.getAttribute("x"), y = +p.label.getAttribute("y");
      return rect(x - 16, y - 10, x + 16, y + 4);
    });
    var base = { x0: bb.x0, y0: bb.y0, x1: bb.x1, y1: bb.y1 };
    var FK = (opt.callFont || 11) / 11, LINE = 20 * FK;
    var lineSets = opt.callouts || [];
    function estW(str, bold) {
      var w = 0;
      for (var ci = 0; ci < str.length; ci++) { var ch = str[ci]; w += /[가-힣]/.test(ch) ? 10.6 : ch === " " ? 3 : /[·.]/.test(ch) ? 3.4 : /[A-Z&~㈜()]/.test(ch) ? 8.4 : 6.6; }
      return (w * (bold ? 1.14 : 1) + 6) * FK;
    }
    /* comb callout: dot on the pillar's top face → vertical stem up → one tick + label per line.
       The stem sits on the pillar's centre axis, which never crosses a neighbour (axis spacing 45 > half-width 26),
       so only the label side (left/right) and the block height need to be searched. */
    function place(pi) {
      var p = pillars[pi], L = lineSets[pi] || [];
      var T = P(p.x + PW / 2, PW / 2, p.h);
      var others = obstacles.filter(function (_, k) { return k !== pi; }).concat([slabHull], labelRects);
      var best = null, nL = L.length;
      [1, -1].forEach(function (side) {
        for (var lift = 16; lift <= 240; lift += 6) {
          var yLast = T[1] - lift, y0 = yLast - (nL - 1) * LINE;
          var items = L.map(function (str, j) {
            var y = y0 + j * LINE, jy = y - 4;
            var tx = T[0] + side * 24, w = estW(str, j === 0);
            var r = side > 0 ? rect(tx, y - 12 * FK, tx + w, y + 4 * FK) : rect(tx - w, y - 12 * FK, tx, y + 4 * FK);
            return { str: str, y: y, pts: [T, [T[0], jy], [T[0] + side * 18, jy]], jn: [T[0], jy], tx: tx, r: r };
          });
          var bad = 0, ext = { x0: base.x0, y0: base.y0, x1: base.x1, y1: base.y1 };
          var stem = [T, [T[0], y0 - 4]];
          others.forEach(function (o) { if (sat(stem, o)) bad++; });
          items.forEach(function (it) {
            others.forEach(function (o) { if (sat(it.r, o)) bad++; if (sat([it.pts[1], it.pts[2]], o)) bad++; });
            it.r.forEach(function (q) { ext.x0 = Math.min(ext.x0, q[0]); ext.y0 = Math.min(ext.y0, q[1]); ext.x1 = Math.max(ext.x1, q[0]); ext.y1 = Math.max(ext.y1, q[1]); });
          });
          var grow = (ext.x1 - ext.x0) * (ext.y1 - ext.y0) - (base.x1 - base.x0) * (base.y1 - base.y0);
          var score = bad * 1e7 + grow + lift * 30;
          if (!best || score < best.score) best = { score: score, side: side, items: items, bad: bad };
        }
      });
      return best;
    }
    var callouts = pillars.map(function (p, pi) {
      var pl = place(pi);
      var items = pl.items.map(function (it, j) {
        var line = s("path", { class: "iso-leader", d: pathOf(it.pts), pathLength: 1 });
        var dot = j === 0
          ? s("circle", { class: "iso-dot", cx: it.pts[0][0].toFixed(1), cy: it.pts[0][1].toFixed(1), r: 2.8 })
          : s("circle", { class: "iso-dot iso-dot--jn", cx: it.jn[0].toFixed(1), cy: it.jn[1].toFixed(1), r: 1.8 });
        var t = text(it.tx, it.y, it.str, "iso-call" + (j === 0 ? " iso-call--name" : ""), pl.side > 0 ? "start" : "end");
        if (FK !== 1) t.style.fontSize = ((j === 0 ? 12 : 11) * FK).toFixed(1) + "px";
        it.r.forEach(function (q) { bb.add(q); });
        return { line: line, dot: dot, text: t };
      });
      var g = s("g", { class: "iso-calls", "data-i": pi }, [].concat.apply([], items.map(function (c) { return [c.line, c.dot, c.text]; })));
      return { g: g, items: items, side: pl.side, overlaps: pl.bad };
    });
    var gPillars = s("g", null, pillars.map(function (p) { return p.g; }));
    var gLabels = s("g", null, pillars.map(function (p) { return p.label; }));
    var gCalls = s("g", null, callouts.map(function (c) { return c.g; }));
    svg.appendChild(s("g", null, [grid, slab.g, gLabels, gPillars, plane, gCalls]));
    svg.setAttribute("viewBox", bb.view(14));
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    return { pillars: pillars, slab: slab, plane: plane, planeAt: planeAt, span: [-30, len + 30], callouts: callouts, calls: callouts[n - 1].items, current: cur, grid: grid };
  }

  /* convex geometry helpers (callout placement) */
  function cornerList(k) { return Object.keys(k).map(function (n) { return k[n]; }); }
  function rect(x0, y0, x1, y1) { return [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]; }
  function hull(ptsIn) {
    var p = ptsIn.slice().sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
    function cross(o, a, b) { return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]); }
    var lo = [], up = [];
    p.forEach(function (q) { while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); });
    p.slice().reverse().forEach(function (q) { while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); });
    return lo.slice(0, -1).concat(up.slice(0, -1));
  }
  function sat(A, B) { // convex polygons / segments intersect?
    var polys = [A, B];
    for (var pi = 0; pi < 2; pi++) {
      var P0 = polys[pi];
      for (var i = 0; i < P0.length; i++) {
        var a = P0[i], b = P0[(i + 1) % P0.length];
        var ax = -(b[1] - a[1]), ay = b[0] - a[0];
        if (!ax && !ay) continue;
        var m1 = Infinity, M1 = -Infinity, m2 = Infinity, M2 = -Infinity;
        A.forEach(function (q) { var d = q[0] * ax + q[1] * ay; m1 = Math.min(m1, d); M1 = Math.max(M1, d); });
        B.forEach(function (q) { var d = q[0] * ax + q[1] * ay; m2 = Math.min(m2, d); M2 = Math.max(M2, d); });
        if (M1 <= m2 || M2 <= m1) return false;
      }
    }
    return true;
  }

  /* ---------------- CAREER: project-floor buildings ---------------- */
  var BW = 132, BD = 96, FH = 30, FG = 8, MAXF = 5;
  function site(svg) {
    svg.innerHTML = "";
    var bb = new BB();
    var grid = isoGrid(-120, BW + 120, -120, BD + 120, 24, null);
    var slab = box(-34, -34, -8, BW + 68, BD + 68, 8, bb, "iso-slab");
    // reserve room for the tallest building + callouts
    bb.add(P(0, 0, MAXF * (FH + FG) + 30));
    bb.add([P(BW, 0, 0)[0] + 150, P(BW, 0, MAXF * (FH + FG))[1]]);
    var plane = s("polygon", { class: "iso-plane", points: "" });
    function planeAt(z) {
      plane.setAttribute("points", pts([P(-20, -20, z), P(BW + 20, -20, z), P(BW + 20, BD + 20, z), P(-20, BD + 20, z)]));
    }
    planeAt(-8);
    var layer = s("g", { class: "iso-buildings" });
    svg.appendChild(s("g", null, [grid, slab.g, layer, plane]));
    svg.setAttribute("viewBox", bb.view(10));
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    return { layer: layer, plane: plane, planeAt: planeAt, topZ: function (n) { return n * (FH + FG); } };
  }

  function building(siteObj, floors) {
    var g = s("g", { class: "iso-building" });
    var labelX = P(BW, 0, 0)[0] + 72;
    var items = floors.map(function (f, i) {
      var z = i * (FH + FG);
      var b = box(0, 0, z, BW, BD, FH, null, "iso-floor" + (f.hl ? " is-hl" : ""));
      // leader: right face centre → label column
      var a = P(BW, BD * 0.5, z + FH * 0.5);
      var ly = a[1] - 10 - i * 2;
      var line = s("path", { class: "iso-leader", d: pathOf([a, [labelX - 10, ly], [labelX, ly]]), pathLength: 1 });
      var dot = s("circle", { class: "iso-dot", cx: a[0].toFixed(1), cy: a[1].toFixed(1), r: 2.6 });
      var t = text(labelX + 6, ly + 4, f.label, "iso-call");
      var cg = s("g", { class: "iso-callout" }, [line, dot, t]);
      g.appendChild(b.g);
      return { box: b, line: line, dot: dot, text: t, callout: cg, z: z };
    });
    items.forEach(function (it) { g.appendChild(it.callout); });
    siteObj.layer.appendChild(g);
    return { g: g, floors: items, height: floors.length * (FH + FG) };
  }

  window.ISO = { s: s, P: P, pts: pts, pathOf: pathOf, box: box, hero: hero, site: site, building: building };
})();
