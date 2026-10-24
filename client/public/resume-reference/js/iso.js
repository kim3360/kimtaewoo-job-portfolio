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
    var PW = 30, GAP = 22, maxM = Math.max.apply(null, exp.map(function (e) { return e.months || 1; }));
    var HMAX = 170, BASE = 16;
    var n = exp.length, len = n * PW + (n - 1) * GAP;
    var grid = isoGrid(-90, len + 90, -90, 130, 20, null);
    var slab = box(-18, -18, -10, len + 36, PW + 36, 10, bb, "iso-slab");
    var pillars = exp.map(function (e, i) {
      var h = opt.uniformHeight || (BASE + (e.months / maxM) * HMAX);
      var b = box(i * (PW + GAP), 0, 0, PW, PW, h, bb, "iso-pillar");
      b.h = h; b.x = i * (PW + GAP);
      // year label on slab front edge
      var lp = P(b.x + PW / 2, PW + 30, -10);
      b.label = text(lp[0], lp[1] + 4, opt.labels ? opt.labels[i] : e.period.start.slice(0, 4), "iso-year", "middle");
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

  /* PLIMAP: a vinyl record and tonearm, using the same reveal contract as a floor. */
  function music(siteObj) {
    var center = P(60, 48, 30), radius = 66;
    var projection = "matrix(" + C30 + " 0.5 " + (-C30) + " 0.5 " + center[0] + " " + center[1] + ")";
    var rim = s("ellipse", { class: "music-rim", cx: center[0], cy: center[1] + 7, rx: radius * Math.sqrt(1.5), ry: radius / Math.sqrt(2) });
    var disc = s("g", { class: "music-disc" }, [
      s("circle", { class: "music-vinyl", r: radius }),
      s("g", { class: "music-grooves" }, [28, 34, 40, 46, 52, 58].map(function (r) { return s("circle", { r: r }); })),
      s("path", { class: "music-sheen", d: "M-49 -21 A53 53 0 0 1 -21 -49 M21 49 A53 53 0 0 1 49 21" }),
      s("circle", { class: "music-label", r: 22 }),
      s("path", { class: "music-label-mark", d: "M-7 -9 L10 0 L-7 9 Z" }),
      s("circle", { class: "music-spindle", r: 3 })
    ]);
    var record = s("g", { transform: projection }, [disc]);
    var pivot = P(136, 10, 39), elbow = P(137, 68, 39), needle = P(104, 86, 33);
    var armPath = pathOf([pivot, elbow, needle]);
    var arm = s("g", { class: "music-arm" }, [
      s("circle", { class: "music-pivot", cx: pivot[0], cy: pivot[1], r: 7 }),
      s("path", { class: "music-arm-outline", d: armPath }),
      s("path", { class: "music-arm-inlay", d: armPath }),
      s("path", { class: "music-cartridge", d: pathOf([P(99, 82, 34), P(108, 82, 34), P(108, 95, 34), P(99, 95, 34)], true) })
    ]);
    var solid = s("g", { class: "iso-solid" }, [rim, record, arm]);
    var outline = [];
    for (var i = 0; i <= 72; i++) {
      var a = i / 72 * Math.PI * 2;
      outline.push(P(60 + radius * Math.cos(a), 48 + radius * Math.sin(a), 30));
    }
    var wire = s("path", { class: "iso-wire", d: pathOf(outline, true), pathLength: 1 });
    var object = s("g", { class: "iso-floor iso-music" }, [wire, solid]);
    var anchor = P(106, 94, 30), labelX = 186, labelY = 115;
    var line = s("path", { class: "iso-leader", d: pathOf([anchor, [labelX - 12, labelY], [labelX, labelY]]), pathLength: 1 });
    var dot = s("circle", { class: "iso-dot", cx: anchor[0], cy: anchor[1], r: 2.6 });
    var label = text(labelX + 6, labelY + 4, "MUSIC & MAP", "iso-call");
    var callout = s("g", { class: "iso-callout" }, [line, dot, label]);
    var group = s("g", { class: "iso-building iso-building--music" }, [object, callout]);
    siteObj.layer.appendChild(group);
    return { g: group, height: 42, floors: [{ box: { g: object, wire: wire, solid: solid }, line: line, dot: dot, text: label, callout: callout, z: 0 }] };
  }

  /* Dvely: a code workspace with a floating AI agent. */
  function workspace(siteObj) {
    var base = box(2, 8, 6, 132, 88, 5, null, "workspace-base");
    var deckOrigin = P(2, 8, 11);
    var deck = s("g", { transform: "matrix(" + C30 + " 0.5 " + (-C30) + " 0.5 " + deckOrigin[0] + " " + deckOrigin[1] + ")" });
    for (var row = 0; row < 4; row++) {
      for (var col = 0; col < 10; col++) {
        deck.appendChild(s("rect", { class: "workspace-key", x: 12 + col * 11, y: 13 + row * 10, width: 8, height: 6, rx: 1 }));
      }
    }
    deck.appendChild(s("rect", { class: "workspace-trackpad", x: 45, y: 59, width: 42, height: 19, rx: 3 }));
    var screenOrigin = P(2, 8, 116);
    var screen = s("g", { transform: "matrix(" + C30 + " 0.5 0 1 " + screenOrigin[0] + " " + screenOrigin[1] + ")" }, [
      s("rect", { class: "workspace-shell", width: 132, height: 105, rx: 5 }),
      s("rect", { class: "workspace-display", x: 6, y: 7, width: 120, height: 89, rx: 2 }),
      s("path", { class: "workspace-divider", d: "M6 23 H126 M74 23 V96" }),
      s("circle", { class: "workspace-dot", cx: 13, cy: 15, r: 2 }),
      s("circle", { class: "workspace-dot", cx: 21, cy: 15, r: 2 }),
      s("circle", { class: "workspace-dot", cx: 29, cy: 15, r: 2 }),
      s("path", { class: "workspace-code workspace-code--accent", d: "M16 35 H36 M23 54 H58 M23 73 H47" }),
      s("path", { class: "workspace-code", d: "M23 44 H58 M30 63 H63 M16 82 H35" }),
      s("rect", { class: "workspace-preview-head", x: 82, y: 32, width: 36, height: 17, rx: 2 }),
      s("path", { class: "workspace-preview-lines", d: "M83 58 H115 M83 65 H106 M83 72 H112" }),
      s("rect", { class: "workspace-preview-button", x: 83, y: 81, width: 23, height: 6, rx: 3 })
    ]);
    var agentAt = P(190, 10, 112);
    var agent = s("g", { class: "workspace-agent", transform: "translate(" + agentAt.join(" ") + ")" }, [
      s("g", { class: "workspace-agent-float" }, [
        s("circle", { class: "workspace-agent-halo", r: 27 }),
        s("circle", { class: "workspace-agent-core", r: 21 }),
        s("path", { class: "workspace-spark", d: "M0 -13 Q3 -3 13 0 Q3 3 0 13 Q-3 3 -13 0 Q-3 -3 0 -13 Z" }),
        s("path", { class: "workspace-small-spark", d: "M18 -26 V-16 M13 -21 H23" })
      ])
    ]);
    var solid = s("g", { class: "iso-solid" }, [base.solid, deck, screen, agent]);
    var wire = s("path", { class: "iso-wire", pathLength: 1, d: pathOf([P(2, 8, 116), P(134, 8, 116), P(134, 8, 11), P(134, 96, 11), P(2, 96, 11), P(2, 8, 11)], true) });
    var object = s("g", { class: "iso-floor iso-workspace" }, [wire, solid]);
    var anchor = P(120, 86, 11), labelX = 186, labelY = 113;
    var line = s("path", { class: "iso-leader", d: pathOf([anchor, [labelX - 12, labelY], [labelX, labelY]]), pathLength: 1 });
    var dot = s("circle", { class: "iso-dot", cx: anchor[0], cy: anchor[1], r: 2.6 });
    var label = text(labelX + 6, labelY + 4, "AI WORKSPACE", "iso-call");
    var callout = s("g", { class: "iso-callout" }, [line, dot, label]);
    var group = s("g", { class: "iso-building iso-building--workspace" }, [object, callout]);
    siteObj.layer.appendChild(group);
    return { g: group, height: 116, floors: [{ box: { g: object, wire: wire, solid: solid }, line: line, dot: dot, text: label, callout: callout, z: 0 }] };
  }

  /* Myform Reform: a sports jersey with a stitched patch, needle and thread. */
  function uniform(siteObj) {
    var rack = s("g", { class: "uniform-rack" }, [
      s("path", { class: "uniform-rack-frame", d: pathOf([P(-13, 0, 0), P(-13, 0, 184), P(157, 0, 184), P(157, 0, 0)]) }),
      s("path", { class: "uniform-rack-feet", d: pathOf([P(-13, -15, 0), P(-13, 20, 0)]) + " " + pathOf([P(157, -15, 0), P(157, 20, 0)]) }),
      s("path", { class: "uniform-hanger", d: pathOf([P(74, 0, 184), P(74, 18, 176), P(74, 18, 166), P(43, 18, 148), P(107, 18, 148), P(74, 18, 166)]) })
    ]);
    var fabricBottom = box(13, 57, 1, 73, 47, 5, null, "uniform-swatch-bottom");
    var fabricTop = box(7, 51, 6, 73, 47, 5, null, "uniform-swatch-top");
    var fabricOrigin = P(7, 51, 11);
    var fabricDetail = s("g", { transform: "matrix(" + C30 + " 0.5 " + (-C30) + " 0.5 " + fabricOrigin[0] + " " + fabricOrigin[1] + ")" }, [
      s("path", { class: "uniform-fabric-stripe", d: "M6 0 H16 V47 H6 Z" }),
      s("path", { class: "uniform-fabric-stitch", d: "M3 3 H70 V44 H3 Z" }),
      s("g", { class: "uniform-scissors", transform: "translate(26 0) rotate(-18 22 24)" }, [
        s("path", { class: "uniform-scissor-blade", d: "M17 16 L37 43 L25 24 Z M29 16 L10 43 L23 24 Z" }),
        s("ellipse", { class: "uniform-scissor-grip", cx: 14, cy: 11, rx: 7, ry: 9 }),
        s("ellipse", { class: "uniform-scissor-grip", cx: 32, cy: 11, rx: 7, ry: 9 }),
        s("circle", { class: "uniform-scissor-pivot", cx: 23, cy: 24, r: 2 })
      ])
    ]);
    var origin = P(3, 18, 158);
    var shirtPath = "M43 12 L33 20 L4 47 L25 70 L40 58 V138 H103 V58 L118 70 L139 47 L110 20 L99 12 Q71 27 43 12 Z";
    var jersey = s("g", { transform: "matrix(" + C30 + " 0.5 0 1 " + origin[0] + " " + origin[1] + ")" }, [
      s("path", { class: "uniform-depth", d: shirtPath, transform: "translate(5 -4)" }),
      s("path", { class: "uniform-fabric", d: shirtPath }),
      s("path", { class: "uniform-panel", d: "M43 12 L33 20 L4 47 L13 57 L43 30 L52 23 Z M99 12 L110 20 L139 47 L130 57 L99 30 L90 23 Z M40 58 L48 62 V138 H40 Z M103 58 L95 62 V138 H103 Z" }),
      s("path", { class: "uniform-collar", d: "M43 12 Q71 27 99 12 L93 24 Q71 37 49 24 Z" }),
      s("path", { class: "uniform-seam", d: "M12 48 L25 61 M118 61 L131 48 M48 130 H95" }),
      s("text", { class: "uniform-number", x: 71, y: 80, "text-anchor": "middle" }, ["10"]),
      s("rect", { class: "uniform-patch", x: 57, y: 93, width: 30, height: 22, rx: 3 }),
      s("path", { class: "uniform-patch-stitch", d: "M61 97 H83 V111 H61 Z" }),
      s("path", { class: "uniform-patch-mark", d: "M66 104 L70 108 L79 100" })
    ]);
    var spoolAt = P(132, 82, 18);
    var spool = s("g", { transform: "translate(" + spoolAt.join(" ") + ")" }, [
      s("ellipse", { class: "uniform-spool-end", cy: 7, rx: 19, ry: 8 }),
      s("path", { class: "uniform-thread-body", d: "M-14 -24 H14 V5 Q0 15 -14 5 Z" }),
      s("path", { class: "uniform-thread-lines", d: "M-14 -16 Q0 -7 14 -16 M-14 -10 Q0 -1 14 -10 M-14 -4 Q0 5 14 -4" }),
      s("ellipse", { class: "uniform-spool-end", cy: -24, rx: 19, ry: 8 }),
      s("ellipse", { class: "uniform-spool-hole", cy: -24, rx: 4, ry: 2 })
    ]);
    var needle = s("g", { class: "uniform-needle" }, [
      s("path", { class: "uniform-loose-thread", d: "M64 99 C102 127 122 93 122 66 C122 31 173 48 161 11 C151 -18 122 10 143 20" }),
      s("path", { class: "uniform-needle-body", d: "M119 58 L150 -4 Q153 -10 156 -6 Q159 -3 154 4 Z" }),
      s("path", { class: "uniform-needle-eye", d: "M150 1 L153 -4" })
    ]);
    var solid = s("g", { class: "iso-solid" }, [rack, fabricBottom.g, fabricTop.g, fabricDetail, jersey, needle, spool]);
    var wire = s("path", { class: "iso-wire", pathLength: 1, d: shirtPath, transform: jersey.getAttribute("transform") });
    var object = s("g", { class: "iso-floor iso-uniform" }, [wire, solid]);
    var anchor = P(132, 82, 18), labelX = 186, labelY = 119;
    var line = s("path", { class: "iso-leader", d: pathOf([anchor, [labelX - 12, labelY], [labelX, labelY]]), pathLength: 1 });
    var dot = s("circle", { class: "iso-dot", cx: anchor[0], cy: anchor[1], r: 2.6 });
    var label = text(labelX + 6, labelY + 4, "UNIFORM REFORM", "iso-call");
    var callout = s("g", { class: "iso-callout" }, [line, dot, label]);
    var group = s("g", { class: "iso-building iso-building--uniform" }, [object, callout]);
    siteObj.layer.appendChild(group);
    return { g: group, height: 184, floors: [{ box: { g: object, wire: wire, solid: solid }, line: line, dot: dot, text: label, callout: callout, z: 0 }] };
  }

  function illustration(siteObj, type, wire, solid, anchor, caption, height) {
    var object = s("g", { class: "iso-floor iso-" + type }, [wire, solid]);
    var labelX = 186, labelY = 119;
    var line = s("path", { class: "iso-leader", d: pathOf([anchor, [labelX - 12, labelY], [labelX, labelY]]), pathLength: 1 });
    var dot = s("circle", { class: "iso-dot", cx: anchor[0], cy: anchor[1], r: 2.6 });
    var label = text(labelX + 6, labelY + 4, caption, "iso-call");
    var callout = s("g", { class: "iso-callout" }, [line, dot, label]);
    var group = s("g", { class: "iso-building iso-building--" + type }, [object, callout]);
    siteObj.layer.appendChild(group);
    return { g: group, height: height, floors: [{ box: { g: object, wire: wire, solid: solid }, line: line, dot: dot, text: label, callout: callout, z: 0 }] };
  }

  /* Seobom: an open writing journal, a pen and an AI feedback bubble. */
  function journal(siteObj) {
    var origin = P(-3, 12, 147);
    var matrix = "matrix(" + C30 + " 0.5 0 1 " + origin[0] + " " + origin[1] + ")";
    var left = "M0 6 Q37 -3 75 7 V125 Q37 114 0 124 Z";
    var right = "M75 7 Q112 -3 150 6 V124 Q112 114 75 125 Z";
    var pages = s("g", { transform: matrix }, [
      s("path", { class: "journal-cover", d: "M-4 4 Q36 -8 75 3 Q114 -8 154 4 V131 Q114 121 75 132 Q36 121 -4 131 Z", transform: "translate(2 3)" }),
      s("path", { class: "journal-page", d: left }),
      s("path", { class: "journal-page", d: right }),
      s("path", { class: "journal-fold", d: "M75 7 V125 M3 127 Q37 118 72 128 M78 128 Q112 118 149 127" }),
      s("path", { class: "journal-bookmark", d: "M115 1 V29 L121 24 L127 29 V1 Z" }),
      s("path", { class: "journal-heading", d: "M13 23 H48 M88 38 H129" }),
      s("path", { class: "journal-lines", d: "M13 36 H60 M13 46 H56 M13 56 H61 M13 66 H48 M88 51 H138 M88 61 H134 M88 71 H139 M88 81 H126" }),
      s("path", { class: "journal-highlight", d: "M88 96 H135" }),
      s("path", { class: "journal-checks", d: "M13 88 L17 92 L23 84 M13 103 L17 107 L23 99" }),
      s("path", { class: "journal-lines", d: "M30 88 H58 M30 103 H50" })
    ]);
    var penOrigin = P(8, 96, 15);
    var pen = s("g", { transform: "matrix(" + C30 + " 0.5 " + (-C30) + " 0.5 " + penOrigin[0] + " " + penOrigin[1] + ")" }, [
      s("rect", { class: "journal-pen-body", width: 83, height: 11, rx: 4 }),
      s("path", { class: "journal-pen-nib", d: "M83 0 L104 5.5 L83 11 Z" }),
      s("path", { class: "journal-pen-detail", d: "M12 0 V11 M77 0 V11 M83 5.5 H98 M4 3 H27" }),
      s("circle", { class: "journal-pen-dot", cx: 88, cy: 5.5, r: 1.4 })
    ]);
    var bubbleAt = P(187, 12, 118);
    var bubble = s("g", { transform: "translate(" + bubbleAt.join(" ") + ")" }, [
      s("g", { class: "journal-feedback" }, [
        s("path", { class: "journal-bubble", d: "M-24 -25 H25 Q32 -25 32 -18 V13 Q32 20 25 20 H-5 L-19 30 V20 H-24 Q-31 20 -31 13 V-18 Q-31 -25 -24 -25 Z" }),
        s("path", { class: "journal-feedback-spark", d: "M-12 -17 Q-10 -10 -3 -8 Q-10 -6 -12 1 Q-14 -6 -21 -8 Q-14 -10 -12 -17 Z" }),
        s("path", { class: "journal-feedback-lines", d: "M3 -11 H21 M3 -3 H15 M-19 8 H21" })
      ])
    ]);
    var solid = s("g", { class: "iso-solid" }, [pages, pen, bubble]);
    var wire = s("path", { class: "iso-wire", d: left + " " + right, transform: matrix, pathLength: 1 });
    return illustration(siteObj, "journal", wire, solid, P(100, 96, 15), "WRITE & GROW", 150);
  }

  /* WAIT:IT: mobile queue ticket, calling display and queue barriers. */
  function waiting(siteObj) {
    var origin = P(24, 25, 166);
    var matrix = "matrix(" + C30 + " 0.5 0 1 " + origin[0] + " " + origin[1] + ")";
    var phone = s("g", { transform: matrix }, [
      s("rect", { class: "waiting-phone-depth", x: 5, y: -3, width: 81, height: 154, rx: 10 }),
      s("rect", { class: "waiting-phone", width: 81, height: 154, rx: 10 }),
      s("rect", { class: "waiting-screen", x: 5, y: 6, width: 71, height: 141, rx: 7 }),
      s("rect", { class: "waiting-notch", x: 27, y: 6, width: 27, height: 5, rx: 2.5 }),
      s("text", { class: "waiting-brand", x: 40, y: 30, "text-anchor": "middle" }, ["WAIT:IT"]),
      s("path", { class: "waiting-ticket", d: "M15 42 H66 V57 Q59 61 66 65 V110 H15 V65 Q22 61 15 57 Z" }),
      s("path", { class: "waiting-perforation", d: "M20 61 H61" }),
      s("text", { class: "waiting-caption", x: 40, y: 54, "text-anchor": "middle" }, ["MY NUMBER"]),
      s("text", { class: "waiting-number", x: 40, y: 93, "text-anchor": "middle" }, ["07"]),
      s("path", { class: "waiting-ticket-lines", d: "M26 101 H54" }),
      s("rect", { class: "waiting-status", x: 14, y: 120, width: 53, height: 14, rx: 7 }),
      s("path", { class: "waiting-status-check", d: "M22 127 L25 130 L30 124 M36 127 H58" }),
      s("path", { class: "waiting-home", d: "M30 140 H51" })
    ]);
    var displayOrigin = P(130, 5, 109);
    var display = s("g", { transform: "matrix(" + C30 + " 0.5 0 1 " + displayOrigin[0] + " " + displayOrigin[1] + ")" }, [
      s("rect", { class: "waiting-board-depth", x: 4, y: -3, width: 66, height: 72, rx: 5 }),
      s("rect", { class: "waiting-board", width: 66, height: 72, rx: 5 }),
      s("text", { class: "waiting-board-label", x: 33, y: 17, "text-anchor": "middle" }, ["NOW CALLING"]),
      s("text", { class: "waiting-board-number", x: 33, y: 53, "text-anchor": "middle" }, ["06"]),
      s("path", { class: "waiting-board-dots", d: "M24 63 H26 M32 63 H34 M40 63 H42" })
    ]);
    var posts = [[-2, 77], [71, 113]].map(function (p) {
      var foot = P(p[0], p[1], 0), head = P(p[0], p[1], 37);
      return { head: head, g: s("g", null, [
        s("ellipse", { class: "waiting-post-base", cx: foot[0], cy: foot[1], rx: 12, ry: 6 }),
        s("path", { class: "waiting-post", d: pathOf([foot, head]) }),
        s("circle", { class: "waiting-post-cap", cx: head[0], cy: head[1], r: 5 })
      ]) };
    });
    var a = posts[0].head, b = posts[1].head;
    var rope = s("path", { class: "waiting-rope", d: "M" + a.join(" ") + " Q" + ((a[0] + b[0]) / 2 - 5) + " " + (b[1] + 16) + " " + b.join(" ") });
    var solid = s("g", { class: "iso-solid" }, [display, phone, rope, posts[0].g, posts[1].g]);
    var wire = s("path", { class: "iso-wire", pathLength: 1, transform: matrix, d: "M10 0 H71 Q81 0 81 10 V144 Q81 154 71 154 H10 Q0 154 0 144 V10 Q0 0 10 0 Z" });
    return illustration(siteObj, "waiting", wire, solid, P(71, 113, 0), "MOBILE QUEUE", 166);
  }

  window.ISO = { s: s, P: P, pts: pts, pathOf: pathOf, box: box, hero: hero, site: site, building: building, music: music, workspace: workspace, uniform: uniform, journal: journal, waiting: waiting };
})();
