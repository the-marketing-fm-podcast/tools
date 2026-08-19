window.CFG = {

  title: "The Cost of Repeating Yourself — Marketing FM",
  desc: "Four questions. Find out what answering the same questions over and over costs your business in a year.",

  mode: "calc",
  wa: "254704334027",

  calcCta: "Show me the number",

  intro: {
    h1: "What does repeating yourself cost you?",
    lede: "Four questions. Under two minutes. You get one number: what answering the same questions costs your business in a year.",
    stat: "&ldquo;How many times do I have to repeat myself?&rdquo;" +
          "<small>Every owner has said it. Hardly any of them has ever worked out the price.</small>",
    note: "You need no records for this and nothing to look up. Four numbers you already know.",
    cta: "Start",
    privacy: "Nothing is saved. Nothing is sent. Nobody sees this but you."
  },

  inputs: [
    { q:"In a normal week, how many times does someone interrupt you to ask how something is done?",
      h:"Staff, not customers. A normal week — not your worst one.",
      suf:"times a week", min:0, max:200,
      clampNote:"Above 200 a week we stop counting — past that the number stops being the point." },

    { q:"How long does one take, from the moment you are pulled away to the moment you are back into it?",
      h:"Count the time it takes to pick up where you left off. That part is usually longer than the answer.",
      suf:"minutes", min:1, max:240, ph:"10",
      clampNote:"Capped at 4 hours. If one question really takes longer than that, it isn't a question — it is the job." },

    { q:"What did the business take in last month?",
      h:"Everything that came in. Round it — this only needs to be close.",
      pre:"KSh", min:0, max:100000000,
      clampNote:"Capped at KSh 100 million. If that is genuinely your month, this is not the right tool." },

    { q:"How many hours a week do you actually work?",
      h:"Actually. Count the evenings, and count Sunday.",
      suf:"hours a week", min:1, max:120, ph:"60",
      clampNote:"Capped at 120 hours — that is already 17 hours a day, every day." }
  ],

  more: { href:"/", label:"See the other free tools" },
  waNote: "Goes straight to Karl on WhatsApp. A real person, not a bot.",
  alt: { href:"https://open.spotify.com/show/6OxIsPRTPPKkE11UBAo21D",
         label:"Listen to themarketingfmpodcast" },

  /* ---- the arithmetic ----
     Every figure below is the owner's own four numbers multiplied out.
     No benchmark, no research figure and no assumed working day is imported —
     "weeks of your working year" is derived from the hours they told us they work,
     which is why it is stated in weeks rather than days. */
  result: function(v, u){

    var perWeek  = v[0];
    var minsEach = v[1];
    var revMonth = v[2];
    var hrsWeek  = v[3];

    var hrsPerWeek = (perWeek * minsEach) / 60;
    var hrsPerYear = hrsPerWeek * 52;
    var weeksOfYou = hrsPerYear / hrsWeek;
    var revPerHour = revMonth / (hrsWeek * (52 / 12));
    var kshPerYear = hrsPerYear * revPerHour;

    var cause = "None of this is a discipline problem, and it isn't a staff problem. " +
                "Nothing is written down, so there is nothing for anyone to follow. " +
                "They ask because asking is the only option you have given them.";

    var honest =
      '<p class="honest">Every figure here is your own estimate, multiplied out. I add nothing to it. ' +
      'It uses revenue per hour rather than profit per hour, and it counts only your time — not the time ' +
      'of the person who stopped working to ask. The real cost is higher than this.</p>';

    /* Nobody asks. That is either a written-down business or a frightened one,
       and this tool cannot tell which. Send them to the one that can. */
    if (perWeek === 0){
      return {
        body:
          '<div class="levelbig">Your result</div>' +
          '<h1 style="margin-bottom:8px">Nobody interrupts you</h1>' +
          '<p class="lede">That means one of two things. Either the business is genuinely written down ' +
          'and people can work without you — or nobody feels able to ask. This tool can\'t tell those apart.</p>' +
          '<p class="lede">The audit can. It asks what exists on paper rather than what happens in a week.</p>',
        msg: null,
        alt: { href:"/dependency-audit", label:"Take the Owner Dependency Audit instead" }
      };
    }

    var weeksPhrase = weeksOfYou >= 1
      ? weeksOfYou.toFixed(1) + " full weeks of your working year"
      : "most of a working week";
    var tail = ", spent being a search engine for your own business.";

    /* Revenue of zero is a real answer. Report the time and drop the money. */
    if (revMonth === 0 || !isFinite(kshPerYear)){
      return {
        body:
          '<div class="levelbig">Your result</div>' +
          '<div class="big">' + u.fmt(hrsPerYear) + '</div>' +
          '<p class="bigsub">hours a year, answering questions you have already answered</p>' +
          '<p class="lede">' + u.esc("That is " + weeksPhrase + tail) + '</p>' +
          '<p class="lede">' + u.esc(cause) + '</p>' + honest,
        msg: "Hi Karl - I did the Cost of Repeating Yourself calculator. Answering the same questions " +
             "takes about " + u.fmt(hrsPerYear) + " hours of my year. [INT-0] What would it take to " +
             "get this out of my head?",
        cta: "Ask what it takes to stop repeating yourself",
        alt: this.alt
      };
    }

    var verdict = kshPerYear >= 60000
      ? "That is money you are already spending. You pay it in hours instead of shillings. " +
        "That is why it has never shown up on a statement."
      : "It isn't a large number yet. It grows with every person you hire, because each new one " +
        "starts the same conversation from the beginning.";

    var k = Math.round(kshPerYear);
    var tag = k >= 1000 ? Math.round(k / 1000) + "K" : String(k);

    return {
      body:
        '<div class="levelbig">Your result</div>' +
        '<div class="big">KSh ' + u.fmt(kshPerYear) + '</div>' +
        '<p class="bigsub">a year, answering questions you have already answered</p>' +
        '<p class="lede">' + u.esc("That is " + u.fmt(hrsPerYear) + " hours a year — " + weeksPhrase + tail) + '</p>' +
        '<p class="lede">' + u.esc(verdict) + '</p>' +
        '<p class="lede">' + u.esc(cause) + '</p>' + honest,
      msg: "Hi Karl - I did the Cost of Repeating Yourself calculator. Answering the same questions " +
           "costs me about KSh " + u.fmt(kshPerYear) + " a year - " +
           (weeksOfYou >= 1 ? weeksOfYou.toFixed(1) + " weeks of my working year" :
                              u.fmt(hrsPerYear) + " hours") +
           ". [INT-" + tag + "] What would it take to get this out of my head?",
      cta: "Ask what it takes to stop repeating yourself",
      alt: this.alt
    };
  },

  src: "This page has no benchmarks and no statistics in it. Every number shown is the four numbers " +
       "you entered, multiplied out. Hours a year is your weekly figure across 52 weeks; revenue per " +
       "hour is last month's takings divided by the hours you said you work."
};
