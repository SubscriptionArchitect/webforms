/* BNP IFRAME RESIZE — PARENT (SITE)
   Preserves original modal behavior (no whitespace regression),
   adds inline full-width ONLY when iframe is explicitly marked.
*/
(function () {
  "use strict";

  var MSG_TYPE = "DF_IFRAME_RESIZE";

  // Modal sizing (your original)
  var IFRAME_WIDTH     = "min(460px, 92vw)";
  var IFRAME_MAX_WIDTH = "92vw";
  var IFRAME_MIN_WIDTH = "320px";

  // Inline sizing (only when marked)
  var INLINE_WIDTH     = "100%";
  var INLINE_MAX_WIDTH = "100%";
  var INLINE_MIN_WIDTH = "0";

  // Same trim behavior you were using
  var PARENT_PAD_PX = -6;
  var APPLY_THRESHOLD_PX = 2;

  function isAllowedOrigin(origin) {
    try {
      var u = new URL(origin);
      var host = (u.hostname || "").toLowerCase();
      if (host === "bnp.dragonforms.com") return true;
      if (host.indexOf("account.") === 0) return true;
      if (host.indexOf("subscribe.") === 0) return true;
      return false;
    } catch (e) {
      return false;
    }
  }

  function isTargetIframeSrc(src) {
    src = String(src || "");
    return /dragoniframe=true|omedasite=|loading\.do|init\.do|paywall|articlelimit/i.test(src);
  }

  function toInt(v) { var n = parseInt(v, 10); return isFinite(n) ? n : null; }

  function findIframeForSource(srcWin) {
    var frames = document.querySelectorAll("iframe");
    for (var i = 0; i < frames.length; i++) {
      var f = frames[i];
      try { if (f.contentWindow === srcWin) return f; } catch (e) {}
    }
    return null;
  }

  function isInlineMarked(iframe) {
    try {
      var v = (iframe.getAttribute("data-bnp-inline") || "").toLowerCase();
      if (v === "1" || v === "true" || v === "yes") return true;

      // Back-compat: any legacy class containing "paywall-embed"
      var cls = (iframe.className || "").toLowerCase();
      if (cls.indexOf("paywall-embed") !== -1) return true;
    } catch (e) {}
    return false;
  }

  var lastApplied = new WeakMap(); // iframe -> px

  function applyChrome(iframe) {
    var inline = isInlineMarked(iframe);

    iframe.style.display = "block";
    iframe.style.border = "0";
    iframe.setAttribute("scrolling", "no");

    if (inline) {
      iframe.style.width = INLINE_WIDTH;
      iframe.style.maxWidth = INLINE_MAX_WIDTH;
      iframe.style.minWidth = INLINE_MIN_WIDTH;
      iframe.style.marginLeft = "0";
      iframe.style.marginRight = "0";
      if (!iframe.style.minHeight) iframe.style.minHeight = "260px"; // baseline only
    } else {
      // Modal/default behavior (unchanged from your original)
      iframe.style.width = IFRAME_WIDTH;
      iframe.style.maxWidth = IFRAME_MAX_WIDTH;
      iframe.style.minWidth = IFRAME_MIN_WIDTH;
      iframe.style.marginLeft = "auto";
      iframe.style.marginRight = "auto";
    }
  }

  function applyHeight(iframe, h) {
    var px = h + PARENT_PAD_PX;

    var prev = lastApplied.get(iframe) || 0;
    if (prev && Math.abs(px - prev) < APPLY_THRESHOLD_PX) return;

    lastApplied.set(iframe, px);

    // Original behavior that you said had no whitespace:
    iframe.style.height = px + "px";
    iframe.style.minHeight = px + "px";
  }

  window.addEventListener("message", function (e) {
    if (!isAllowedOrigin(e.origin)) return;

    var d = e.data;
    if (!d || typeof d !== "object") return;
    if (d.type !== MSG_TYPE) return;

    var h = toInt(d.height);
    if (!h || h < 50) return;

    var iframe = findIframeForSource(e.source);
    if (!iframe) return;

    var src = iframe.getAttribute("src") || iframe.src || "";
    if (!isTargetIframeSrc(src)) return;

    applyChrome(iframe);
    applyHeight(iframe, h);
  }, true);

})();
