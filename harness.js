/* Boundary-case harness. Stubs just enough DOM to load the engine, then drives
   scoring through window.__engine without any clicking. */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const TOOLS = __dirname;

function load(tool, search){
  const nodes = {};
  const mk = () => ({ innerHTML:"", value:"", disabled:false, onclick:null,
                      oninput:null, onkeydown:null, focus(){} });
  const sandbox = {
    console,
    document: { getElementById: id => nodes[id] || (nodes[id] = mk()) }
  };
  sandbox.window = sandbox;
  sandbox.window.scrollTo = () => {};
  sandbox.window.addEventListener = () => {};
  sandbox.location = { search: search || "" };
  sandbox.window.location = sandbox.location;
  sandbox.document.querySelectorAll = () => [];
  sandbox.history = { pushState(){}, replaceState(){}, back(){} };
  sandbox.window.history = sandbox.history;
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(TOOLS, tool, "config.js"), "utf8"), sandbox);
  vm.runInContext(fs.readFileSync(path.join(TOOLS, "_engine", "engine.js"), "utf8"), sandbox);
  return sandbox;
}

let fails = 0, passes = 0;
function ok(label, cond, detail){
  if (cond) { passes++; console.log("  PASS  " + label); }
  else { fails++; console.log("  FAIL  " + label + (detail ? "\n          " + detail : "")); }
}
function head(s){ console.log("\n" + s); }

/* ---------------- Business Level Test ---------------- */
head("Business Level Test — levels mode");
{
  const S = load("business-level-test");
  const Q = S.window.CFG.questions;
  const run = a => { S.window.__engine.set(a); return S.window.__engine.result(); };
  const lvlOf = r => Number(/Level (\d)/.exec(r.body)[1]);

  ok("all yes -> L5", lvlOf(run(Q.map(() => true))) === 5);
  ok("all no  -> L0", lvlOf(run(Q.map(() => false))) === 0);

  // L1 + L2 clear, an L3 gap -> L2
  let a = Q.map(q => q.lv <= 2);
  ok("L1+L2 clear, L3 gap -> L2", lvlOf(run(a)) === 2);

  // L1 clear, one L2 missing, everything above yes -> L1 plus the skip warning
  a = Q.map(() => true);
  a[Q.findIndex(q => q.lv === 2)] = false;
  let r = run(a);
  ok("L1 clear, L2 gap, rest yes -> L1", lvlOf(r) === 1);
  ok("  ...and the skip warning fires", /roof on a house with missing walls/.test(r.body));

  // the blocker quoted is an unmet question from the level above
  a = Q.map(q => q.lv <= 2);
  r = run(a);
  const blockerQ = Q.filter(q => q.lv === 3)[0].q;
  ok("blocker is the first unmet L3 question", r.body.includes(blockerQ.slice(0, 40)));
  ok("message carries the [BLT-L2] tag", r.msg.includes("[BLT-L2]"), r.msg);
  ok("L5 sends to the podcast, not to WhatsApp", run(Q.map(() => true)).msg === null);
}

/* ---------------- Dependency Audit ---------------- */
head("Owner Dependency Audit — score mode");
{
  const S = load("dependency-audit");
  const Q = S.window.CFG.questions;
  const run = a => { S.window.__engine.set(a); return S.window.__engine.result(); };
  const nYes = n => Q.map((_, x) => x < n);

  ok("15 questions", Q.length === 15);

  let r = run(nYes(0));
  ok("0/15 -> 'The gym is in your head'", /The gym is in your head/.test(r.body));
  ok("0/15 sells", r.msg !== null);

  r = run(nYes(15));
  ok("15/15 -> 'It runs without you'", /It runs without you/.test(r.body));
  ok("15/15 does NOT sell", r.msg === null, "should route to the podcast");

  r = run(nYes(9));
  ok("9/15  -> Owner-dependent", /Owner-dependent/.test(r.body));
  r = run(nYes(10));
  ok("10/15 -> Partly systemised", /Partly systemised/.test(r.body));
  ok("10/15 uses the smaller-piece-of-work close", /one system built properly/.test(r.body));

  r = run(nYes(4));  ok("4/15  band boundary holds", /The gym is in your head/.test(r.body));
  r = run(nYes(5));  ok("5/15  band boundary holds", /Owner-dependent/.test(r.body));
  r = run(nYes(12)); ok("12/15 band boundary holds", /Partly systemised/.test(r.body));
  r = run(nYes(13)); ok("13/15 band boundary holds", /It runs without you/.test(r.body));

  // every band matched, no score falls through
  let allMatched = true;
  for (let n = 0; n <= 15; n++){
    const b = run(nYes(n)).body;
    if (!/bandname/.test(b)) allMatched = false;
  }
  ok("every score 0..15 lands in a band", allMatched);

  // priority order: the three group headings must appear, in order, all present
  r = run(Q.map(() => false));
  const pos = s => r.body.indexOf(s);
  const G = S.window.CFG.priority.map(g => g.name);
  ok("all three priority headings render", G.every(n => pos(n) !== -1), G.join(" | "));
  ok("priority headings in order: " + G.join(" -> "),
     pos(G[0]) !== -1 && pos(G[0]) < pos(G[1]) && pos(G[1]) < pos(G[2]));

  // every NO appears exactly once across the groups
  const shown = Q.filter(q => (r.body.match(new RegExp(q.q.slice(0, 30).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length === 1);
  ok("all 15 NOs listed exactly once", shown.length === 15, shown.length + " of 15");

  ok("message carries the [DEP-GYM-n] tag", run(nYes(6)).msg.includes("[DEP-GYM-6]"));
}

/* ---------------- Cost of Repeating Yourself ---------------- */
head("Cost of Repeating Yourself — calc mode");
{
  const S = load("cost-of-repeating");
  const run = v => { S.window.__engine.set(v); return S.window.__engine.result(); };

  // hand-checked: 40/wk x 10 min = 400 min = 6.6667 h/wk = 346.667 h/yr
  // revenue/hour = 400000 / (60 * 52/12) = 400000 / 260 = 1538.4615
  // ksh/yr = 346.667 * 1538.4615 = 533,333
  let r = run([40, 10, 400000, 60]);
  ok("typical case -> KSh 533,333", /KSh 533,333/.test(r.body), r.body.match(/KSh [\d,]+/)[0]);
  ok("  ...hours a year = 347", /347 hours a year/.test(r.body));
  ok("  ...weeks of your year = 5.8", /5\.8 full weeks/.test(r.body));
  ok("  ...tag is [INT-533K]", r.msg.includes("[INT-533K]"), r.msg);

  // zero interruptions -> redirect, no money figure, no WhatsApp
  r = run([0, 10, 400000, 60]);
  ok("0 interruptions -> no KSh figure", !/KSh/.test(r.body));
  ok("0 interruptions -> no WhatsApp message", r.msg === null);
  ok("0 interruptions -> routes to the audit", r.alt.href === "/dependency-audit");

  // zero revenue -> hours only
  r = run([40, 10, 0, 60]);
  ok("0 revenue -> hours reported, no KSh", !/KSh/.test(r.body) && /347/.test(r.body));
  ok("0 revenue -> still sells on time", r.msg !== null && r.msg.includes("[INT-0]"));

  // the KSh 60,000 routing flip
  // solve: hrsYear * revPerHour = 60000 with 60h/wk, 10 min each
  // revPerHour = R/260 ; hrsYear = w*10/60*52 = w*8.6667
  // => w * 8.6667 * R/260 = 60000
  const lo = run([9, 10, 200000, 60]);   // 9*8.6667*769.23 = 60,000 exactly
  const below = run([8, 10, 200000, 60]);
  const above = run([10, 10, 200000, 60]);
  ok("at/above KSh 60,000 uses the 'already spending' close", /already spending/.test(lo.body) && /already spending/.test(above.body),
     lo.body.match(/KSh [\d,]+/)[0] + " / " + above.body.match(/KSh [\d,]+/)[0]);
  ok("below KSh 60,000 uses the 'grows with every hire' close", /grows with every person/.test(below.body),
     below.body.match(/KSh [\d,]+/)[0]);

  // sub-one-week phrasing
  r = run([2, 5, 400000, 60]);
  ok("under one week -> 'most of a working week'", /most of a working week/.test(r.body));

  // no benchmark language leaks into any result
  const bodies = [run([40,10,400000,60]), run([1,5,50000,40]), run([200,240,100000000,120])];
  ok("no benchmark/average language in any result",
     bodies.every(b => !/average|benchmark|typical business|most SMEs|industry/i.test(b.body)));
  ok("honesty line present on every money result",
     bodies.every(b => /your own estimate, multiplied out/.test(b.body)));
}

/* ---------------- ?ref= partner attribution ---------------- */
head("Partner attribution - ?ref=");
{
  const nYes = (Q, n) => Q.map((_, x) => x < n);

  // no ref at all
  let S = load("dependency-audit");
  let Q = S.window.CFG.questions;
  S.window.__engine.set(nYes(Q, 6));
  let r = S.window.__engine.result();
  ok("no ref -> tag unchanged", r.msg.includes("[DEP-GYM-6]") && !/via/.test(r.msg));
  ok("no ref -> internal links untouched", S.window.__engine.internal("/") === "/");

  // ref present
  S = load("dependency-audit", "?ref=KEVIN");
  Q = S.window.CFG.questions;
  S.window.__engine.set(nYes(Q, 6));
  r = S.window.__engine.result();
  ok("ref -> slotted inside the tag",
     S.window.__engine.withRef(r.msg).includes("[DEP-GYM-6 via KEVIN]"),
     S.window.__engine.withRef(r.msg));
  ok("ref -> only one tag rewritten",
     (S.window.__engine.withRef(r.msg).match(/via KEVIN/g) || []).length === 1);
  ok("ref -> internal link carries it", S.window.__engine.internal("/") === "/?ref=KEVIN");
  ok("ref -> respects an existing query string",
     S.window.__engine.internal("/x?a=1") === "/x?a=1&ref=KEVIN");
  ok("ref -> external links untouched",
     S.window.__engine.internal("https://open.spotify.com/x") === "https://open.spotify.com/x");

  // sanitisation - this value is URL input
  S = load("dependency-audit", "?ref=%3Cscript%3Ealert(1)%3C%2Fscript%3E");
  ok("script tag stripped", S.window.__engine.ref() === "scriptalert1script",
     S.window.__engine.ref());
  S = load("dependency-audit", "?ref=" + encodeURIComponent("]evil[ x"));
  ok("brackets stripped so the tag cannot be broken",
     !/[\[\]]/.test(S.window.__engine.ref()), S.window.__engine.ref());
  S = load("dependency-audit", "?ref=" + "A".repeat(60));
  ok("capped at 24 chars", S.window.__engine.ref().length === 24);
  S = load("dependency-audit", "?ref=JOHN+DOE");
  ok("plus decodes to a space", S.window.__engine.ref() === "JOHN DOE", S.window.__engine.ref());
  S = load("dependency-audit", "?ref=%%%");
  ok("undecodable ref degrades to empty", S.window.__engine.ref() === "");
  S = load("dependency-audit", "?other=1");
  ok("unrelated query param ignored", S.window.__engine.ref() === "");

  // works on the other two tools
  S = load("cost-of-repeating", "?ref=KEVIN");
  S.window.__engine.set([40, 10, 400000, 60]);
  r = S.window.__engine.result();
  ok("calculator tag carries the ref",
     S.window.__engine.withRef(r.msg).includes("[INT-533K via KEVIN]"));
  S = load("business-level-test", "?ref=KEVIN");
  Q = S.window.CFG.questions;
  S.window.__engine.set(Q.map(q => q.lv <= 2));
  r = S.window.__engine.result();
  ok("level test tag carries the ref",
     S.window.__engine.withRef(r.msg).includes("[BLT-L2 via KEVIN]"));

  // the no-sell paths must not gain a phantom message
  S = load("dependency-audit", "?ref=KEVIN");
  Q = S.window.CFG.questions;
  S.window.__engine.set(nYes(Q, 15));
  r = S.window.__engine.result();
  ok("15/15 still does not sell, ref or no ref", r.msg === null);
  ok("  ...and the podcast fallback stays external, no ref appended",
     S.window.__engine.internal(r.alt.href) === r.alt.href);
}

/* ---------------- shared ---------------- */
head("Shared");
{
  for (const t of ["business-level-test", "dependency-audit", "cost-of-repeating"]){
    const html = fs.readFileSync(path.join(TOOLS, t, "index.html"), "utf8");
    ok(t + ": WhatsApp number set", html.includes("254704334027") && !html.includes("254XXXXXXXXX"));
    ok(t + ": no external requests", !/(src|href)=["']https?:\/\/(?!open\.spotify|www\.ifc|techafricanews|researchictafrica|www\.fsdkenya)/.test(html));
    ok(t + ": links back to the Toolbox", html.includes('href="/"'));
    ok(t + ": self-contained (no <link> or external <script src>)",
       !/<link[^>]+stylesheet/i.test(html) && !/<script[^>]+src=/i.test(html));
  }
  const S = load("business-level-test");
  const f = S.window.__engine.fmt;
  ok("fmt: 533333 -> 533,333", f(533333) === "533,333");
  ok("fmt: 1000 -> 1,000",     f(1000) === "1,000");
  ok("fmt: 999 -> 999",        f(999) === "999");
  ok("fmt: 1234567 -> 1,234,567", f(1234567) === "1,234,567");
}

console.log("\n" + passes + " passed, " + fails + " failed");
process.exit(fails ? 1 : 0);
