/* =====================================================================
   RESOURCES: edit this file to add videos, handbooks and links.

   Every video and handbook has a "level", which must be one of:
   "CSEC", "CAPE" or "University". Students can filter by level.

   VIDEOS (YouTube): paste only the video ID, the part after "v=" in a
   link like https://www.youtube.com/watch?v=abc123XYZ  ->  "abc123XYZ"

   HANDBOOKS: put the PDF in the /handbooks folder and write its path,
   e.g. "handbooks/csec-subject-guide.pdf". You can also paste a full
   link to a Google Drive file instead.

   To add one, copy an example block, remove the "//" at the start of
   each line, and fill it in.
   ===================================================================== */

window.RESOURCE_LEVELS = ["CSEC", "CAPE", "University"];

window.VIDEOS = [

  // {
  //   title: "How to choose your CAPE subjects",
  //   level: "CAPE",
  //   youtube: "VIDEO_ID_HERE",
  //   description: "Our mentors explain how they picked their subjects and what they'd do differently."
  // },

];

window.HANDBOOKS = [

  // {
  //   title: "CSEC study handbook",
  //   level: "CSEC",
  //   file: "handbooks/csec-study-handbook.pdf",
  //   description: "Subject tips, revision timetables and exam-day advice from top CSEC performers."
  // },

];

/* Helpful links from other websites, grouped by category. */
window.LINK_CATEGORIES = [
  "CSEC & CAPE",
  "Scholarships",
  "Universities & Applications",
  "Study Skills"
];

window.LINKS = [
  {
    title: "CXC syllabus downloads",
    url: "https://www.cxc.org/syllabus-downloads/",
    category: "CSEC & CAPE",
    description: "Official syllabuses for every CSEC and CAPE subject, straight from CXC."
  },
  {
    title: "CXC download materials",
    url: "https://www.cxc.org/download-materials",
    category: "CSEC & CAPE",
    description: "Specimen papers, mark schemes and subject reports published by CXC."
  },
  {
    title: "Khan Academy",
    url: "https://www.khanacademy.org",
    category: "Study Skills",
    description: "Free lessons and practice for maths, sciences and SAT prep."
  },
  {
    title: "EducationUSA advising centre, US Embassy Guyana",
    url: "https://educationusa.state.gov/centers/educationusa-advising-center-us-embassy-guyana",
    category: "Universities & Applications",
    description: "Free official advising in Georgetown for students applying to US universities."
  },
  {
    title: "Common App",
    url: "https://www.commonapp.org",
    category: "Universities & Applications",
    description: "The application most US universities use, with guides for international students."
  },
  {
    title: "University of Guyana",
    url: "https://www.uog.edu.gy",
    category: "Universities & Applications",
    description: "Programmes, admissions and deadlines at UG."
  },
  {
    title: "Chevening Scholarships",
    url: "https://www.chevening.org",
    category: "Scholarships",
    description: "UK government scholarships for a fully funded master's degree."
  },
  {
    title: "Commonwealth Scholarships",
    url: "https://cscuk.fcdo.gov.uk",
    category: "Scholarships",
    description: "Master's and PhD scholarships in the UK for students from Commonwealth countries."
  }
];
