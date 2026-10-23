/* 심은성 포트폴리오 — main.js
   1) window.RESUME(js/data.js) → 모든 섹션 렌더링
   2) HERO     : 터미널 타이핑 → 재직 기둥 와이어→솔리드 스캔 → 현재 기둥 하이라이트·콜아웃 → 라임 카드 (자동 재생 1회)
   3) CAREER   : 고정 무대 + 스크롤 '트리거' 단계 이동(스크럽 아님). 장면 전환은 시간 기반 타임라인 (rail-advance / era-shift / counter roll / scan build)
                 클릭·버튼·키보드·장 버튼도 같은 전환을 재생하고 페이지 스크롤을 해당 단계 위치로 맞춤
   4) PORTFOLIO(경력기술서): 프로젝트별 도식, 대표 프로젝트는 스크롤 단계(과제→수행 내용→성과)에 따라 도식 상태 변경
   5) SKILLS   : 프로젝트 기술 목록 기준 사실 막대
   모션 끄기(prefers-reduced-motion, ?motion=reduce) 또는 라이브러리 미로딩 → 최종 상태 정적 표시, 경력은 목록
*/
(function () {
  "use strict";

  var R = window.RESUME;
  if (!R) { console.error("RESUME data missing (js/data.js)"); return; }
  var ISO = window.ISO, VIZ = window.VIZ;

  /* ---------- helpers ---------- */
  function h(tag, attrs, children) {
    var el = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (attrs[k] == null || attrs[k] === false) continue;
      if (k === "class") el.className = attrs[k];
      else if (k === "text") el.textContent = attrs[k];
      else if (k === "style") el.style.cssText = attrs[k];
      else el.setAttribute(k, attrs[k] === true ? "" : attrs[k]);
    }
    append(el, children);
    return el;
  }
  function append(el, children) {
    if (children == null) return el;
    if (!Array.isArray(children)) children = [children];
    children.forEach(function (c) { if (c == null || c === false) return; el.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return el;
  }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function get(path) { return path.split(".").reduce(function (o, k) { return o == null ? o : o[k]; }, R); }
  function slot(name) { return $('[data-slot="' + name + '"]'); }
  function paragraphs(list, cls) { return list.map(function (t) { return h("p", { class: cls, text: t }); }); }
  function tags(list, cls) { return h("ul", { class: "tags" }, list.map(function (t) { return h("li", { class: "tag" + (cls ? " " + cls : ""), text: t }); })); }
  function bullets(list) { return h("ul", { class: "d-bullets" }, list.map(function (t) { return h("li", { text: t }); })); }
  function pad2(n) { return (n < 10 ? "0" : "") + n; }
  function yearOf(ym) { return ym ? ym.slice(0, 4) : null; }
  function fmt(n) { return Math.round(n).toLocaleString("ko-KR"); }
  /* 한글이 든 모노 라벨 → .mono-kr (Pretendard + 고정폭 숫자). JetBrains Mono의 0.6em 공백·자간 때문에 한글이 벌어져 보이는 문제 */
  var MONO_SEL = ".mono, .tag, .badge, .iso-call, .iso-year, .vz-sub, .vz-elabel, .vz-tag, .vz-steps li, .vz-cap";
  var HANGUL = /[ㄱ-ㆎ가-힣]/;
  function tagMonoKr(root) {
    $$(MONO_SEL, root).forEach(function (el) { el.classList.toggle("mono-kr", HANGUL.test(el.textContent)); });
  }

  var EXP = R.experience.slice().sort(function (a, b) { return a.order - b.order; });
  var N = EXP.length;
  var CASES = R.portfolio.cases;
  var NC = CASES.length;
  var casesOf = {}; EXP.forEach(function (e) { casesOf[e.id] = CASES.filter(function (c) { return c.company === e.id; }); });
  var featuredIds = {}; CASES.forEach(function (c) { if (c.featured) featuredIds[c.id] = true; });
  var NPROJ = EXP.reduce(function (a, e) { return a + e.projects.length; }, 0);

  /* ---------- mode ---------- */
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (/[?&]motion=reduce/.test(location.search)) reduce = true;
  var libsOk = !!(window.gsap && window.ScrollTrigger && window.Flip && window.Lenis);
  if (!libsOk && !reduce) console.warn("Animation libraries not loaded — showing static layout.");
  var MOTION = !reduce && libsOk;
  document.documentElement.classList.add(MOTION ? "is-motion" : "is-static");
  // ?debug=1 → 화면 하단에 모드/원인 표시 (실기기 확인용, 기본 숨김)
  if (/[?&]debug=1/.test(location.search)) (function () {
    var errs = [], box = document.createElement("pre");
    box.style.cssText = "position:fixed;left:8px;right:8px;bottom:8px;z-index:99999;margin:0;padding:8px 10px;font:11px/1.45 monospace;white-space:pre-wrap;background:#111;color:#e8ff5a;border-radius:6px;opacity:.92;pointer-events:none";
    function paint() {
      var libs = ["gsap", "ScrollTrigger", "Flip", "Lenis"].map(function (k) { return k + (window[k] ? "✓" : "✗"); }).join(" ");
      box.textContent = "mode: " + (MOTION ? "motion" : "static") + (reduce ? " (reduced-motion)" : "") + "\nlibs: " + libs +
        "\nhero: " + (window.__hero ? Math.round(window.__hero.progress() * 100) + "%" : "-") + "  vw: " + innerWidth + "×" + innerHeight +
        "\nerrors: " + (errs.length ? errs.join(" | ") : "0") + "\n" + navigator.userAgent;
    }
    window.addEventListener("error", function (e) { errs.push(e.message || (e.target && e.target.src) || "error"); paint(); }, true);
    document.body.appendChild(box); paint(); setInterval(paint, 500);
  })();
  var gsap = window.gsap, ScrollTrigger = window.ScrollTrigger, Flip = window.Flip;
  if (MOTION) gsap.registerPlugin(ScrollTrigger, Flip);

  /* ---------- static bindings ---------- */
  $$("[data-bind]").forEach(function (el) { el.textContent = get(el.getAttribute("data-bind")) || ""; });
  var cur = EXP[N - 1];
  var curTitle = (cur.department ? cur.department + " " : "") + cur.cardTitle;
  slot("badge").innerHTML = "";
  append(slot("badge"), [h("span", { class: "badge-dot", "aria-hidden": "true", text: "●" }), " ", h("span", { text: curTitle }), h("span", { class: "badge-at", text: " · " + cur.companyShort })]);

  /* ---------- about ---------- */
  append(slot("summary"), paragraphs(R.summary.paragraphs));
  var email = R.basics.email, career = R.overview.career, edu = R.overview.education;
  function fact(label, value) { return h("div", null, [h("dt", { class: "mono", text: label }), h("dd", null, value)]); }
  append(slot("facts"), [
    fact("이메일", h("a", { href: "mailto:" + email, text: email })),
    fact("총 경력", [career.total, h("br"), career.currentCompany + " " + career.status]),
    fact("학력", [edu.school, h("br"), edu.level])
  ]);
  append(slot("highlights"), R.summary.highlights.map(function (hl) {
    return h("div", { class: "highlight" }, [h("h3", { class: "highlight-label", text: hl.label })].concat(paragraphs(hl.paragraphs)));
  }));

  /* ---------- skills (factual bars) ---------- */
  append(slot("competencies"), R.coreCompetencies.items.map(function (t) { return h("li", { text: t }); }));
  var SS = R.skillStats;
  slot("skill-measure").textContent = SS.measure;
  var maxP = Math.max.apply(null, SS.items.map(function (s) { return s.projects; }));
  var withBars = SS.items.filter(function (s) { return s.projects > 0; });
  var noBars = SS.items.filter(function (s) { return s.projects === 0; });
  append(slot("skills"), h("ul", { class: "stat-list" }, withBars.map(function (s) {
    var ratio = s.projects / NC;
    return h("li", { class: "stat-row" + (s.projects === maxP ? " is-max" : "") }, [
      h("span", { class: "stat-name", text: s.name }),
      h("span", { class: "stat-bar", "aria-hidden": "true" }, h("span", { class: "stat-fill", style: "--r:" + ratio.toFixed(4) })),
      h("span", { class: "stat-val mono" }, [h("b", { text: String(s.projects) }), " / " + NC + "건 · " + s.companies + "개사"]),
      h("span", { class: "stat-span mono", text: s.span ? s.span[0] + "–" + (s.span[1] >= 2026 ? "현재" : s.span[1]) : "" })
    ]);
  })));
  if (noBars.length) append(slot("skills-rest"), [
    h("p", { class: "stats-rest-label", text: "프로젝트 기술 목록에 별도 기재가 없는 스킬" }),
    tags(noBars.map(function (s) { return s.name; }))
  ]);

  /* ---------- education / letter / footer ---------- */
  function record(date, title, meta, desc) {
    return h("div", { class: "record" }, [
      h("p", { class: "record-date mono", text: date }),
      h("div", null, [
        h("p", { class: "record-title", text: title }),
        meta ? h("p", { class: "record-meta", text: meta }) : null,
        desc && desc.length ? h("ul", { class: "record-desc" }, desc.map(function (d) { return h("li", { text: d }); })) : null
      ])
    ]);
  }
  append(slot("education"), R.education.map(function (e) { return record(e.period, e.school, [e.schoolType, e.major, e.status].join(" "), null); }));
  append(slot("activities"), R.activities.items.map(function (a) { return record(a.period, a.name, null, a.description); }));
  append(slot("certifications"), R.certifications.items.map(function (c) { return record(c.date, c.name, c.status + ", " + c.issuer, null); }));
  append(slot("letter"), paragraphs(R.coverLetter.paragraphs));
  var fe = slot("footer-email"); fe.href = "mailto:" + email; fe.textContent = email;

  /* ==================================================================
     HERO
     ================================================================== */
  var CMD = "eunseong.career({ since: " + yearOf(EXP[0].period.start) + " })";
  var OUT1 = "› loading " + N + " companies";
  var OUT2 = "✓ " + career.total.replace(/^총\s*/, "") + " · " + N + " companies · " + NPROJ + " projects";
  $("[data-term-sr]").textContent = OUT2.replace("✓ ", "총 경력 ");
  var termCmd = $("[data-term-cmd]"), termOut = $("[data-term-out]"), termBadge = $("[data-term-badge]");
  var caret1 = $("[data-term-caret1]"), caret2 = $("[data-term-caret2]");

  slot("limecard-since").textContent = yearOf(EXP[0].period.start) + " — NOW";
  slot("limecard-sub").textContent = "백엔드부터 웹 UI까지 설계하고 구현";
  var lcRows = R.hero.bars.map(function (b, i) {
    var r = b.months / R.hero.bars[0].months;
    return h("div", { class: "lc-row" }, [
      h("span", { class: "lc-label mono", text: b.label }),
      h("span", { class: "lc-bar", "aria-hidden": "true" }, h("span", { class: "lc-fill", style: "--r:" + r.toFixed(4) })),
      h("span", { class: "lc-val mono", text: b.value })
    ]);
  });
  append(slot("limecard-rows"), lcRows);
  slot("limecard-note").textContent = R.hero.barMeasure;

  var heroSvg = slot("hero-svg");
  function roleText(e) { return e.department && e.cardTitle.indexOf(e.department) < 0 ? e.department + " · " + e.cardTitle : e.cardTitle; }
  var calloutSets = EXP.map(function (e) { return [e.companyShort, e.period.label, roleText(e), "프로젝트 " + e.projects.length + "건"]; });
  var HERO = ISO.hero(heroSvg, EXP, { callouts: calloutSets, callFont: window.innerWidth < 641 ? 14 : 11 }); // 모바일은 SVG 축소율(≈0.77)을 보정
  heroSvg.insertBefore(ISO.s("title", null, ["회사별 재직 기간 기둥 6개, 2009년 넷매니아부터 현재 스튜디오레논까지. 기둥을 누르면 해당 회사의 기간·직위·프로젝트 수를 표시합니다."]), heroSvg.firstChild);

  /* hero pillars: every pillar is a button → it becomes the active (lime) pillar with its callouts */
  var heroActive = N - 1, heroLive = $("[data-hero-live]"), careerJump = null;
  function heroLabel(e) { return e.companyShort + ", " + e.period.start.replace("-", ".") + "부터 " + (e.period.current ? "재직중" : e.period.end.replace("-", ".") + "까지") + ", " + roleText(e) + ", 프로젝트 " + e.projects.length + "건"; }
  HERO.callouts.forEach(function (c, i) {
    if (i !== heroActive) { c.g.style.visibility = "hidden"; c.g.style.opacity = "0"; }
    c.g.appendChild(ISO.s("title", null, ["경력 섹션에서 " + EXP[i].companyShort + " 보기"]));
    c.g.addEventListener("click", function () { if (careerJump) careerJump(i); });
  });
  HERO.pillars.forEach(function (p, i) {
    p.g.setAttribute("tabindex", "0");
    p.g.setAttribute("role", "button");
    p.g.setAttribute("aria-label", heroLabel(EXP[i]));
    p.g.setAttribute("aria-pressed", i === heroActive ? "true" : "false");
    p.g.addEventListener("click", function () { heroSelect(i); });
    p.g.addEventListener("keydown", function (ev) { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); heroSelect(i); } });
  });
  function heroSelect(i) {
    if (window.__hero && window.__hero.progress() < 1) window.__hero.progress(1); // 인트로 중이면 즉시 완료
    if (i === heroActive) return;
    var pc = HERO.callouts[heroActive], nc = HERO.callouts[i];
    HERO.pillars[heroActive].g.classList.remove("is-hl"); HERO.pillars[heroActive].g.setAttribute("aria-pressed", "false");
    HERO.pillars[i].g.classList.add("is-hl"); HERO.pillars[i].g.setAttribute("aria-pressed", "true");
    heroActive = i;
    if (heroLive) heroLive.textContent = heroLabel(EXP[i]);
    var parts = function (c) { return [c.g].concat.apply([c.g], c.items.map(function (it) { return [it.line, it.dot, it.text]; })); };
    if (!MOTION) {
      pc.g.style.visibility = "hidden"; pc.g.style.opacity = "0";
      nc.g.style.visibility = ""; nc.g.style.opacity = "";
      return;
    }
    gsap.killTweensOf(parts(pc).concat(parts(nc)));
    gsap.to(pc.g, { autoAlpha: 0, duration: 0.22, ease: "power1.out" });
    gsap.set(nc.g, { autoAlpha: 1 });
    nc.items.forEach(function (it, k) {
      var d = k * 0.07;
      gsap.fromTo(it.dot, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15, delay: d });
      gsap.fromTo(it.line, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.42, ease: "power2.out", delay: d });
      gsap.fromTo(it.text, { autoAlpha: 0, x: -8 * nc.side }, { autoAlpha: 1, x: 0, duration: 0.38, ease: "power3.out", delay: 0.24 + d });
    });
  }
  slot("hero-cap").textContent = "기둥 높이 = 회사별 재직 개월 수 (재직중은 2026.10 기준) · 왼쪽부터 " + EXP.map(function (e) { return e.companyShort.replace("㈜", ""); }).join(" → ");

  function heroFinal() {
    termCmd.textContent = CMD; termOut.textContent = OUT2; termBadge.textContent = "● DONE";
    caret1.hidden = true;
    heroSvg.classList.add("is-built");
    HERO.current.g.classList.add("is-hl");
    HERO.planeAt(-200); HERO.plane.style.opacity = 0;
  }

  function heroMotion() {
    var tl = gsap.timeline({ delay: 0.25 });
    var typer = { n: 0 }, typer2 = { n: 0 }, typer3 = { n: 0 };
    termCmd.textContent = ""; termOut.textContent = ""; caret2.hidden = true;
    gsap.set(".term", { autoAlpha: 0, y: 12 });
    gsap.set(HERO.grid, { autoAlpha: 0 });
    gsap.set(HERO.slab.g, { autoAlpha: 0 });
    HERO.pillars.forEach(function (p) { gsap.set(p.wire, { strokeDashoffset: 1 }); gsap.set(p.solid, { autoAlpha: 0 }); gsap.set(p.label, { autoAlpha: 0 }); });
    HERO.calls.forEach(function (c) { gsap.set(c.line, { strokeDashoffset: 1 }); gsap.set([c.dot, c.text], { autoAlpha: 0 }); });
    gsap.set(HERO.plane, { autoAlpha: 0 });
    gsap.set("[data-limecard]", { autoAlpha: 0, y: 48 });
    gsap.set(".lc-fill", { scaleX: 0 });

    tl.to(".term", { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }, 0);
    tl.to(typer, { n: CMD.length, duration: CMD.length * 0.04, ease: "none", onUpdate: function () { termCmd.textContent = CMD.slice(0, Math.round(typer.n)); } }, 0.35);
    var tRun = 0.35 + CMD.length * 0.04 + 0.3;
    tl.call(function () { termBadge.textContent = "▶ RUN"; caret1.hidden = true; caret2.hidden = false; }, null, tRun);
    tl.to(typer2, { n: OUT1.length, duration: OUT1.length * 0.03, ease: "none", onUpdate: function () { termOut.textContent = OUT1.slice(0, Math.round(typer2.n)); } }, tRun);
    // build: grid → slab → wireframe → scan
    tl.to(HERO.grid, { autoAlpha: 1, duration: 0.5 }, tRun);
    tl.to(HERO.slab.g, { autoAlpha: 1, duration: 0.4 }, tRun + 0.1);
    tl.to(HERO.pillars.map(function (p) { return p.wire; }), { strokeDashoffset: 0, duration: 0.7, stagger: 0.07, ease: "power2.out" }, tRun + 0.2);
    tl.to(HERO.pillars.map(function (p) { return p.label; }), { autoAlpha: 1, duration: 0.3, stagger: 0.07 }, tRun + 0.3);
    var tScan = tRun + 0.8, scanDur = 1.7;
    var sweep = { x: HERO.span[0] };
    tl.to(HERO.plane, { autoAlpha: 1, duration: 0.15 }, tScan);
    tl.to(sweep, { x: HERO.span[1], duration: scanDur, ease: "none", onUpdate: function () { HERO.planeAt(sweep.x); } }, tScan);
    HERO.pillars.forEach(function (p) {
      var at = tScan + scanDur * ((p.x + 15 - HERO.span[0]) / (HERO.span[1] - HERO.span[0]));
      tl.to(p.solid, { autoAlpha: 1, duration: 0.22, ease: "power1.out" }, at);
    });
    tl.to(HERO.plane, { autoAlpha: 0, duration: 0.2 }, tScan + scanDur);
    var tDone = tScan + scanDur + 0.05;
    tl.call(function () { termBadge.textContent = "● DONE"; }, null, tDone);
    tl.to(typer3, { n: OUT2.length, duration: OUT2.length * 0.022, ease: "none", onStart: function () { termOut.textContent = ""; }, onUpdate: function () { termOut.textContent = OUT2.slice(0, Math.round(typer3.n)); } }, tDone);
    tl.call(function () { HERO.current.g.classList.add("is-hl"); }, null, tDone + 0.15);
    HERO.calls.forEach(function (c, i) {
      tl.to(c.dot, { autoAlpha: 1, duration: 0.15 }, tDone + 0.3 + i * 0.12);
      tl.to(c.line, { strokeDashoffset: 0, duration: 0.45, ease: "none" }, tDone + 0.3 + i * 0.12);
      tl.to(c.text, { autoAlpha: 1, duration: 0.3 }, tDone + 0.65 + i * 0.12);
    });
    tl.to("[data-limecard]", { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" }, tDone + 0.5);
    tl.to(".lc-fill", { scaleX: function (i, el) { return parseFloat(el.style.getPropertyValue("--r")); }, duration: 0.7, stagger: 0.1, ease: "power2.out" }, tDone + 0.85);
    tl.call(function () { heroSvg.classList.add("is-built"); }, null, tl.duration());
    window.__hero = tl;
  }

  /* ==================================================================
     DETAIL CONTENT (shared by dialog / list / print)
     ================================================================== */
  function detailContent(e, headingId, level) {
    var H = "h" + level, H2 = "h" + (level + 1), H3 = "h" + (level + 2);
    var facts = e.titles.map(function (t) { return [t.label === "직위" ? "직위" : "직함 (" + t.label + ")", t.text]; });
    if (e.department) facts.push(["부서", e.department]);
    if (e.jobFunction) facts.push(["직무", e.jobFunction]);
    var nodes = [
      h("p", { class: "d-period mono" }, [e.period.label, e.duration ? "  (" + e.duration + ")" : ""]),
      h(H, { class: "d-company", id: headingId, text: e.companyShort }),
      h("p", { class: "d-legal", text: e.company }),
      h("dl", { class: "d-facts" }, facts.map(function (f) { return h("div", null, [h("dt", { text: f[0] }), h("dd", { text: f[1] })]); })),
      h("p", { class: "d-summary", text: e.summary })
    ];
    if (e.keyMetrics) nodes.push(h(H2, { class: "d-h", text: "주요 성과" }), bullets(e.keyMetrics));
    if (e.relatedWorks) nodes.push(h(H2, { class: "d-h", text: "참여 작품" }), h("p", { text: e.relatedWorks.join(", ") }));
    if (e.userAdditions) {
      var ua = e.userAdditions;
      nodes.push(h("section", { class: "d-added" }, [
        h(H2, { class: "d-h", text: ua.title }),
        bullets(ua.items.map(function (i) { return i.text; })),
        ua.tech && ua.tech.length ? tags(ua.tech.map(function (t) { return t.name; }), "tag--added") : null
      ]));
    }
    nodes.push(h(H2, { class: "d-h", text: "프로젝트 " + e.projects.length + "건" }));
    nodes.push(h("ol", { class: "d-projects" }, e.projects.map(function (p) {
      var sub = [];
      if (p.tech && p.tech.length) sub.push(["기술", tags(p.tech)]);
      if (p.techMentioned) sub.push(["함께 사용", tags(p.techMentioned)]);
      if (p.clients) sub.push(["고객사", h("span", { text: p.clients.join(", ") })]);
      if (p.pipelineStages) sub.push(["처리 단계", h("ol", { class: "d-stages" }, p.pipelineStages.map(function (s) { return h("li", { text: s }); }))]);
      var caseId = "case-" + e.id + "-" + p.no;
      return h("li", { class: "d-project" }, [
        h(H3, { class: "d-project-name" }, [h("span", { class: "d-project-no mono", text: pad2(p.no) }), p.name]),
        h("p", { class: "d-role", text: "역할: " + p.role }),
        bullets(p.achievements)
      ].concat(sub.map(function (s) { return h("div", { class: "d-sub" }, [h("span", { class: "d-sub-label", text: s[0] }), s[1]]); }))
        .concat([h("a", { class: "d-case-link", href: "#" + caseId, "data-case-link": caseId, text: "경력기술서에서 보기" })]));
    })));
    return nodes;
  }

  /* ==================================================================
     CAREER — shared builders
     ================================================================== */
  slot("film-count").textContent = "/ " + N + " companies";
  function floorsOf(e) {
    return e.projects.map(function (p) { return { label: pad2(p.no), hl: !!featuredIds[e.id + "-" + p.no] }; });
  }
  function monthsText(e) { return e.period.current ? "재직중 · 2026.10 기준 " + e.months + "개월" : e.duration + " · " + e.months + "개월"; }

  /* static list (reduced motion / print / no-JS-libs) */
  var listEl = slot("career-list");
  var listBtns = [];
  EXP.forEach(function (e, i) {
    var svg = ISO.s("svg", { class: "iso-svg cl-iso", "aria-hidden": "true" });
    var siteO = ISO.site(svg); var b = ISO.building(siteO, floorsOf(e));
    siteO.plane.style.display = "none";
    svg.classList.add("is-built");
    var detail = h("div", { class: "cl-detail", id: "cl-detail-" + e.id, role: "region", "aria-labelledby": "cl-dh-" + e.id, hidden: true }, detailContent(e, "cl-dh-" + e.id, 4));
    var btn = h("button", { type: "button", class: "btn btn--line", "aria-expanded": "false", "aria-controls": detail.id, text: "상세 보기" });
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", open ? "false" : "true");
      btn.textContent = open ? "상세 보기" : "상세 닫기";
      detail.hidden = open;
    });
    listBtns.push(btn);
    listEl.appendChild(h("article", { class: "cl-item", id: "cl-" + e.id, "aria-labelledby": "cl-h-" + e.id }, [
      h("div", { class: "cl-head" }, [
        h("p", { class: "cl-meta mono", text: pad2(i + 1) + " / " + pad2(N) + " · " + e.period.label }),
        h("h3", { class: "cl-company", id: "cl-h-" + e.id, text: e.companyShort }),
        h("p", { class: "cl-title", text: e.cardTitle }),
        h("p", { class: "cl-months mono", text: monthsText(e) }),
        h("p", { class: "cl-summary", text: e.summary }),
        h("ol", { class: "scene-projects" }, e.projects.map(function (p) {
          return h("li", null, h("a", { href: "#case-" + e.id + "-" + p.no }, [h("span", { class: "mono", text: pad2(p.no) }), " " + p.name]));
        })),
        btn
      ]),
      h("div", { class: "cl-figure" }, svg),
      detail
    ]));
  });

  /* ==================================================================
     PORTFOLIO
     ================================================================== */
  slot("pf-count").textContent = "/ " + NC + " projects";
  var pfRail = slot("pf-rail"), pfCases = slot("pf-cases");
  var railLinks = [];
  append(pfRail, h("ol", null, EXP.map(function (e, i) {
    var a = h("a", { href: "#pf-" + e.id, class: "pf-rail-link" }, [
      h("span", { class: "mono pf-rail-year", text: yearOf(e.period.start) }),
      h("span", { class: "pf-rail-name", text: e.companyShort.replace("㈜", "") }),
      h("span", { class: "mono pf-rail-n", text: String(casesOf[e.id].length) })
    ]);
    railLinks.push(a);
    return h("li", null, a);
  })));

  var vizCtrls = [];
  var STEP_OF = { problem: 0, solution: 1, result: 2 };

  EXP.forEach(function (e, gi) {
    var list = casesOf[e.id];
    var group = h("section", { class: "pf-group", id: "pf-" + e.id, "aria-labelledby": "pfg-" + e.id }, [
      h("header", { class: "pf-group-head" }, [
        h("p", { class: "mono pf-group-meta", text: pad2(gi + 1) + " / " + pad2(N) + " · " + e.period.label }),
        h("h3", { class: "pf-group-name", id: "pfg-" + e.id, text: e.companyShort }),
        h("p", { class: "pf-group-title", text: e.cardTitle + " · 프로젝트 " + list.length + "건" })
      ])
    ]);
    list.forEach(function (c) {
      var hasResult = c.blocks.some(function (b) { return b.key === "result"; });
      var stepped = c.featured && c.blocks.length > 1;
      var fig = h("figure", { class: "case-viz" + (c.viz.type === "layers" ? " case-viz--layers" : "") });
      var stepsLegend = stepped ? h("ol", { class: "vz-steps mono", "aria-hidden": "true" }, c.blocks.map(function (b) {
        return h("li", { "data-step": STEP_OF[b.key], text: b.label });
      })) : null;
      if (stepsLegend) fig.appendChild(stepsLegend);
      var blocks = h("div", { class: "case-blocks" }, c.blocks.map(function (b) {
        return h("section", { class: "blk blk--" + b.key, "data-step": STEP_OF[b.key] }, [
          h("h5", { class: "blk-label mono" }, [h("span", { class: "blk-no", text: pad2(STEP_OF[b.key] + 1) }), b.label]),
          h("ul", { class: "blk-items" }, b.items.map(function (it) { return h("li", null, [it.text]); }))
        ]);
      }));
      var metrics = c.metrics ? h("div", { class: "case-metrics" }, c.metrics.map(function (m) {
        return h("div", { class: "metric" }, [
          h("p", { class: "metric-num" }, [m.prefix ? h("span", { class: "metric-pre", text: m.prefix }) : null, h("span", { class: "metric-val", "data-count": m.value, text: fmt(m.value) }), h("span", { class: "metric-unit", text: m.unit })]),
          h("p", { class: "metric-label mono", text: m.label })
        ]);
      })) : null;
      var art = h("article", { class: "case" + (c.featured ? " case--featured" : ""), id: "case-" + c.id, "aria-labelledby": "ct-" + c.id }, [
        h("header", { class: "case-head" }, [
          h("p", { class: "case-meta mono" }, [h("span", { text: "PROJECT " + pad2(c.no) + " / " + NC }), c.featured ? h("span", { class: "badge badge--lime badge--sm", text: "● 대표 프로젝트" }) : null]),
          h("h4", { class: "case-title", id: "ct-" + c.id, text: c.title }),
          h("p", { class: "case-role" }, [h("span", { class: "mono", text: "역할" }), " " + c.role]),
          h("blockquote", { class: "case-line" }, [h("p", { class: "case-line-label mono", text: "이력서 한 줄" }), h("p", { class: "case-line-text", text: c.oneLine.text })])
        ]),
        h("div", { class: "case-body" + (stepped ? " is-stepped" : "") }, [blocks, fig]),
        metrics,
        h("div", { class: "case-tech" }, [h("span", { class: "mono case-tech-label", text: "기술" }), tags(c.tech)])
      ]);
      group.appendChild(art);
      vizCtrls.push({ c: c, fig: fig, art: art, blocks: blocks, stepped: stepped, hasResult: hasResult, legend: stepsLegend });
    });
    pfCases.appendChild(group);
  });

  // create viz after layout is in the DOM (needs real width)
  vizCtrls.forEach(function (v) {
    var hlStep = v.hasResult ? 2 : Math.max.apply(null, v.c.blocks.map(function (b) { return STEP_OF[b.key]; }));
    v.ctrl = VIZ.create(v.fig, v.c.viz, { initialStep: MOTION ? -1 : 9, hlStep: hlStep });
  });
  var lastVW = window.innerWidth;
  var resizeT;
  window.addEventListener("resize", function () {
    clearTimeout(resizeT);
    resizeT = setTimeout(function () {
      vizCtrls.forEach(function (v) { v.ctrl.resize(); tagMonoKr(v.fig); });
      if (MOTION && Math.abs(window.innerWidth - lastVW) > 2) { lastVW = window.innerWidth; ScrollTrigger.refresh(); }
    }, 150);
  });

  tagMonoKr(document);

  /* ==================================================================
     STATIC MODE
     ================================================================== */
  if (!MOTION) {
    heroFinal();
    var filmHead = $(".film-head");
    $("[data-film-hint]").textContent = "회사별 기록을 시간 순서로 정리했습니다. 상세 보기로 전체 기록을 펼칠 수 있습니다.";
    listEl.parentNode.insertBefore(filmHead, listEl);
    $("[data-film]").hidden = true;
    $$(".stat-fill, .lc-fill").forEach(function (el) { el.style.transform = "scaleX(" + el.style.getPropertyValue("--r") + ")"; });
    $$(".vz-steps li").forEach(function (li) { li.classList.add("on"); });
    careerJump = function (i) { var el = document.getElementById("cl-" + EXP[i].id); if (el) { el.scrollIntoView(); el.setAttribute("tabindex", "-1"); el.focus({ preventScroll: true }); } };
    return;
  }

  /* ==================================================================
     MOTION MODE
     ================================================================== */
  var lenis = new window.Lenis({ lerp: 0.1, wheelMultiplier: 0.9, smoothWheel: true, anchors: { offset: -72 } });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
  gsap.ticker.lagSmoothing(0);
  heroMotion();

  /* ---------- CAREER FILM (click-to-advance) ----------
     무대는 일반 100svh 블록(핀·스크럽 없음). 장면 전환은 시간 기반 GSAP 타임라인.
     클릭/Enter/Space/→ = 다음, ← = 이전, 장 버튼 = 바로 이동. 전환 중 입력 → 진행 중 전환을 즉시 완료 후 다음 전환 시작. */
  var film = $("[data-film]");
  var stage = $("[data-film-stage]");
  var infoEl = slot("film-info"), filmSvg = slot("film-svg"), track = $("[data-rail-track]"), reelHost = $("[data-rail-reel]");
  var sweepEl = $("[data-film-sweep]"), liveEl = $("[data-film-live]");
  var SITE = ISO.site(filmSvg);
  SITE.planeAt(0); // 평면은 z=0 기준 좌표로 한 번만 만들고, 높이는 transform(y = -z)으로 이동
  var buildings = EXP.map(function (e) { return ISO.building(SITE, floorsOf(e)); });

  // rail geometry (months → px)
  function mIdx(ym) { var p = ym.split("-"); return (+p[0]) * 12 + (+p[1]) - 1; }
  var RAIL0 = mIdx("2009-01"), RAIL1 = mIdx("2026-12");
  var monthPx = 9;
  var segs = [], dots = [], fills = [];
  function buildRail() {
    track.innerHTML = "";
    monthPx = window.innerWidth < 641 ? 5 : 9;
    track.style.width = ((RAIL1 - RAIL0 + 1) * monthPx) + "px";
    for (var y = 2009; y <= 2026; y++) {
      var x = (y * 12 - RAIL0) * monthPx;
      track.appendChild(h("span", { class: "rail-tick" + (y % 5 === 0 ? " is-major" : ""), style: "left:" + x + "px" }, h("span", { class: "rail-year mono", text: String(y) })));
    }
    segs = []; dots = []; fills = [];
    EXP.forEach(function (e, i) {
      var s0 = mIdx(e.period.start), s1 = e.period.current ? mIdx("2026-10") : mIdx(e.period.end);
      var left = (s0 - RAIL0) * monthPx, w = (s1 - s0 + 1) * monthPx;
      var fill = h("span", { class: "rail-fill" });
      var seg = h("span", { class: "rail-seg", style: "left:" + left + "px;width:" + w + "px" }, [fill, h("span", { class: "rail-seg-name", text: e.companyShort.replace("㈜", "") })]);
      var dot = h("span", { class: "rail-dot", style: "left:" + left + "px" });
      track.appendChild(seg); track.appendChild(dot);
      segs.push({ el: seg, left: left, w: w }); dots.push(dot); fills.push(fill);
    });
  }
  buildRail();
  var vw = window.innerWidth;
  function nowX() { return (vw < 641 ? 0.18 : 0.3) * vw; }
  function railX(i) { return nowX() - segs[i].left; }

  // counter reel (rolling digits) — YYYY.MM
  function ymText(e) { return e.period.start.replace("-", "."); }
  function ymDigits(i) { return ymText(EXP[i]).replace(".", ""); }
  reelHost.innerHTML = "";
  var reelCols = [];
  ymText(EXP[0]).split("").forEach(function (ch) {
    if (/\d/.test(ch)) {
      var col = h("span", { class: "reel-col" }, "0123456789".split("").map(function (d) { return h("span", { text: d }); }));
      reelHost.appendChild(h("span", { class: "reel-cell" }, col)); reelCols.push(col);
    } else reelHost.appendChild(h("span", { class: "reel-fixed", text: ch }));
  });

  // info scenes
  var scenes = EXP.map(function (e, i) {
    var cap = "$ open career/" + pad2(i + 1) + " --since " + ymText(e);
    var capEl = h("span", { class: "scene-cap-text", text: cap });
    var nameIn = h("span", { class: "scene-name-in", text: e.companyShort });
    var detailBtn = h("button", { type: "button", class: "btn btn--ink", "aria-haspopup": "dialog", "data-open": i }, ["상세 보기", h("span", { class: "visually-hidden", text: " — " + e.companyShort + " 전체 기록" })]);
    var caseLink = h("a", { class: "btn btn--line", href: "#case-" + casesOf[e.id][0].id }, ["프로젝트 " + casesOf[e.id].length + "건 보기"]);
    var monthsEl = h("b", { class: "scene-count", text: String(e.months) });
    var el = h("article", { class: "scene", "data-i": i, "aria-roledescription": "장면", "aria-labelledby": "scene-h-" + e.id }, [
      h("p", { class: "scene-cap mono", "aria-hidden": "true" }, capEl),
      h("p", { class: "scene-meta mono", text: pad2(i + 1) + " / " + pad2(N) + " · " + e.period.label }),
      h("h3", { class: "scene-name", id: "scene-h-" + e.id }, nameIn),
      h("p", { class: "scene-title", text: e.cardTitle }),
      h("p", { class: "scene-stats mono" }, [monthsEl, "개월", h("span", { class: "scene-stat-sep", text: " · " }), e.period.current ? "재직중 (2026.10 기준)" : e.duration, h("span", { class: "scene-stat-sep", text: " · " }), "프로젝트 " + e.projects.length + "건"]),
      h("p", { class: "scene-summary", text: e.summary }),
      h("ol", { class: "scene-projects" }, e.projects.map(function (p) {
        return h("li", { "data-floor": p.no - 1 }, h("a", { href: "#case-" + e.id + "-" + p.no }, [h("span", { class: "mono", text: pad2(p.no) }), " " + p.name]));
      })),
      h("div", { class: "scene-actions" }, [detailBtn, caseLink])
    ]);
    infoEl.appendChild(el);
    // hover / focus project → highlight its floor
    $$(".scene-projects li", el).forEach(function (li) {
      var f = buildings[i].floors[+li.getAttribute("data-floor")];
      function on() { f.box.g.classList.add("is-hover"); f.callout.classList.add("is-hover"); }
      function off() { f.box.g.classList.remove("is-hover"); f.callout.classList.remove("is-hover"); }
      li.addEventListener("mouseenter", on); li.addEventListener("mouseleave", off);
      li.addEventListener("focusin", on); li.addEventListener("focusout", off);
    });
    // 장면 안의 버튼은 전환을 일으키지 않음
    detailBtn.addEventListener("click", function (ev) { ev.stopPropagation(); });
    caseLink.addEventListener("click", function (ev) {
      ev.stopPropagation(); ev.preventDefault();
      var tgt = document.getElementById(caseLink.getAttribute("href").slice(1));
      if (tgt) lenis.scrollTo(tgt, { offset: -72, duration: 1.2 });
    });
    return {
      el: el, cap: capEl, capLen: cap.length, name: nameIn, months: monthsEl, btn: detailBtn,
      head: $$(".scene-meta, .scene-title, .scene-stats", el),
      rest: $$(".scene-summary, .scene-projects li, .scene-actions", el)
    };
  });

  // controls: ◀ 이전 · 장 버튼 · 다음 ▶ (n/6)
  var chapterBtns = [];
  var chapterBar = h("span", { class: "chap-fill" });
  var prevBtn = h("button", { type: "button", class: "film-nav film-nav--prev", "aria-label": "이전 회사" }, [h("span", { class: "film-nav-arrow", "aria-hidden": "true", text: "◀" }), h("span", { class: "film-nav-label", text: "이전" })]);
  var nextLabel = h("span", { class: "film-nav-label", text: "다음" });
  var nextArrow = h("span", { class: "film-nav-arrow", "aria-hidden": "true", text: "▶" });
  var nextCount = h("span", { class: "film-nav-count mono", "aria-hidden": "true", text: "1/" + N });
  var nextBtn = h("button", { type: "button", class: "film-nav film-nav--next" }, [nextLabel, nextArrow, nextCount]);
  append(slot("film-chapters"), [
    h("div", { class: "film-ctrl" }, [
      prevBtn,
      h("ol", { class: "chap-list" }, EXP.map(function (e, i) {
        var b = h("button", { type: "button", class: "chap-btn", "data-i": i, "aria-label": (i + 1) + " / " + N + " " + e.companyShort + "로 이동" }, [h("span", { class: "mono chap-year", text: yearOf(e.period.start) }), h("span", { class: "chap-name", text: e.companyShort.replace("㈜", "") })]);
        chapterBtns.push(b);
        return h("li", null, b);
      })),
      nextBtn
    ]),
    h("span", { class: "chap-track", "aria-hidden": "true" }, chapterBar)
  ]);

  /* ---------- scene states ---------- */
  var filmIdx = -1;   // -1 = 인트로 전 (아무것도 그려지지 않음)
  var filmTl = null;  // 진행 중 전환
  var planeY = function (z) { return -z; };

  function sceneState(k, on) {
    var sc = scenes[k];
    gsap.set(sc.el, { autoAlpha: on ? 1 : 0, x: 0 });
    gsap.set(sc.cap, { clipPath: on ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)" });
    gsap.set(sc.name, { yPercent: on ? 0 : 110 });
    gsap.set(sc.head.concat(sc.rest), { autoAlpha: on ? 1 : 0, y: on ? 0 : 12 });
    sc.months.textContent = String(on ? EXP[k].months : 0);
  }
  function buildingState(k, on) {
    var b = buildings[k];
    gsap.set(b.g, { autoAlpha: on ? 1 : 0, y: 0 });
    b.floors.forEach(function (f) {
      gsap.set([f.box.wire, f.line], { strokeDashoffset: on ? 0 : 1 });
      gsap.set([f.box.solid, f.dot, f.text], { autoAlpha: on ? 1 : 0 });
    });
  }
  function settle(i) {
    gsap.set(track, i < 0 ? { x: railX(0) + 200, autoAlpha: 0 } : { x: railX(i), autoAlpha: 1 });
    gsap.set(sweepEl, { x: 0, autoAlpha: 0 });
    gsap.set(SITE.plane, { autoAlpha: 0, y: 0 });
    fills.forEach(function (f, k) { gsap.set(f, { scaleX: k <= i ? 1 : 0 }); });
    dots.forEach(function (d, k) { gsap.set(d, { scale: k <= i ? 1 : 0 }); });
    segs.forEach(function (sg, k) { sg.el.classList.toggle("is-cur", k === i); });
    var dg = ymDigits(Math.max(0, i));
    reelCols.forEach(function (col, k) { gsap.set(col, { yPercent: -(+dg[k]) * 10 }); });
    scenes.forEach(function (sc, k) { sceneState(k, k === i); });
    buildings.forEach(function (b, k) { buildingState(k, k === i); });
    gsap.set(chapterBar, { scaleX: (i + 1) / N });
  }

  function setActive(i) {
    scenes.forEach(function (sc, k) {
      if (k === i) { sc.el.removeAttribute("inert"); sc.el.removeAttribute("aria-hidden"); }
      else {
        // 사라지는 장면 안에 포커스가 있었다면 무대로 옮겨 포커스 유실 방지
        if (sc.el.contains(document.activeElement)) stage.focus({ preventScroll: true });
        sc.el.setAttribute("inert", ""); sc.el.setAttribute("aria-hidden", "true");
      }
    });
    chapterBtns.forEach(function (b, k) { if (k === i) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current"); });
    segs.forEach(function (sg, k) { sg.el.classList.toggle("is-cur", k === i); });
    var last = i === N - 1;
    prevBtn.setAttribute("aria-disabled", i <= 0 ? "true" : "false");
    nextLabel.textContent = last ? "경력기술서로" : "다음";
    nextArrow.textContent = last ? "↓" : "▶";
    nextCount.textContent = (i + 1) + "/" + N;
    nextCount.hidden = last;
    nextBtn.setAttribute("aria-label", last ? "경력기술서 섹션으로 이동" : "다음 회사: " + EXP[i + 1].companyShort + " (현재 " + (i + 1) + " / " + N + ")");
    nextBtn.classList.toggle("is-last", last);
    var e = EXP[i];
    liveEl.textContent = (i + 1) + " / " + N + " " + e.companyShort + ", " + e.period.label;
  }

  /* 전환 타임라인 a → b (a = -1 이면 인트로). 약 1.6초. transform / opacity / stroke-dashoffset 위주. */
  var TB_LINK = 0.45; // 새 장면 조립 시작 시점
  function sceneIn(t, i, tb, dir) {
    var sc = scenes[i], e = EXP[i];
    t.fromTo(sc.el, { autoAlpha: 0, x: 28 * dir }, { autoAlpha: 1, x: 0, duration: 0.55, ease: "power3.out" }, tb);
    t.fromTo(sc.cap, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.45, ease: "steps(" + sc.capLen + ")" }, tb);
    t.fromTo(sc.name, { yPercent: 110 }, { yPercent: 0, duration: 0.7, ease: "expo.out" }, tb + 0.1);
    t.fromTo(sc.head, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.05, ease: "power2.out" }, tb + 0.18);
    t.fromTo(sc.rest, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.035, ease: "power2.out" }, tb + 0.32);
    var cnt = { v: 0 };
    t.fromTo(cnt, { v: 0 }, { v: e.months, duration: 0.8, ease: "power2.out", onUpdate: function () { sc.months.textContent = String(Math.round(cnt.v)); } }, tb + 0.22);
  }
  function buildingIn(t, i, tb) {
    var b = buildings[i], top = b.height;
    t.fromTo(b.g, { autoAlpha: 0, y: -10 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }, tb - 0.05);
    t.fromTo(b.floors.map(function (f) { return f.box.wire; }), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.45, stagger: 0.05, ease: "power1.out" }, tb);
    b.floors.forEach(function (f) { gsap.set([f.box.solid, f.dot, f.text], { autoAlpha: 0 }); gsap.set(f.line, { strokeDashoffset: 1 }); });
    var scanAt = tb + 0.22, scanDur = 0.6;
    t.fromTo(SITE.plane, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1, ease: "none" }, scanAt);
    t.fromTo(SITE.plane, { y: planeY(-8) }, { y: planeY(top + 4), duration: scanDur, ease: "power1.inOut" }, scanAt);
    b.floors.forEach(function (f) {
      var at = scanAt + scanDur * Math.max(0, (f.z + 15) / (top + 12));
      t.to(f.box.solid, { autoAlpha: 1, duration: 0.15, ease: "none" }, at);
      t.to(f.dot, { autoAlpha: 1, duration: 0.1 }, at + 0.08);
      t.to(f.line, { strokeDashoffset: 0, duration: 0.28, ease: "power1.out" }, at + 0.08);
      t.to(f.text, { autoAlpha: 1, duration: 0.15 }, at + 0.26);
    });
    t.to(SITE.plane, { autoAlpha: 0, duration: 0.12 }, scanAt + scanDur);
  }

  function finishTransition() {
    if (!filmTl) return;
    var t = filmTl; filmTl = null;
    t.progress(1); t.kill();
    film.classList.remove("is-moving");
  }

  /* 장면 요청: 전환 중이면 진행 중 전환을 가속(x3.5)해 마무리하고, 끝나면 최신 목표로 한 번만 이동 (쌓이지 않음) */
  var wantIdx = -1;
  function request(b) {
    if (b < 0 || b >= N) return;
    wantIdx = b;
    if (filmTl) {
      if (b !== filmIdx) { setActive(b); filmTl.timeScale(Math.max(filmTl.timeScale(), 3.5)); }
      else { setActive(b); filmTl.timeScale(1); }
      return;
    }
    goTo(b);
  }

  function goTo(b) {
    if (b < 0 || b >= N) return;
    finishTransition();
    var a = filmIdx;
    if (b === a) return;
    var dir = a < 0 || b > a ? 1 : -1;
    filmIdx = b; wantIdx = b;
    setActive(b);
    film.classList.add("is-moving");
    var t = gsap.timeline({ defaults: { ease: "power2.out" }, onComplete: function () {
      if (filmTl !== t) return;
      filmTl = null; film.classList.remove("is-moving");
      if (wantIdx !== filmIdx) goTo(wantIdx);
    } });
    filmTl = t;
    var tb = TB_LINK;
    /* rail-advance */
    if (a < 0) t.fromTo(track, { x: railX(b) + 200, autoAlpha: 0 }, { x: railX(b), autoAlpha: 1, duration: 1.1, ease: "power3.out" }, 0);
    else t.to(track, { x: railX(b), duration: 1.05, ease: "power3.inOut" }, 0);
    if (a >= 0) {
      var sc0 = scenes[a], b0 = buildings[a];
      /* 이전 장면 퇴장 */
      t.to(sc0.el, { autoAlpha: 0, x: -28 * dir, duration: 0.35, ease: "power2.in" }, 0);
      t.to(b0.floors.map(function (f) { return f.box.solid; }), { autoAlpha: 0, duration: 0.22, stagger: { each: 0.03, from: "end" } }, 0);
      t.to([].concat.apply([], b0.floors.map(function (f) { return [f.dot, f.text]; })), { autoAlpha: 0, duration: 0.18 }, 0);
      t.to(b0.g, { autoAlpha: 0, y: 18, duration: 0.38, ease: "power2.in" }, 0.06);
      /* era-shift: 라임 경계선이 진행 방향으로 화면을 가로지름 */
      t.fromTo(sweepEl, { x: dir > 0 ? vw : 0, autoAlpha: 1 }, { x: dir > 0 ? 0 : vw, duration: 0.75, ease: "power2.inOut" }, 0.02);
      t.to(sweepEl, { autoAlpha: 0, duration: 0.14, ease: "none" }, 0.68);
      /* counter reel */
      var from = ymDigits(a), to = ymDigits(b);
      reelCols.forEach(function (col, k) {
        if (from[k] !== to[k]) t.fromTo(col, { yPercent: -(+from[k]) * 10 }, { yPercent: -(+to[k]) * 10, duration: 0.85, ease: "power3.inOut" }, 0.04 + k * 0.03);
      });
    } else {
      var dg = ymDigits(b);
      reelCols.forEach(function (col, k) { gsap.set(col, { yPercent: -(+dg[k]) * 10 }); });
    }
    /* gantt fills / dots */
    fills.forEach(function (f, k) {
      if (k < b && gsap.getProperty(f, "scaleX") < 1) t.to(f, { scaleX: 1, duration: 0.45, ease: "power2.out" }, 0);
      else if (k > b && gsap.getProperty(f, "scaleX") > 0) t.to(f, { scaleX: 0, duration: 0.45, ease: "power2.inOut" }, 0);
    });
    if (gsap.getProperty(fills[b], "scaleX") < 1) t.fromTo(fills[b], { scaleX: 0 }, { scaleX: 1, duration: 1.0, ease: "power1.inOut", immediateRender: false }, tb);
    dots.forEach(function (d, k) {
      if (k < b && gsap.getProperty(d, "scale") < 1) t.to(d, { scale: 1, duration: 0.3 }, 0);
      else if (k > b && gsap.getProperty(d, "scale") > 0) t.to(d, { scale: 0, duration: 0.25 }, 0);
    });
    if (gsap.getProperty(dots[b], "scale") < 1) t.fromTo(dots[b], { scale: 0 }, { scale: 1, duration: 0.35, ease: "back.out(2)", immediateRender: false }, tb - 0.1);
    t.to(chapterBar, { scaleX: (b + 1) / N, duration: 0.9, ease: "power2.inOut" }, 0);
    /* 새 장면 조립 */
    sceneIn(t, b, tb, dir);
    buildingIn(t, b, tb);
  }

  /* ---------- scroll-triggered stepping (not scrubbing) ----------
     무대를 (N-1) x STEP 길이 동안 고정. 스크롤 위치는 장면을 고르기만 하고, 전환 자체는 위의 시간 기반 타임라인.
     휠/터치 한 번의 제스처 = 한 장면: 경계를 넘으면 입력을 잠그고(휠/터치 preventDefault) 그 단계 위치로 스크롤을 맞춘 뒤,
     입력이 160ms 조용해지면(최대 1.8s) 잠금 해제. 스크롤바/키보드/앵커처럼 크게 건너뛰면 잠금 없이 멈춘 위치의 장면으로 바로 이동. */
  function stepLen() { return Math.round(window.innerHeight * 0.55); }
  var filmST = ScrollTrigger.create({
    trigger: film, start: "top top", end: function () { return "+=" + stepLen() * (N - 1); },
    pin: true, anticipatePin: 1, invalidateOnRefresh: true,
    onUpdate: function (self) { onFilmScroll(self.scroll()); }
  });
  function pos(i) { return filmST.start + i * stepLen(); }
  var progScroll = false, lockStart = 0, lastInput = 0, lastInputKind = "", syncT = 0, releaseT = 0, progT = 0;
  function locked() { return lockStart > 0; }
  function scrollToStep(i, dur) {
    progScroll = true;
    clearTimeout(syncT); clearTimeout(progT);
    progT = setTimeout(function () { progScroll = false; }, dur * 1000 + 400); // onComplete 누락 대비
    lenis.scrollTo(pos(i), { duration: dur, onComplete: function () { clearTimeout(progT); progScroll = false; } });
  }
  function lockFor(i) {
    lockStart = performance.now();
    scrollToStep(i, 0.6);
    clearTimeout(releaseT);
    (function check() {
      releaseT = setTimeout(function () {
        var now = performance.now();
        if ((!progScroll && now - lastInput > 160) || now - lockStart > 1800) { lockStart = 0; }
        else check();
      }, 60);
    })();
  }
  function onFilmScroll(y) {
    if (progScroll || locked() || isOpen) return;
    var L = stepLen(), p = (y - filmST.start) / L;
    if (p < -0.001 || p > N - 1 + 0.001) return; // 트랙 밖 (고정 해제 구간)
    var base = wantIdx < 0 ? 0 : wantIdx, d = p - base;
    var user = performance.now() - lastInput < 220 && (lastInputKind === "wheel" || lastInputKind === "touch");
    if (!user) { // 스크롤바 드래그 / 키보드 / 앵커 이동 → 멈춘 뒤 위치에 맞춰 장면 동기화
      clearTimeout(syncT);
      syncT = setTimeout(function () {
        var q = Math.round((lenis.scroll - filmST.start) / stepLen());
        if (q >= 0 && q <= N - 1 && q !== wantIdx) request(q);
      }, 140);
      return;
    }
    var TH = Math.min(110, L * 0.22) / L;
    if (Math.abs(d) < TH) return;
    if (Math.abs(d) > 1.5) { request(Math.max(0, Math.min(N - 1, Math.round(p)))); return; }
    var tgt = base + (d > 0 ? 1 : -1);
    if (tgt < 0 || tgt > N - 1) return;
    request(tgt);
    lockFor(tgt);
  }
  // 입력 감지 + 잠금 중에는 휠/터치 스크롤 차단 (Lenis보다 먼저 capture 단계에서)
  window.addEventListener("wheel", function (ev) {
    lastInput = performance.now(); lastInputKind = "wheel";
    if (locked()) { ev.preventDefault(); ev.stopImmediatePropagation(); }
  }, { capture: true, passive: false });
  window.addEventListener("touchmove", function (ev) {
    lastInput = performance.now(); lastInputKind = "touch";
    if (locked()) { if (ev.cancelable) ev.preventDefault(); ev.stopImmediatePropagation(); }
  }, { capture: true, passive: false });
  window.addEventListener("touchstart", function () { lastInput = performance.now(); lastInputKind = "touch"; }, { capture: true, passive: true });
  window.addEventListener("keydown", function () { lastInputKind = "key"; }, true);

  /* 버튼/키보드/장 버튼: 장면 이동 + 페이지 스크롤도 그 단계 위치로 (스크롤과 장면이 항상 일치) */
  function stepTo(i) {
    if (i < 0 || i > N - 1) return;
    var d = Math.abs(i - (wantIdx < 0 ? 0 : wantIdx));
    request(i);
    if (Math.abs(lenis.scroll - pos(i)) > 2) scrollToStep(i, Math.min(1.4, 0.7 + d * 0.12));
  }
  function toPortfolio() {
    finishTransition();
    var tgt = document.getElementById("portfolio");
    lenis.scrollTo(tgt, { offset: 0, duration: 1.3 });
    setTimeout(function () { var hd = document.getElementById("pf-title"); hd.setAttribute("tabindex", "-1"); hd.focus({ preventScroll: true }); }, 1400);
  }
  function next() { if (wantIdx >= N - 1) toPortfolio(); else stepTo(wantIdx + 1); }
  function prev() { if (wantIdx > 0) stepTo(wantIdx - 1); }

  settle(-1);
  // 인트로: 섹션이 화면에 들어오면 첫 장면 자동 재생
  ScrollTrigger.create({ trigger: film, start: "top 70%", once: true, onEnter: function () { if (wantIdx < 0) request(0); } });

  /* ---------- input ---------- */
  var swipeAt = 0, tStart = null;
  stage.addEventListener("click", function (ev) {
    if (ev.target.closest && ev.target.closest("a, button")) return;
    if (Date.now() - swipeAt < 450) return;           // 스와이프 직후 합성 click 무시
    var sel = window.getSelection ? String(window.getSelection()) : "";
    if (sel && sel.length > 1) return;                 // 텍스트 선택은 전환으로 보지 않음
    next();
  });
  stage.addEventListener("keydown", function (ev) {
    if (ev.target !== stage) return;
    if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); next(); }
  });
  stage.addEventListener("touchstart", function (ev) { var p = ev.touches[0]; tStart = { x: p.clientX, y: p.clientY }; }, { passive: true });
  stage.addEventListener("touchend", function (ev) {
    if (!tStart) return;
    var p = ev.changedTouches[0], dx = p.clientX - tStart.x, dy = p.clientY - tStart.y;
    tStart = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      swipeAt = Date.now();
      if (dx < 0) { if (wantIdx < N - 1) stepTo(wantIdx + 1); } else prev();
    }
  }, { passive: true });
  nextBtn.addEventListener("click", function (ev) { ev.stopPropagation(); next(); });
  prevBtn.addEventListener("click", function (ev) { ev.stopPropagation(); prev(); });
  chapterBtns.forEach(function (b, i) { b.addEventListener("click", function (ev) { ev.stopPropagation(); stepTo(i); }); });

  // 좌/우 화살표: 섹션이 화면의 절반 이상 보이거나 포커스가 섹션 안에 있을 때
  var filmVisible = false;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { filmVisible = en[0].intersectionRatio >= 0.55; }, { threshold: [0, 0.55, 1] }).observe(film);
  }
  document.addEventListener("keydown", function (ev) {
    if (isOpen || ev.altKey || ev.ctrlKey || ev.metaKey || ev.shiftKey) return;
    if (ev.key !== "ArrowRight" && ev.key !== "ArrowLeft") return;
    var tg = ev.target;
    if (tg && (tg.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(tg.tagName))) return;
    if (!filmVisible && !film.contains(document.activeElement)) return;
    ev.preventDefault();
    if (wantIdx < 0) { stepTo(0); return; }
    if (ev.key === "ArrowRight") { if (wantIdx < N - 1) stepTo(wantIdx + 1); }
    else prev();
  });
  careerJump = function (i) { stepTo(i); };
  // 상단 메뉴 경력 / 건너뛰기 링크 → 첫 단계 위치(무대 전체가 보이는 곳)로
  window.addEventListener("click", function (ev) {
    var a = ev.target.closest && ev.target.closest('a[href="#experience"]');
    if (!a) return;
    ev.preventDefault(); ev.stopPropagation();
    stepTo(0);
    setTimeout(function () { stage.focus({ preventScroll: true }); }, 1150);
  }, true);

  /* ---------- detail dialog (Flip from scene) ---------- */
  var layer = $("[data-detail-layer]"), panel = $("[data-detail-panel]"), content = $("[data-detail-content]");
  var scroller = $("[data-detail-scroll]"), closeBtn = $("[data-detail-close]"), backdrop = $("[data-detail-backdrop]");
  var fileEl = $("[data-detail-file]");
  var page = $("#page");
  var isOpen = false, busy = false, openIndex = -1, afterClose = null;

  function openDetail(i) {
    if (isOpen || busy) return;
    busy = true; isOpen = true; openIndex = i;
    var e = EXP[i], origin = scenes[i].el;
    content.innerHTML = "";
    append(content, detailContent(e, "detail-title", 2));
    tagMonoKr(content);
    fileEl.textContent = "career/" + pad2(i + 1) + "_" + e.id + ".log";
    scroller.scrollTop = 0;
    var state = Flip.getState(origin);
    layer.hidden = false;
    lenis.stop();
    page.setAttribute("inert", "");
    gsap.set([content, closeBtn], { autoAlpha: 0 });
    gsap.fromTo(backdrop, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 });
    Flip.from(state, {
      targets: panel, duration: 0.55, ease: "power3.inOut", scale: false, absolute: true,
      onComplete: function () {
        gsap.set(panel, { clearProps: "width,height,top,left,transform,position" });
        gsap.set(closeBtn, { autoAlpha: 1 });
        closeBtn.focus({ preventScroll: true });
        gsap.to(content, { autoAlpha: 1, duration: 0.25, onComplete: function () { busy = false; } });
      }
    });
  }
  function closeDetail(then) {
    if (!isOpen || busy) return;
    busy = true;
    var origin = scenes[openIndex].el, btn = scenes[openIndex].btn;
    gsap.to([content, closeBtn], { autoAlpha: 0, duration: 0.15 });
    gsap.to(backdrop, { autoAlpha: 0, duration: 0.35, delay: 0.1 });
    var tw = Flip.fit(panel, origin, { duration: 0.45, ease: "power3.inOut", scale: false, absolute: true, delay: 0.1 });
    var finish = function () {
      layer.hidden = true;
      gsap.set(panel, { clearProps: "all" });
      gsap.set([content, closeBtn, backdrop], { clearProps: "opacity,visibility" });
      content.innerHTML = "";
      page.removeAttribute("inert");
      lenis.start();
      isOpen = false; busy = false;
      if (typeof then === "function") then(); else btn.focus({ preventScroll: true });
    };
    if (tw && tw.eventCallback) tw.eventCallback("onComplete", finish); else finish();
  }
  scenes.forEach(function (sc, i) { sc.btn.addEventListener("click", function () { openDetail(i); }); });
  closeBtn.addEventListener("click", function () { closeDetail(); });
  backdrop.addEventListener("click", function () { closeDetail(); });
  content.addEventListener("click", function (ev) {
    var a = ev.target.closest && ev.target.closest("[data-case-link]");
    if (!a) return;
    ev.preventDefault();
    var id = a.getAttribute("data-case-link");
    closeDetail(function () {
      var tgt = document.getElementById(id);
      lenis.scrollTo(tgt, { offset: -72, duration: 1.2 });
      setTimeout(function () { tgt.setAttribute("tabindex", "-1"); tgt.focus({ preventScroll: true }); }, 1300);
    });
  });
  document.addEventListener("keydown", function (ev) {
    if (!isOpen) return;
    if (ev.key === "Escape") { ev.preventDefault(); closeDetail(); return; }
    if (ev.key === "Tab") {
      var f = $$('button, a[href], [tabindex]:not([tabindex="-1"])', panel).filter(function (x) { return x.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
      else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
      else if (!panel.contains(document.activeElement)) { ev.preventDefault(); first.focus(); }
    }
  });

  /* ---------- PORTFOLIO motion ---------- */
  var desktop = window.matchMedia("(min-width: 961px)");
  vizCtrls.forEach(function (v) {
    var stepMode = v.stepped && desktop.matches;
    v.art.classList.toggle("is-stepmode", stepMode);
    if (stepMode) v.ctrl.resize();
    function legend(k) { if (v.legend) $$("li", v.legend).forEach(function (li) { var s = +li.getAttribute("data-step"); li.classList.toggle("on", s <= k); li.classList.toggle("cur", s === k); }); }
    if (stepMode) {
      // 블록 컨테이너 하나로 판정: 62% 선이 지나는 블록 = 현재 단계 (빠른 점프에도 단계가 어긋나지 않음, 오프셋은 refresh 때만 읽음)
      var blks = $$(".blk", v.blocks), tops = [], curK = null;
      function measure() { var t0 = v.blocks.getBoundingClientRect().top; tops = blks.map(function (b2) { return b2.getBoundingClientRect().top - t0; }); }
      function apply(idx) {
        if (idx === curK) return; curK = idx;
        var k = idx < 0 ? -1 : +blks[idx].getAttribute("data-step");
        v.ctrl.setStep(k); legend(k);
        blks.forEach(function (b2, j) { b2.classList.toggle("is-cur", j === idx); });
      }
      ScrollTrigger.create({
        trigger: v.blocks, start: "top 62%", end: "bottom 62%",
        onRefresh: measure,
        onUpdate: function (self) {
          var y = self.progress * (self.end - self.start), idx = 0;
          for (var j = 0; j < tops.length; j++) if (tops[j] <= y) idx = j;
          apply(idx);
        },
        onLeaveBack: function () { apply(-1); },
        onLeave: function () { apply(blks.length - 1); }
      });
    } else {
      ScrollTrigger.create({ trigger: v.fig, start: "top 82%", once: true, onEnter: function () { v.ctrl.setStep(9); legend(9); } });
    }
  });
  $$(".metric-val").forEach(function (el) {
    var target = +el.getAttribute("data-count"), o = { v: 0 };
    el.textContent = "0";
    ScrollTrigger.create({ trigger: el, start: "top 85%", once: true, onEnter: function () {
      gsap.to(o, { v: target, duration: 1.6, ease: "power2.out", onUpdate: function () { el.textContent = fmt(printing ? target : o.v); } });
    } });
  });
  EXP.forEach(function (e, i) {
    ScrollTrigger.create({ trigger: "#pf-" + e.id, start: "top 50%", end: "bottom 50%", onToggle: function (self) { railLinks[i].classList.toggle("is-cur", self.isActive); if (self.isActive) railLinks[i].setAttribute("aria-current", "true"); else railLinks[i].removeAttribute("aria-current"); } });
  });

  /* ---------- skills bars ---------- */
  ScrollTrigger.create({ trigger: slot("skills"), start: "top 80%", once: true, onEnter: function () {
    gsap.to(".stat-fill", { scaleX: function (k, el) { return parseFloat(el.style.getPropertyValue("--r")); }, duration: 0.9, stagger: 0.035, ease: "power2.out" });
  } });

  /* ---------- top bar state ---------- */
  var topbar = $("[data-topbar]");
  ScrollTrigger.create({ start: 40, end: "max", onToggle: function (self) { topbar.classList.toggle("is-scrolled", self.isActive); } });

  /* ---------- refresh / rebuild on resize ---------- */
  var builtW = window.innerWidth;
  ScrollTrigger.addEventListener("refreshInit", function () {
    if (Math.abs(window.innerWidth - builtW) < 2) return;
    builtW = window.innerWidth; vw = window.innerWidth;
    finishTransition();
    filmIdx = wantIdx;
    buildRail(); settle(filmIdx);
    if (filmIdx >= 0) setActive(filmIdx);
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });

  /* ---------- print ---------- */
  var printing = false;
  window.addEventListener("afterprint", function () { printing = false; });
  window.addEventListener("beforeprint", function () {
    printing = true;
    vizCtrls.forEach(function (v) { v.ctrl.setStep(9); });
    $$(".vz-steps li").forEach(function (li) { li.classList.add("on"); });
    if (window.__hero) window.__hero.progress(1);
    $$(".metric-val").forEach(function (el) { el.textContent = fmt(+el.getAttribute("data-count")); });
    gsap.set(".stat-fill", { scaleX: function (k, el) { return parseFloat(el.style.getPropertyValue("--r")); } });
  });

  tagMonoKr($("[data-film]"));
  window.__film = {
    go: stepTo, scene: request, next: next, prev: prev, st: filmST, pos: pos, open: openDetail, close: closeDetail, lenis: lenis,
    get index() { return filmIdx; }, get want() { return wantIdx; }, get locked() { return locked(); }, get busy() { return !!filmTl; }, get tl() { return filmTl; }
  };
})();
