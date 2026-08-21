window.CFG = {

  title: "Who Stopped Coming? — Marketing FM",
  desc: "Four questions. Find out how many of your members have quietly stopped showing up — and whether you'd have noticed.",

  mode: "calc",
  wa: "254704334027",

  calcCta: "Show me",

  intro: {
    h1: "Who stopped coming?",
    lede: "Four questions. Under two minutes. You find out how much of your gym has quietly walked out — and whether you'd have known.",
    stat: "&ldquo;How many of your members actually came in last month?&rdquo;" +
          "<small>Most owners know the number they'd like it to be. Very few know the number it is.</small>",
    note: "Nothing to look up and no records needed. If you have to guess, guess &mdash; " +
          "and notice that you had to.",
    cta: "Start",
    privacy: "Nothing is saved. Nothing is sent. Nobody sees this but you."
  },

  inputs: [
    { q:"How many members does your gym have on the books?",
      h:"Everyone you'd still call a member today. Round it — this only needs to be close.",
      suf:"members", min:1, max:5000, ph:"80",
      err:"Enter how many members you have to continue.",
      clampNote:"Capped at 5,000. Past that this isn't the right tool." },

    { q:"What does one member pay you in a normal month?",
      h:"If you sell several plans, use the one most people are on.",
      pre:"KSh", min:0, max:1000000, ph:"3000",
      clampNote:"Capped at KSh 1,000,000 a month per member." },

    { q:"Of those members, how many have not been in during the last 30 days?",
      h:"Not the ones who stopped paying. The ones who stopped showing up.",
      suf:"members", min:0, max:5000,
      dunno:"I don't know",
      clampNote:"Capped at 5,000." },

    /* Worded to stand on its own, because the question before it can be answered
       "I don't know" — after which "those people" would refer to nothing. */
    { q:"In the last three months, how many members who'd stopped coming did you get in touch with?",
      h:"A call or a message that went to them personally. Not a broadcast to the whole list.",
      suf:"people", min:0, max:5000, ph:"0",
      clampNote:"Capped at 5,000." }
  ],

  more: { href:"/", label:"See the other free tools" },
  waNote: "Goes straight to Karl on WhatsApp. A real person, not a bot.",
  alt: { href:"https://open.spotify.com/show/6OxIsPRTPPKkE11UBAo21D",
         label:"Listen to themarketingfmpodcast" },

  /* ---- the arithmetic ----
     Four numbers the owner gave us, multiplied out. No benchmark, no retention
     figure and no assumed churn rate is imported — there is no reliable published
     Kenyan gym data, and inventing a range is the habit the Sources tab exists to
     break. Every figure below is his own answer or a product of two of them. */
  result: function(v, u){

    var DUNNO = -1;                 /* set by the "I don't know" button in the engine */

    var members = v[0];
    var fee     = v[1];
    var gone    = v[2];
    var chased  = v[3];

    var knows = (gone !== DUNNO);
    if (knows && gone > members) gone = members;   /* typo guard, not a judgement */

    /* Two versions, because the arithmetic differs by path: where he knows the count,
       the money figure is the members who left; where he doesn't, it is the whole
       membership. A disclosure that describes the wrong sum is worse than none. */
    var honest =
      '<p class="honest">Every figure here is your own four answers, multiplied out. I add nothing ' +
      'to it and there are no industry averages on this page. It uses one month\'s fee, so it counts ' +
      'what those members were worth last month — not what they would have been worth if they stayed.</p>';

    var honestBase =
      '<p class="honest">Every figure here is your own four answers, multiplied out. I add nothing ' +
      'to it and there are no industry averages on this page. The shilling figure is your whole ' +
      'membership at one month\'s fee — it is what the book is worth, not what you have lost.</p>';

    /* ---------- He can't answer. This is the finding, not a failed form. ---------- */
    if (!knows){
      var baseMonth = members * fee;

      return {
        body:
          '<div class="levelbig">Your result</div>' +
          '<h1 style="margin-bottom:8px">You don\'t know</h1>' +
          '<p class="lede">' + u.esc(
            "That's not a criticism and it isn't unusual — it's the finding. You have " +
            u.fmt(members) + " members on the books" +
            (fee > 0 ? ", worth about KSh " + u.fmt(baseMonth) + " a month between them" : "") +
            ", and right now there's no way to tell how many of them are still walking in.") + '</p>' +
          '<p class="lede">' + u.esc(
            "People leaving isn't the problem. People leave every gym on this road. The problem is " +
            "that you'd find out from your bank balance at the end of the month instead of from your " +
            "book at the start of it.") + '</p>' +
          '<p class="lede">' + u.esc(
            "Whatever your members are written in — a book, your phone, an old spreadsheet — the " +
            "answer is already in there. It has just never been counted.") + '</p>' + honestBase,
        msg: "Hi Karl - I did the Who Stopped Coming tool. I have " + u.fmt(members) +
             " members and I couldn't tell you how many of them have stopped showing up. " +
             "[GONE-?] What would it take to find out?",
        cta: "Ask what it takes to find out",
        alt: this.alt
      };
    }

    /* ---------- Nobody has drifted. Either very new, or a guess. ---------- */
    if (gone === 0){
      return {
        body:
          '<div class="levelbig">Your result</div>' +
          '<h1 style="margin-bottom:8px">Everyone still turns up</h1>' +
          '<p class="lede">' + u.esc(
            "All " + u.fmt(members) + " of your members have been in within the last month. If that's " +
            "genuinely true, there's nothing here for you to recover and nothing for me to sell you.") + '</p>' +
          '<p class="lede">' + u.esc(
            "The question worth asking instead is what happens to all of this the week you're not " +
            "around. That's a different tool.") + '</p>',
        msg: null,
        alt: { href:"/dependency-audit", label:"Take the Owner Dependency Audit instead" }
      };
    }

    var share  = Math.round((gone / members) * 100);
    var perMth = gone * fee;
    var left   = Math.max(gone - chased, 0);

    /* ---------- He knows, and he has already chased all of them. ---------- */
    if (chased >= gone){
      return {
        body:
          '<div class="levelbig">Your result</div>' +
          '<h1 style="margin-bottom:8px">You\'re already on it</h1>' +
          '<p class="lede">' + u.esc(
            u.fmt(gone) + " of your " + u.fmt(members) + " members haven't been in for a month, and " +
            "you've contacted all of them. That puts you ahead of nearly every gym I walk into.") + '</p>' +
          '<p class="lede">' + u.esc(
            "You don't need a list built for you — you're keeping one. The thing worth asking is " +
            "whether it still happens in a week when you're not there to do it.") + '</p>' + honest,
        msg: null,
        alt: { href:"/dependency-audit", label:"Take the Owner Dependency Audit instead" }
      };
    }

    var chasedLine = chased === 0
      ? "Not one of them has been contacted."
      : "You've been in touch with " + u.fmt(chased) + " of them. That leaves " + u.fmt(left) +
        " nobody has spoken to.";

    var cause =
      "None of them announced it. Nobody does. They just stopped coming, and there was nothing set " +
      "up to notice — so the first sign is a quiet month.";

    /* Fee of zero is a real answer. Report the count and drop the money. */
    if (fee === 0 || !isFinite(perMth)){
      return {
        body:
          '<div class="levelbig">Your result</div>' +
          '<div class="big">' + u.fmt(gone) + '</div>' +
          '<p class="bigsub">members who haven\'t been in for a month</p>' +
          '<p class="lede">' + u.esc("That's " + share + "% of the gym.") + '</p>' +
          '<p class="lede">' + u.esc(chasedLine) + '</p>' +
          '<p class="lede">' + u.esc(cause) + '</p>' + honest,
        msg: "Hi Karl - I did the Who Stopped Coming tool. " + u.fmt(gone) + " of my " +
             u.fmt(members) + " members haven't been in for a month - " + share + "% of the gym. " +
             "[GONE-" + gone + "] What would it take to get them back?",
        cta: "Ask what it takes to get them back",
        alt: this.alt
      };
    }

    return {
      body:
        '<div class="levelbig">Your result</div>' +
        '<div class="big">KSh ' + u.fmt(perMth) + '</div>' +
        '<p class="bigsub">a month, in members who have stopped showing up</p>' +
        '<p class="lede">' + u.esc(
          "That's " + u.fmt(gone) + " of your " + u.fmt(members) + " members — " + share +
          "% of the gym — who haven't been through the door in thirty days.") + '</p>' +
        '<p class="lede">' + u.esc(chasedLine) + '</p>' +
        '<p class="lede">' + u.esc(cause) + '</p>' +
        '<p class="lede">' + u.esc(
          "You don't need new members to fix that number. Those people already chose you once, and " +
          "their names are already written down somewhere.") + '</p>' + honest,
      msg: "Hi Karl - I did the Who Stopped Coming tool. " + u.fmt(gone) + " of my " +
           u.fmt(members) + " members haven't been in for a month - about KSh " + u.fmt(perMth) +
           " a month. [GONE-" + gone + "] What would it take to get them back?",
      cta: "Ask what it takes to get them back",
      alt: this.alt
    };
  },

  src: "This page has no benchmarks and no statistics in it. There is no reliable published figure " +
       "for Kenyan gym retention, so none is used. Every number shown is the four numbers you " +
       "entered, multiplied out — the share is your own two counts, and any shilling figure is one " +
       "month's fee multiplied by a member count you gave us. Which count, the page says on the line."
};
