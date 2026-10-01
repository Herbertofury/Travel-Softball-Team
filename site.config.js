/*
 * TRAVEL SOFTBALL SITE CONTENT
 * ----------------------------
 * This is the main file you edit for normal content changes.
 * Keep team facts, links, colors, roster, schedule, photos, and sponsors here.
 * The layout and behavior live in index.html, styles.css, and app.js.
 */

window.SOFTBALL_SITE = {
  meta: {
    title: "Team Name | Travel Softball",
    description: "Official website for Team Name travel softball.",
  },

  brand: {
    teamName: "TEAM NAME",
    mark: "TS",
    subtitle: "TRAVEL SOFTBALL",
    homeBase: "YOUR CITY, ST",
    season: "YOUR SEASON",
    colors: {
      ink: "#101217",
      paper: "#f5f0e7",
      primary: "#ef4b31",
      accent: "#8ce6d2",
      warm: "#e8dcc8",
    },
  },

  hero: {
    eyebrow: "TRAVEL SOFTBALL",
    title: "BUILT FOR THE MILES.<br><em>READY FOR THE MOMENT.</em>",
    intro: "A high-performance travel softball program built around preparation, confidence, and competing the right way.",
    image: "assets/images/hero.webp",
    imageAlt: "Team celebrating together on the softball field",
    ticker: ["WORK", "TRAVEL", "COMPETE", "GROW"],
  },

  story: {
    title: "MORE THAN A WEEKEND TEAM.",
    lede: "We develop complete athletes - sharp fundamentals, resilient mindsets, and teammates who know how to show up for each other.",
    body: "Replace this with the team's real story. Keep it direct and human: what the coaches believe, what players can expect, and what families value about the program.",
    stats: [
      { value: "12", label: "ROSTER SPOTS" },
      { value: "20+", label: "GAME DAYS" },
      { value: "1", label: "TEAM STANDARD" },
    ],
  },

  roster: [
    {
      number: "01",
      name: "PLAYER NAME",
      positions: ["SS", "2B"],
      gradYear: "20XX",
      batsThrows: "R/R",
      image: "assets/images/players/player-01.webp",
      profileUrl: "",
    },
    {
      number: "07",
      name: "PLAYER NAME",
      positions: ["P", "1B"],
      gradYear: "20XX",
      batsThrows: "R/R",
      image: "assets/images/players/player-07.webp",
      profileUrl: "",
    },
    {
      number: "10",
      name: "PLAYER NAME",
      positions: ["C", "3B"],
      gradYear: "20XX",
      batsThrows: "R/R",
      image: "assets/images/players/player-10.webp",
      profileUrl: "",
    },
    {
      number: "14",
      name: "PLAYER NAME",
      positions: ["CF", "OF"],
      gradYear: "20XX",
      batsThrows: "L/R",
      image: "assets/images/players/player-14.webp",
      profileUrl: "",
    },
    {
      number: "18",
      name: "PLAYER NAME",
      positions: ["P", "OF"],
      gradYear: "20XX",
      batsThrows: "R/R",
      image: "assets/images/players/player-18.webp",
      profileUrl: "",
    },
    {
      number: "23",
      name: "PLAYER NAME",
      positions: ["3B", "UTIL"],
      gradYear: "20XX",
      batsThrows: "R/R",
      image: "assets/images/players/player-23.webp",
      profileUrl: "",
    },
  ],

  schedule: [
    {
      date: "MAY 09-10",
      name: "TOURNAMENT NAME",
      location: "CITY, STATE",
      type: "Tournament",
      status: "UPCOMING",
      mapUrl: "",
    },
    {
      date: "MAY 23-24",
      name: "TOURNAMENT NAME",
      location: "CITY, STATE",
      type: "Tournament",
      status: "UPCOMING",
      mapUrl: "",
    },
    {
      date: "JUN 06-07",
      name: "SHOWCASE NAME",
      location: "CITY, STATE",
      type: "Showcase",
      status: "UPCOMING",
      mapUrl: "",
    },
    {
      date: "JUN 20-21",
      name: "TOURNAMENT NAME",
      location: "CITY, STATE",
      type: "Tournament",
      status: "UPCOMING",
      mapUrl: "",
    },
  ],

  gallery: {
    copy: "Replace these slots with real game-day, dugout, practice, and travel moments. The layout automatically adapts to however many photos you add.",
    photos: [
      { src: "assets/images/gallery/game-01.webp", alt: "Game day team moment" },
      { src: "assets/images/gallery/game-02.webp", alt: "Softball player at bat" },
      { src: "assets/images/gallery/game-03.webp", alt: "Team in the dugout" },
      { src: "assets/images/gallery/game-04.webp", alt: "Travel softball action" },
      { src: "assets/images/gallery/game-05.webp", alt: "Team celebration" },
    ],
  },

  sponsors: [
    { name: "YOUR SPONSOR", logo: "assets/images/sponsors/sponsor-01.svg", url: "" },
    { name: "YOUR SPONSOR", logo: "assets/images/sponsors/sponsor-02.svg", url: "" },
    { name: "YOUR SPONSOR", logo: "assets/images/sponsors/sponsor-03.svg", url: "" },
    { name: "YOUR SPONSOR", logo: "assets/images/sponsors/sponsor-04.svg", url: "" },
  ],

  contact: {
    title: "COACHES. FAMILIES. SPONSORS.<br><em>WE'D LOVE TO HEAR FROM YOU.</em>",
    copy: "Questions about the team, schedule, recruiting, or sponsorships? Reach out directly.",
    email: "",
    phone: "",
    instagram: "",
    facebook: "",
  },

  footer: {
    copy: "Built for the team. Easy to update. Ready to travel.",
  },
};
