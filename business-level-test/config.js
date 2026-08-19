window.CFG = {

  title: "The Business Level Test — Marketing FM",
  desc: "Twelve questions. Find out which level your business is actually running on — and what the next one gives you.",

  mode: "levels",
  wa: "254704334027",

  yesLabel: "Yes, true today",
  noLabel:  "No, not yet",

  intro: {
    h1: "Which level is your business actually running on?",
    lede: "Twelve questions. Under three minutes. You get your level, the one thing blocking you, and what the next level would give you.",
    stat: "<b>95%</b> of Kenyan SMEs take M-Pesa. <b>Under 7%</b> use a computer to run the business." +
          "<small>Mastercard SME Confidence Index 2026 &middot; IFC / World Bank 2023 " +
          "(3,325 microenterprises, seven countries including Kenya)</small>",
    note: "Answer <b>YES</b> only if it is true right now &mdash; not &ldquo;we are planning to&rdquo; and not &ldquo;I usually explain it.&rdquo;",
    cta: "Start the test",
    privacy: "Nothing is saved. Nothing is sent. Nobody sees this but you."
  },

  levels: [
    { n:0, name:"Completely offline",   desc:"Cash, paper, memory and phone calls" },
    { n:1, name:"Digital payments",     desc:"M-Pesa, bank transfers, till numbers" },
    { n:2, name:"Digital communication",desc:"WhatsApp, Facebook, Instagram" },
    { n:3, name:"Digital records",      desc:"Customer lists, sales records, written prices" },
    { n:4, name:"Digital operations",   desc:"Roles, follow-up, stock and bookings on a system" },
    { n:5, name:"Digital intelligence", desc:"Your own numbers tell you what to do next" }
  ],

  questions: [
    { lv:1, q:"Customers can pay you by M-Pesa, till number or bank transfer.",
            h:"Not just cash in hand." },
    { lv:1, q:"Business money goes somewhere separate from your personal money.",
            h:"A different till, account or M-Pesa line — not one pocket for everything." },
    { lv:2, q:"You reach customers deliberately through WhatsApp Business, Facebook or Instagram.",
            h:"Reaching them on purpose — not just replying when someone happens to message." },
    { lv:2, q:"Someone other than you could message your customers if you were away for a week.",
            h:"They would have access, and they would know what to send." },
    { lv:3, q:"There is a record of who your customers are — names and numbers — outside your phone contacts.",
            h:"A list you could hand to someone. Paper counts only if it is organised." },
    { lv:3, q:"You can state how many sales you made last month as an actual number.",
            h:"Not “a good month.” A number." },
    { lv:3, q:"Prices are written down somewhere any staff member could quote correctly.",
            h:"Including discounts, deposits and what happens on a refund." },
    { lv:4, q:"Staff roles and daily routines are written down, not explained verbally each time.",
            h:"A new person could read it instead of asking a colleague." },
    { lv:4, q:"When someone enquires and does not buy, something follows up with them.",
            h:"A system or a routine — not you remembering on a good day." },
    { lv:4, q:"Stock, bookings or jobs are tracked somewhere other than a notebook or your head.",
            h:"Somewhere two people could look at the same time." },
    { lv:5, q:"You use last month’s numbers to decide what to do next month.",
            h:"The numbers change the decision — they don't just confirm what you already felt." },
    { lv:5, q:"You can tell which product or service makes you the most profit — not the most sales.",
            h:"After what it costs you to deliver it." }
  ],

  verdict: {
    0:"Everything runs on cash, paper and memory. That isn't a judgement — it is a starting point, and the first rung is the cheapest one you will ever climb.",
    1:"You take digital payments, which is past the hardest habit change there is. But money moving is not the same as the business running.",
    2:"You can reach customers, which already puts you ahead of most. What you can't yet do is remember them — so every month starts from zero.",
    3:"You have records. That is the rung most Kenyan businesses never reach. The gap now is that your records describe the past instead of running the present.",
    4:"Your operations are on a system. Almost nobody gets here. The last rung is making those systems tell you something you didn't already know.",
    5:"You are at the top of this ladder. Systems are no longer what is holding you back — demand is, and that is a different conversation."
  },

  next: {
    0:["Customers can pay you without having to find cash first",
       "Money stops disappearing between the till and your pocket"],
    1:["You reach customers on purpose instead of waiting to be found",
       "Someone else can keep the business visible when you cannot"],
    2:["You know who your customers are, and you can bring them back",
       "You can answer “how was last month” with a number",
       "Any staff member quotes the same price you would"],
    3:["A new hire works from something written instead of interrupting everyone",
       "Enquiries stop leaking because nobody followed up",
       "Two people can see the same stock or booking position"],
    4:["Last month’s numbers decide next month’s plan",
       "You find out which work is actually worth doing"],
    5:[]
  },

  skipNote: function(n){
    return "You answered yes to " + n + " thing" + (n > 1 ? "s" : "") +
           " higher up the ladder. That is normal, but it is worth knowing: you can't put a roof " +
           "on a house with missing walls. It holds until it doesn't.";
  },

  /* The message arrives pre-qualified: level, blocker, and the tag Karl logs. */
  message: function(c){
    return "Hi Karl - I did the Business Level Test. I'm at Level " + c.lvl +
           (c.blocker ? '. The first thing blocking me: "' + c.blocker.q + '"' : ".") +
           " [BLT-L" + c.lvl + "] What would it take to get to Level " + c.next + "?";
  },

  cta: function(c){ return "Ask what it takes to reach Level " + c.next; },

  waNote: "Goes straight to Karl on WhatsApp. A real person, not a bot.",

  alt: { href:"https://open.spotify.com/show/6OxIsPRTPPKkE11UBAo21D",
         label:"Listen to themarketingfmpodcast" },

  more: { href:"/", label:"See the other free tools" },

  src: "Figures shown: 95% of Kenyan SMEs accept mobile payments &mdash; " +
       "<a href=\"https://techafricanews.com/2026/06/18/mastercard-report-highlights-kenyan-sme-confidence-and-digital-payment-growth/\">Mastercard SME Confidence Index 2026</a>. " +
       "Under 7% of African microenterprises use a smartphone or computer for business, and 71% of " +
       "non-users see no need &mdash; " +
       "<a href=\"https://www.ifc.org/en/insights-reports/2023/digital-technologies-in-africa\">IFC / World Bank 2023</a>, " +
       "3,325 microenterprises across seven countries including Kenya. " +
       "The six levels are a framing tool, not a measured index."
};
