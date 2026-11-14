/* =====================================================================
   Q&A EVENTS: edit this file to announce events.

   Copy the example block below, remove the "//" at the start of each
   line, and fill it in. Events sort themselves: anything with a date
   in the future shows as Upcoming; past ones move to Past sessions
   automatically.

   title     What the event is about
   theme     Short topic tag (e.g. "Study Abroad", "CAPE", "Law")
   date      "YYYY-MM-DD"  (e.g. "2026-11-14")
   time      As you want it shown, e.g. "6:30 PM (GY)"
   where     e.g. "Google Meet", "Instagram Live", "Zoom"
   mentors   Names of mentors on the panel (match the Mentors list)
   about     One or two sentences describing the event
   joinLink  Link students click to join or register (leave "" until you have it)
   button    Optional button text, e.g. "Register" (default "Join event")
   recording Link to the recording afterwards, e.g. a YouTube link
   handout   Optional page or file to share (e.g. "brochure.html"). Shows a
             button before AND after the event, and replaces the join button.
   handoutButton  Text for that button (default "View handout")
   id        Optional short name so other pages can link to the event,
             e.g. "college-fair-2026" -> events.html#college-fair-2026
   photos    Optional gallery shown on the event card. Each photo is
             { src: "folder/01", alt: "what's in the photo" }. The folder
             needs 01.webp (large), 01-sm.webp and 01-sm.jpg (small).
             Ask Claude to prepare new photos; it sizes them for phones.
   ===================================================================== */

window.SESSIONS = [

  {
    title: "EducationUSA Guyana College Fair",
    theme: "University fair",
    date: "2026-10-30",
    time: "9:30 AM to 6:00 PM",
    where: "Pegasus Exhibition Center, Georgetown",
    mentors: [],
    about: "Hosted by EducationUSA. We met students and shared our brochure.",
    joinLink: "",
    button: "",
    handout: "brochure.html",
    handoutButton: "View our brochure",
    recording: "",
    id: "college-fair-2026",
    photos: [
      { src: "assets/gallery/college-fair-2026/01", alt: "A full room of students raising their hands during a session at the college fair" },
      { src: "assets/gallery/college-fair-2026/02", alt: "A Next Step mentor answering questions from a group of students at our table" },
      { src: "assets/gallery/college-fair-2026/03", alt: "A Next Step mentor going through brochures with three students" },
      { src: "assets/gallery/college-fair-2026/04", alt: "A Next Step mentor handing our brochure to a smiling student" },
      { src: "assets/gallery/college-fair-2026/05", alt: "Two Next Step Guyana team members at our table, with brochures and our banner" },
      { src: "assets/gallery/college-fair-2026/06", alt: "A Next Step mentor with a group of students at our booth, the website open on a laptop" },
      { src: "assets/gallery/college-fair-2026/07", alt: "Mentor Joshua Singh showing our brochure to a visitor" },
      { src: "assets/gallery/college-fair-2026/08", alt: "Three students in front of the Next Step Guyana banner" },
      { src: "assets/gallery/college-fair-2026/09", alt: "Our banner and the Next Step Guyana website on a laptop at the fair" }
    ]
  },

  // {
  //   title: "Studying abroad: applications, essays and scholarships",
  //   theme: "Study Abroad",
  //   date: "2026-11-14",
  //   time: "6:30 PM (GY)",
  //   where: "Google Meet",
  //   mentors: ["Joshua Gulab", "Aniyah Couchman", "Arav Arjoon"],
  //   about: "How our mentors chose schools, wrote their essays and paid for it. Bring your questions.",
  //   joinLink: "",
  //   recording: ""
  // },

];
