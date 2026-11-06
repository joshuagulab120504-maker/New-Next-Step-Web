#!/usr/bin/env node
/* Builds a small share page for every video in data/resources.js:
     v/VIDEOID.html  ->  served as https://www.nextstepgy.org/v/VIDEOID

   When that link is pasted into WhatsApp, Instagram, Facebook or iMessage,
   the preview shows the video's own thumbnail and title. When someone opens
   it, they go straight to that video on the Resources page.

   Run after adding or changing a video:
     node tools/build-video-pages.js
   (If you forget, the Share button still works: the link opens the video,
   but the preview shows the site's default picture.) */

var fs = require("fs"), path = require("path"), vm = require("vm");
var root = path.join(__dirname, "..");
var SITE = "https://www.nextstepgy.org";

var sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, "data/resources.js"), "utf8"), sandbox);
var videos = sandbox.window.VIDEOS || [];

var esc = function (s) { return String(s || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); };
var ytId = function (v) {
  var m = String(v || "").match(/(?:youtu\.be\/|[?&]v=|\/(?:embed|shorts|live)\/)([\w-]{11})/);
  return m ? m[1] : String(v || "").trim();
};
var cleanTitle = function (t) { return String(t || "").replace(/^\s*next\s*step\s*guyana\s*[-–—|:]\s*/i, ""); };
var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var niceDate = function (d) {
  var m = String(d || "").match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  return m && MONTHS[+m[2] - 1] ? +m[3] + " " + MONTHS[+m[2] - 1] + " " + m[1] : "";
};

var outDir = path.join(root, "v");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
var keep = {};

videos.forEach(function (v) {
  var id = ytId(v.youtube);
  if (!/^[\w-]{11}$/.test(id)) { console.warn("Skipped (no valid YouTube link): " + v.title); return; }
  var title = cleanTitle(v.title);
  var bits = ["Free video from Next Step Guyana"];
  if (v.length) bits.push(v.length);
  if (niceDate(v.date)) bits.push("Posted " + niceDate(v.date));
  var desc = v.description || bits.join(" · ");
  /* YouTube's 1280x720 thumbnail. For a video uploaded below 720p, set thumbnail: "…" in data/resources.js */
  var img = v.thumbnail || "https://i.ytimg.com/vi/" + id + "/maxresdefault.jpg";
  var target = "/resources#v-" + id;
  var html = '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
    "<title>" + esc(title) + " | Next Step Guyana</title>\n" +
    '<meta name="description" content="' + esc(desc) + '">\n' +
    '<meta name="robots" content="noindex">\n' +
    '<link rel="canonical" href="' + SITE + '/resources">\n' +
    '<meta property="og:site_name" content="Next Step Guyana">\n' +
    '<meta property="og:type" content="video.other">\n' +
    '<meta property="og:title" content="' + esc(title) + '">\n' +
    '<meta property="og:description" content="' + esc(desc) + '">\n' +
    '<meta property="og:url" content="' + SITE + "/v/" + id + '">\n' +
    '<meta property="og:image" content="' + esc(img) + '">\n' +
    (v.thumbnail ? "" : '<meta property="og:image:width" content="1280">\n<meta property="og:image:height" content="720">\n') +
    '<meta property="og:image:alt" content="' + esc("Video: " + title) + '">\n' +
    '<meta name="twitter:card" content="summary_large_image">\n' +
    '<meta http-equiv="refresh" content="0; url=' + target + '">\n' +
    '<link rel="icon" href="/assets/favicon.png" type="image/png">\n' +
    "<script>location.replace(" + JSON.stringify(target) + ");</script>\n" +
    '</head>\n<body style="font-family:system-ui,sans-serif;padding:24px">\n' +
    '<p>Opening <a href="' + target + '">' + esc(title) + "</a> on Next Step Guyana…</p>\n</body>\n</html>\n";
  fs.writeFileSync(path.join(outDir, id + ".html"), html);
  keep[id + ".html"] = true;
  console.log("v/" + id + "  " + title);
});

/* Remove pages for videos that were taken off the list */
fs.readdirSync(outDir).forEach(function (f) {
  if (/\.html$/.test(f) && !keep[f]) { fs.unlinkSync(path.join(outDir, f)); console.log("removed v/" + f); }
});
