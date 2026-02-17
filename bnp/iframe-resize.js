/* BNP IFRAME RESIZE — PARENT (SITE)
   - Listens for {type:"DF_IFRAME_RESIZE", height:n}
   - Maps e.source -> iframe.contentWindow (works with multiple iframes)
   - Applies stable centered width + height (thresholded)
*/
(function () {
  "use strict";

  // ---------- CONFIG ----------
  var MSG_TYPE = "DF_IFRAME_RESIZE";

  // Width controls (narrow + centered)
  var IFRAME_WIDTH     = "min(460px, 92vw)";
  var IFRAME_MAX_WIDTH = "92vw";
  var IFRAME_MIN_WIDTH = "320px";

  // Height clamp (should cover child clamp)
  var MIN_H = 520;
  var MAX_H = 1200;

  // If iframe is a hair too tall, lower this (0, -2, etc.)
  var PARENT_PAD_PX = 0;

  // Jitter control
  var APPLY_THRESHOLD_PX = 14;

  // Optional: restrict which origins are allowed to resize
  var ALLOWED_ORIGINS = {
    "https://bnp.dragonforms.com": true,
    "https://account.enr.com": true,
    "https://subscribe.enr.com": true
  };

  // Only resize iframes with these markers in src (avoid ads)
  function isTargetIframeSrc(src) {
    src = String(src || "");
    return /dragoniframe=true|omedasite=|loading\.do|init\.do/i.test(src);
  }

  function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }
  function toInt(v) { var n = parseInt(v, 10); return isFinite(n) ? n : null; }

  function findIframeForSource(srcWin) {
    var frames = document.querySelectorAll("iframe");
    for (var i = 0; i < frames.length; i++) {
      var f = frames[i];
      try {
        if (f.contentWindow === srcWin) return f;
      } catch (e) {}
    }
    return null;
  }

  var lastApplied = new WeakMap(); // iframe -> px

  function applyChrome(iframe) {
    iframe.style.width = IFRAME_WIDTH;
    iframe.style.maxWidth = IFRAME_MAX_WIDTH;
    iframe.style.minWidth = IFRAME_MIN_WIDTH;
    iframe.style.display = "block";
    iframe.style.marginLeft = "auto";
    iframe.style.marginRight = "auto";
    iframe.style.border = "0";
    iframe.setAttribute("scrolling", "no");
  }

  function applyHeight(iframe, h) {
    var px = clamp(h, MIN_H, MAX_H) + PARENT_PAD_PX;

    var prev = lastApplied.get(iframe) || 0;
    if (prev && Math.abs(px - prev) < APPLY_THRESHOLD_PX) return;

    lastApplied.set(iframe, px);
    iframe.style.height = px + "px";
    iframe.style.minHeight = px + "px";
  }

  // For easy verification in console
  window.__resizeListenerInstalled = true;

  window.addEventListener("message", function (e) {
    // Origin guard (optional)
    if (ALLOWED_ORIGINS && Object.keys(ALLOWED_ORIGINS).length) {
      if (!ALLOWED_ORIGINS[e.origin]) return;
    }

    var d = e.data;
    if (!d || typeof d !== "object") return;
    if (d.type !== MSG_TYPE) return;

    var h = toInt(d.height);
    if (!h || h < 200) return;

    var iframe = findIframeForSource(e.source);
    if (!iframe) return;

    var src = iframe.getAttribute("src") || iframe.src || "";
    if (!isTargetIframeSrc(src)) return;

    applyChrome(iframe);
    applyHeight(iframe, h);
  }, true);
})();
