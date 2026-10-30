/* =====================================================================
   SITE SETTINGS: contact details used across every page.
   ===================================================================== */
window.SITE = {
  email: "nextstepgy@gmail.com",
  whatsapp: "https://whatsapp.com/channel/0029VbB2XqT7oQhUHQwGHe11",
  instagram: "https://www.instagram.com/nextstep.gy",
  tiktok: "https://www.tiktok.com/@nextstep.gy",
  /* Every mentor's "Contact" button goes here. Leave it "" to go back to
     emailing (each mentor's own email, or the team email if they have none). */
  mentorContact: "https://wa.me/message/C2S5KQM6RXLVD1",
  /* Number shown in the "Community" counter on the home page */
  community: 693
};

/* ----- You shouldn't need to edit below this line ----- */
(function () {
  var S = window.SITE;
  var PAGES = [
    ["index.html", "Home"],
    ["mentors.html", "Mentors"],
    ["resources.html", "Resources"],
    ["navi.html", "Navi"],
    ["events.html", "Q&A Events"],
    ["about.html", "About"],
    ["faq.html", "FAQ"]
  ];
  var here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  if (here === "") here = "index.html";
  if (here.indexOf(".") < 0) here += ".html"; /* hosts that hide .html, e.g. /about */

  var mark = '<img class="brand-mark" src="assets/logo-mark.png" alt="" width="40" height="40">';

  var header =
    '<a class="skip" href="#main">Skip to content</a>' +
    '<header class="site-header"><div class="wrap">' +
      '<a class="brand" href="index.html">' + mark + '<span class="brand-name">Next Step <span>Guyana</span></span></a>' +
      '<button class="menu-btn" type="button" aria-expanded="false" aria-controls="nav" aria-label="Open menu"><span></span><span></span><span></span></button>' +
      '<nav class="nav" id="nav" aria-label="Main">' +
        PAGES.map(function (p) {
          return '<a href="' + p[0] + '"' + (p[0] === here ? ' aria-current="page"' : "") + ">" + p[1] + "</a>";
        }).join("") +
      "</nav></div></header>";

  var year = new Date().getFullYear();
  var footer =
    '<footer class="site-footer"><div class="wrap">' +
      '<div class="fcol1"><a class="brand" href="index.html">' + mark + '<span class="brand-name">Next Step <span>Guyana</span></span></a>' +
      '<p class="tag">Powered by students, for students. Free mentorship, Q&amp;A events and resources for students across Guyana.</p></div>' +
      "<div><h4>Explore</h4><ul>" + PAGES.slice(1).map(function (p) { return '<li><a href="' + p[0] + '">' + p[1] + "</a></li>"; }).join("") + "</ul></div>" +
      "<div><h4>Contact</h4><ul>" +
        '<li><a href="mailto:' + S.email + '">' + S.email + "</a></li>" +
        '<li><a href="' + S.whatsapp + '" target="_blank" rel="noopener">WhatsApp channel</a></li>' +
        '<li><a href="' + S.instagram + '" target="_blank" rel="noopener">Instagram</a></li>' +
        '<li><a href="' + S.tiktok + '" target="_blank" rel="noopener">TikTok</a></li>' +
      "</ul></div></div>" +
      '<div class="foot-base"><div class="wrap"><span>© ' + year + " Next Step Guyana</span><span>An independent, student-led initiative</span></div></div>" +
    "</footer>";

  var h = document.getElementById("site-header");
  var f = document.getElementById("site-footer");
  if (h) h.outerHTML = header;
  if (f) f.outerHTML = footer;

  var hdr = document.querySelector(".site-header");
  var btn = document.querySelector(".menu-btn");
  var nav = document.getElementById("nav");
  function setMenu(open) {
    if (!btn || !nav) return;
    nav.classList.toggle("open", open);
    hdr.classList.toggle("menu-open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  if (btn && nav) {
    btn.addEventListener("click", function (e) { e.stopPropagation(); setMenu(!nav.classList.contains("open")); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("click", function (e) {
      if (nav.classList.contains("open") && !hdr.contains(e.target)) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) { setMenu(false); btn.focus(); }
    });
    window.addEventListener("resize", function () { if (window.innerWidth > 900) setMenu(false); });
  }

  /* Home: header turns solid once you scroll past the top of the artwork */
  if (document.body.classList.contains("home") && hdr) {
    var ticking = false;
    var onScroll = function () {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () { hdr.classList.toggle("solid", window.scrollY > 80); ticking = false; });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    hdr.classList.toggle("solid", window.scrollY > 80);
  }
})();

/* ===== Shared helpers used by the pages ===== */
window.NS = {
  esc: function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  },
  initials: function (name) {
    return name.replace(/,.*$/, "").split(/\s+/).filter(Boolean).map(function (w) { return w[0]; }).slice(0, 2).join("").toUpperCase();
  },
  /* Photo with initials fallback if the file is missing */
  photo: function (m, alt) {
    var ini = '<div class="initials" aria-hidden="true">' + NS.initials(m.name) + "</div>";
    if (!m.photo) return ini;
    return ini + '<img src="' + NS.esc(m.photo) + '" alt="' + NS.esc(alt || "") + '" loading="lazy" onerror="this.remove()">';
  },
  /* Short labels for the "Helps with" tags on mentor cards */
  topicLabel: {
    "CSEC & CAPE": "CSEC & CAPE",
    "Study Abroad & Scholarships": "Study abroad",
    "Business & Economics": "Business",
    "Engineering & Tech": "Engineering",
    "Medicine & Science": "Medicine",
    "Law & Humanities": "Law",
    "Careers & Skills": "Career guidance",
    "Youth Programs": "Youth programs"
  },
  card: function (m, i) {
    var tags = (m.topics || []).slice(0, 3).map(function (t) {
      return '<span class="mtag">' + NS.esc(NS.topicLabel[t] || t) + "</span>";
    }).join("");
    return '<button class="mcard" type="button" data-i="' + i + '" aria-haspopup="dialog">' +
      '<div class="mphoto">' + NS.photo(m, "") + "</div>" +
      '<div class="mbody"><span class="mname">' + NS.esc(m.name) + "</span>" +
      (tags ? '<span class="mtags">' + tags + "</span>" : "") +
      '<span class="mnow"><b>Currently:</b> ' + NS.esc(m.school) + "</span>" +
      '<span class="mview">View profile</span></div></button>';
  },
  /* Profile dialog: call once per page, then NS.openProfile(mentor) */
  setupDialog: function () {
    if (document.getElementById("profile")) return;
    var d = document.createElement("dialog");
    d.className = "profile";
    d.id = "profile";
    d.setAttribute("aria-labelledby", "p-name");
    document.body.appendChild(d);
    d.addEventListener("click", function (e) { if (e.target === d) d.close(); });
  },
  openProfile: function (m) {
    NS.setupDialog();
    var S = window.SITE, d = document.getElementById("profile");
    var first = m.name.split(" ")[0];
    var mail = m.email
      ? "mailto:" + m.email + "?subject=" + encodeURIComponent("Question from a Next Step Guyana student")
      : "mailto:" + S.email + "?subject=" + encodeURIComponent("Please connect me with " + m.name) +
        "&body=" + encodeURIComponent("Hi Next Step Guyana,\n\nI'd like to connect with " + m.name + ".\n\nMy name:\nMy school and year:\nWhat I'd like advice on:\n\nThank you!");
    var links = "";
    if (m.instagram) links += '<a class="btn btn-line" href="' + NS.esc(m.instagram) + '" target="_blank" rel="noopener">Instagram</a>';
    if (m.linkedin) links += '<a class="btn btn-line" href="' + NS.esc(m.linkedin) + '" target="_blank" rel="noopener">LinkedIn</a>';
    d.innerHTML =
      '<button class="pclose" type="button" aria-label="Close profile">×</button>' +
      '<div class="pgrid"><div class="pphoto">' + NS.photo(m, "Photo of " + m.name) + "</div>" +
      '<div class="pbody"><h2 id="p-name">' + NS.esc(m.name) + "</h2>" +
      '<p class="pmeta">' + NS.esc(m.school) + (m.field ? "<br>" + NS.esc(m.field) : "") + "</p>" +
      '<div class="ptopics">' + (m.topics || []).map(function (t) { return "<span>" + NS.esc(t) + "</span>"; }).join("") + "</div>" +
      "<ul>" + m.highlights.map(function (h) { return "<li>" + NS.esc(h) + "</li>"; }).join("") + "</ul>" +
      '<div class="pcontact"><a class="btn btn-gold" href="' + (S.mentorContact || mail) + '"' + (S.mentorContact ? ' target="_blank" rel="noopener"' : "") + '>Contact ' + NS.esc(first) + "</a>" + links + "</div>" +
      (S.mentorContact
        ? '<p class="pnote">Your message goes to the Next Step Guyana team on WhatsApp, who will introduce you to ' + NS.esc(first) + ".</p>"
        : (m.email ? "" : '<p class="pnote">Your email goes to the Next Step Guyana team, who will introduce you to ' + NS.esc(first) + ".</p>")) +
      "</div></div>";
    d.querySelector(".pclose").addEventListener("click", function () { d.close(); });
    d.showModal();
  },
  bindCards: function (root, list) {
    root.addEventListener("click", function (e) {
      var c = e.target.closest(".mcard");
      if (c) NS.openProfile(list[+c.getAttribute("data-i")]);
    });
  },
  /* Sessions: split into upcoming (today or later) and past */
  sessions: function () {
    var all = (window.SESSIONS || []).slice();
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var d = function (s) { var p = s.date.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); };
    return {
      upcoming: all.filter(function (s) { return d(s) >= today; }).sort(function (a, b) { return d(a) - d(b); }),
      past: all.filter(function (s) { return d(s) < today; }).sort(function (a, b) { return d(b) - d(a); }),
      date: d
    };
  },
  sessionHTML: function (s, past) {
    var dt = NS.sessions().date(s);
    var mon = dt.toLocaleString("en", { month: "short" });
    var wk = dt.toLocaleString("en", { weekday: "long" });
    var act = "";
    if (past && s.recording) act = '<a class="btn btn-line" href="' + NS.esc(s.recording) + '" target="_blank" rel="noopener">Watch recording</a>';
    else if (!past && s.joinLink) act = '<a class="btn btn-gold" href="' + NS.esc(s.joinLink) + '" target="_blank" rel="noopener">' + NS.esc(s.button || "Join event") + "</a>";
    else if (!past) act = '<a class="btn btn-line" href="' + window.SITE.whatsapp + '" target="_blank" rel="noopener">Get the link on WhatsApp</a>';
    return '<article class="session"><div class="sdate"><b>' + dt.getDate() + "</b><span>" + mon + " " + dt.getFullYear() + "</span></div>" +
      "<div>" + (s.theme ? '<span class="stheme">' + NS.esc(s.theme) + "</span>" : "") +
      "<h3>" + NS.esc(s.title) + "</h3>" +
      '<p class="smeta">' + wk + (s.time ? ", " + NS.esc(s.time) : "") + "</p>" +
      (s.where ? '<p class="swhere">' + NS.esc(s.where) + "</p>" : "") +
      (s.about ? '<p class="sabout">' + NS.esc(s.about) + "</p>" : "") +
      (s.mentors && s.mentors.length ? '<p class="smentors"><b>With</b> ' + s.mentors.map(NS.esc).join(", ") + "</p>" : "") +
      "</div>" + (act ? '<div class="sact">' + act + "</div>" : "") + "</article>";
  }
};
