/* Marketing FM — tool engine.
   Three modes: levels | score | calc.
   The engine owns mechanics. The config owns arithmetic and every word a user reads. */
(function(){
"use strict";

var C   = window.CFG;
var app = document.getElementById("app");
var i   = 0;
var ans = [];

/* ---------- helpers ---------- */

function esc(s){
  return String(s).replace(/[&<>"]/g, function(c){
    return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];
  });
}

/* Hand-rolled thousands separator — locale-independent, so the number on the
   screen matches the number in the WhatsApp message on every device. */
function fmt(n){
  n = Math.round(n);
  var s = String(Math.abs(n)), out = "", c = 0, x;
  for (x = s.length - 1; x >= 0; x--){
    out = s.charAt(x) + out;
    if (++c % 3 === 0 && x > 0) out = "," + out;
  }
  return (n < 0 ? "-" : "") + out;
}

function el(html){ app.innerHTML = html; window.scrollTo(0, 0); }
function on(id, ev, fn){ var n = document.getElementById(id); if (n) n[ev] = fn; }

function items(){ return C.mode === "calc" ? C.inputs : C.questions; }

function prog(){
  return '<div class="prog">' + items().map(function(_, x){
    return '<i class="' + (x < i ? "on" : "") + '"></i>';
  }).join("") + '</div>';
}

function stepLabel(){
  return '<div class="step">Question ' + (i + 1) + ' of ' + items().length + '</div>';
}

function wa(msg){
  return "https://wa.me/" + C.wa + "?text=" + encodeURIComponent(msg);
}

/* ---------- start ---------- */

function start(){
  ans = [];
  i = 0;
  el(
    '<div class="card">' +
      '<h1>' + C.intro.h1 + '</h1>' +
      '<p class="lede">' + C.intro.lede + '</p>' +
      (C.intro.stat ? '<div class="stat">' + C.intro.stat + '</div>' : '') +
      (C.intro.note ? '<p class="lede" style="font-size:15px">' + C.intro.note + '</p>' : '') +
      '<button class="btn" id="go">' + C.intro.cta + '</button>' +
      '<p class="meta">' + C.intro.privacy + '</p>' +
    '</div>'
  );
  on("go", "onclick", function(){ i = 0; step(); });
}

/* ---------- flow ---------- */

function step(){
  if (i >= items().length){ result(); return; }
  if (C.mode === "calc") inputScreen(); else questionScreen();
}

function back(){ if (i > 0){ i--; step(); } }

function questionScreen(){
  var q = C.questions[i];
  el(
    '<div class="card">' + prog() + stepLabel() +
      '<p class="qtext">' + q.q + '</p>' +
      '<p class="qhelp">' + q.h + '</p>' +
      '<div class="answers">' +
        '<button class="ans yes" id="y"><span class="k">Y</span> ' + C.yesLabel + '</button>' +
        '<button class="ans no"  id="n"><span class="k">N</span> ' + C.noLabel  + '</button>' +
      '</div>' +
      (i > 0 ? '<button class="btn-ghost back" id="b">&larr; Previous question</button>' : '') +
    '</div>'
  );
  on("y", "onclick", function(){ pick(true);  });
  on("n", "onclick", function(){ pick(false); });
  on("b", "onclick", back);
}

function pick(v){ ans[i] = v; i++; step(); }

function inputScreen(){
  var f = C.inputs[i];
  var v = ans[i];
  el(
    '<div class="card">' + prog() + stepLabel() +
      '<p class="qtext">' + f.q + '</p>' +
      '<p class="qhelp">' + f.h + '</p>' +
      '<div class="field">' +
        (f.pre ? '<span class="pre">' + f.pre + '</span>' : '') +
        '<input id="v" type="number" inputmode="numeric" min="' + (f.min != null ? f.min : 0) +
          '" step="any" placeholder="' + (f.ph != null ? f.ph : "0") + '"' +
          (v != null ? ' value="' + esc(v) + '"' : '') + '>' +
        (f.suf ? '<span class="suf">' + f.suf + '</span>' : '') +
      '</div>' +
      '<div id="note"></div>' +
      '<button class="btn" id="next" disabled>' + (i === C.inputs.length - 1 ? C.calcCta : "Next") + '</button>' +
      (i > 0 ? '<button class="btn-ghost back" id="b">&larr; Previous question</button>' : '') +
    '</div>'
  );

  var input = document.getElementById("v");
  var next  = document.getElementById("next");
  var note  = document.getElementById("note");

  function read(){
    var raw = input.value.trim();
    if (raw === "") return null;
    var n = Number(raw);
    if (!isFinite(n)) return null;
    if (n < (f.min != null ? f.min : 0)) return null;
    return n;
  }

  function check(){
    var n = read();
    next.disabled = (n === null);
    /* Clamp rather than print a nonsense figure. The note says so out loud. */
    note.innerHTML = (n !== null && f.max != null && n > f.max)
      ? '<p class="fieldnote">' + f.clampNote + '</p>' : "";
  }

  input.oninput = check;
  input.onkeydown = function(e){ if (e.key === "Enter" && !next.disabled) next.click(); };
  next.onclick = function(){
    var n = read();
    if (n === null) return;
    if (f.max != null && n > f.max) n = f.max;
    ans[i] = n;
    i++;
    step();
  };
  on("b", "onclick", back);
  check();
  input.focus();
}

/* ---------- results ---------- */

/* levels: your level is the highest one where every rung below it is fully cleared.
   A business skips rungs the way a roof skips walls. */
function cleared(lv){
  return C.questions.every(function(q, x){ return q.lv !== lv || ans[x] === true; });
}

function resLevels(){
  var lvl = 0, L;
  for (L = 1; L <= 5; L++){ if (cleared(L)) lvl = L; else break; }

  var blocker = null, skipped = 0, x;
  for (x = 0; x < C.questions.length; x++){
    if (C.questions[x].lv === lvl + 1 && ans[x] === false && !blocker) blocker = C.questions[x];
    if (C.questions[x].lv >  lvl + 1 && ans[x] === true) skipped++;
  }

  var rungs = C.levels.map(function(Lv){
    var cls = Lv.n < lvl ? "done" : (Lv.n === lvl ? "here" : "");
    return '<div class="rung ' + cls + '"><span class="n">' + Lv.n + '</span>' +
           '<span class="t"><b>' + esc(Lv.name) + '</b><span>' + esc(Lv.desc) + '</span></span>' +
           (Lv.n === lvl ? '<span class="tag">You</span>' : "") + '</div>';
  }).join("");

  var nextList = (C.next[lvl] || []).map(function(t){ return '<li>' + esc(t) + '</li>'; }).join("");
  var ctx = { lvl: lvl, blocker: blocker, next: Math.min(lvl + 1, 5) };

  return {
    body:
      '<div class="levelbig">Your result</div>' +
      '<h1 style="margin-bottom:6px">Level ' + lvl + ' &mdash; ' + esc(C.levels[lvl].name) + '</h1>' +
      '<p class="lede">' + esc(C.verdict[lvl]) + '</p>' +
      /* Blocker before the ladder: it is the one actionable line, and on a phone the
         six-rung ladder pushes it below the fold. */
      (blocker ? '<div class="blocker"><b>The first thing blocking you</b>' + esc(blocker.q) + '</div>' : "") +
      '<div class="ladder">' + rungs + '</div>' +
      (skipped ? '<p class="qhelp">' + C.skipNote(skipped) + '</p>' : "") +
      (nextList ? '<div class="gap"><h3>What Level ' + (lvl + 1) + ' would give you</h3><ul>' + nextList + '</ul></div>' : ""),
    msg: lvl < 5 ? C.message(ctx) : null,
    cta: lvl < 5 ? C.cta(ctx) : null,
    alt: C.alt
  };
}

function resScore(){
  var yes = 0, no = [], x;
  for (x = 0; x < C.questions.length; x++){
    if (ans[x] === true) yes++; else no.push(x);
  }

  var band = C.bands[C.bands.length - 1];
  for (x = 0; x < C.bands.length; x++){
    if (yes >= C.bands[x].min && yes <= C.bands[x].max){ band = C.bands[x]; break; }
  }

  /* Nobody fixes fifteen things. Return the NOs in the order they cost money. */
  var used = {}, groups = [];
  C.priority.forEach(function(g){
    var hits = g.q.filter(function(qi){ return no.indexOf(qi) >= 0; });
    hits.forEach(function(qi){ used[qi] = 1; });
    if (hits.length) groups.push({ name: g.name, q: hits });
  });
  var rest = no.filter(function(qi){ return !used[qi]; });
  if (rest.length) groups.push({ name: C.restLabel, q: rest });

  var listHtml = groups.map(function(g){
    return '<div class="grouphead">' + esc(g.name) + '</div>' +
      g.q.map(function(qi){
        return '<div class="item"><b>' + esc(C.questions[qi].q) + '</b>' +
               '<span>' + esc(C.questions[qi].no) + '</span></div>';
      }).join("");
  }).join("");

  var ctx = { yes: yes, total: C.questions.length, band: band,
              firstNo: no.length ? C.questions[no[0]].q : null };

  return {
    body:
      '<div class="levelbig">Your result</div>' +
      '<div class="big">' + yes + ' / ' + C.questions.length + '</div>' +
      '<p class="bigsub">' + C.scoreSub + '</p>' +
      '<div class="bandname">' + esc(band.name) + '</div>' +
      '<p class="lede">' + esc(band.verdict) + '</p>' +
      (listHtml ? '<div class="gap"><h3>' + C.listHead + '</h3></div><div class="list">' + listHtml + '</div>' : "") +
      '<p class="lede" style="margin-top:18px">' + esc(band.action) + '</p>',
    msg: band.sell ? C.message(ctx) : null,
    cta: band.sell ? C.cta(ctx) : null,
    alt: C.alt
  };
}

function result(){
  var R = C.mode === "levels" ? resLevels()
        : C.mode === "score"  ? resScore()
        : C.result(ans.slice(), { fmt: fmt, esc: esc });

  el(
    '<div class="card">' + R.body +
      (R.msg
        ? '<a class="btn" href="' + wa(R.msg) + '">' + R.cta + '</a>' +
          '<p class="meta">' + C.waNote + '</p>'
        : '<a class="btn" href="' + R.alt.href + '">' + R.alt.label + '</a>') +
      '<button class="btn-ghost" id="again">Take it again</button>' +
      (C.more ? '<a class="btn-ghost" href="' + C.more.href + '">' + C.more.label + '</a>' : "") +
      (C.src ? '<p class="src">' + C.src + '</p>' : "") +
    '</div>'
  );
  on("again", "onclick", start);
}

/* Exposed only so the boundary-case harness can drive the scoring without clicking. */
window.__engine = {
  set: function(a){ ans = a.slice(); i = items().length; },
  result: function(){
    return C.mode === "levels" ? resLevels()
         : C.mode === "score"  ? resScore()
         : C.result(ans.slice(), { fmt: fmt, esc: esc });
  },
  fmt: fmt
};

start();
})();
