window.CFG = {

  title: "The Gym Owner Dependency Audit — Marketing FM",
  desc: "Fifteen questions. Find out how much of your gym exists only in your head — and which gap costs you most.",

  mode: "score",
  wa: "254704334027",

  yesLabel: "Yes, it's written down",
  noLabel:  "No, it's in my head",

  intro: {
    h1: "Is the gym running you?",
    lede: "Fifteen questions. Under five minutes. You get a score, and the gaps ranked by what they cost you.",
    stat: "If you get sick, does the gym stop? If a new trainer starts on Monday, do they spend the week " +
          "interrupting everyone else to find out how things are done?" +
          "<small>If either answer is yes — you don't own a gym. You own a job with equipment in it.</small>",
    note: "Answer <b>YES</b> only if a system already exists — written down somewhere a person could find " +
          "it and follow it without you. Not &ldquo;I'm planning to.&rdquo; Not &ldquo;I usually explain it.&rdquo;",
    cta: "Start the audit",
    privacy: "Nothing is saved. Nothing is sent. Nobody sees this but you."
  },

  questions: [
    { q:"A new hire could work their first shift from something written, without asking a colleague how anything is done.",
      h:"Something they could read. Not a person they could ask.",
      no:"Every new person learns by interrupting the people who are already busy." },

    { q:"There is a written list of what a new staff member must be shown, and in what order, on day one.",
      h:"The order matters as much as the list.",
      no:"Two people hired a month apart get two different gyms." },

    { q:"A new member's first visit goes the same way regardless of who is on the desk.",
      h:"Same welcome, same tour, same sign-up — whoever is working.",
      no:"Your first impression is a coin toss." },

    { q:"Someone other than you can answer a membership enquiry and close it.",
      h:"Close it. Not take a number and pass it to you.",
      no:"Every sale waits for you." },

    { q:"Prices, joining fees, freeze and refund rules are written down, and any staff member quotes them correctly.",
      h:"Including what happens when someone wants to pause or leave.",
      no:"Different members are told different things, and you find out later." },

    { q:"There is a written daily open and close routine that staff can follow.",
      h:"A list they work through, not a habit they picked up.",
      no:"The gym only opens and closes properly when you're there." },

    { q:"Staff know what to do during slow hours without you telling them.",
      h:"Cleaning, calls, follow-ups, maintenance — decided in advance.",
      no:"Slow hours mean everyone waits for instruction." },

    { q:"A trainer can hand over a class at no notice, and the cover trainer knows what to run.",
      h:"The session plan exists somewhere other than the usual trainer's head.",
      no:"One person calling in sick cancels a class and costs you members." },

    { q:"There is a written standard for what a good session looks like, so you can tell whether one was delivered.",
      h:"Something you could hold a session against and say yes or no.",
      no:"You cannot manage quality you never defined." },

    { q:"Someone other than you can count the till and reconcile M-Pesa daily.",
      h:"They know the steps and they are allowed to do it.",
      no:"Cash reconciliation stops when you're absent." },

    { q:"Staff know their specific roles without needing daily instruction from you.",
      h:"Who does what, written down, not worked out each morning.",
      no:"You are the manager, the supervisor and the staff all at once." },

    { q:"There is a way for staff to raise problems that does not come directly to you first.",
      h:"A route, a person, or a place they log it.",
      no:"Every problem escalates to you immediately." },

    { q:"You have someone you trust to run the gym for at least three days if you're away.",
      h:"Trust and the instructions to act on it.",
      no:"The gym shuts if you're sick." },

    { q:"A member complaint has a written route that does not start and end with you.",
      h:"Who hears it, what they do, and when it comes to you.",
      no:"Complaints either reach you or vanish — there is no third option." },

    { q:"Any staff member can log a broken machine, and something actually happens as a result.",
      h:"Logged somewhere, and someone owns the fix.",
      no:"Faults get mentioned in passing and forgotten until a member leaves over it." }
  ],

  scoreSub: "things that survive your absence",

  listHead: "Your gaps, in the order they cost you",

  /* Nobody fixes fifteen things at once. Taking on new staff goes first because every
     new hire pays for it again. Handover is what turns one absence into a bad day. */
  priority: [
    { name:"Fix these first", q:[0,1] },
    { name:"Then handover", q:[5,7,12] },
    { name:"Then quality and money", q:[8,9] }
  ],
  restLabel: "The rest, after those",

  bands: [
    { min:0, max:4, sell:true,
      name:"The gym is in your head",
      verdict:"Almost nothing survives your absence. This isn't a discipline problem and it isn't a staff problem — nothing has been written down, so there is nothing for anyone to follow.",
      action:"Starting from nothing is the quickest kind to fix, because there is nothing to undo first. Writing up the whole gym takes one day of mine on your floor, and about two weeks before it is in your hands. You prepare nothing and you write nothing." },

    { min:5, max:9, sell:true,
      name:"Owner-dependent",
      verdict:"Some things run without you. The parts that don't are the parts that cost you — taking on new staff, covering absences, and holding quality. Every new hire restarts the same conversation.",
      action:"This is the common score, and the gap is always the same — the things you know how to do but have never written down. That is one day of mine on your floor, and about two weeks before it is in your hands. You prepare nothing and you write nothing." },

    { min:10, max:12, sell:true,
      name:"Partly systemised",
      verdict:"The bones are there. What's missing is usually handover — what happens when the usual person isn't in.",
      action:"You don't need the whole gym written up. You need one system built properly and handed to you already working. That is one system rather than the whole gym — a smaller and cheaper job." },

    { min:13, max:15, sell:false,
      name:"It runs without you",
      verdict:"Rare. If this is genuinely your score, the gym survives you being away, and systems are not what is holding you back.",
      action:"What is holding you back is demand — how many people know you exist and walk through the door. That is a different conversation, and the podcast is a better place to start than a sales call." }
  ],

  /* Score and first gap, so the message arrives already knowing what to talk about. */
  message: function(c){
    return "Hi Karl - I did the Gym Owner Dependency Audit. I scored " + c.yes + " out of " + c.total +
           (c.firstNo ? '. The first gap: "' + c.firstNo + '"' : ".") +
           " [DEP-GYM-" + c.yes + "] What would it take to get this out of my head?";
  },

  cta: function(c){
    return c.yes >= 10 ? "Ask what it takes to close the gaps"
                       : "Ask what it takes to get this out of your head";
  },

  waNote: "Goes straight to Karl on WhatsApp. A real person, not a bot.",

  alt: { href:"https://open.spotify.com/show/6OxIsPRTPPKkE11UBAo21D",
         label:"Listen to themarketingfmpodcast" },

  more: { href:"/", label:"See the other free tools" },

  src: "This audit has no benchmarks in it and no statistics. Your score is your own answers, counted. " +
       "The gaps are ranked by what we judge costs a gym most, starting with taking on new staff, " +
       "because every new hire pays for that one again. That ranking is a judgement, not a measured finding."
};
