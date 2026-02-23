/* BNP IFRAME RESIZE — PARENT (SITE)
   - Works for inline + modal + any wrapper divs
   - Multi-brand safe: bnp.dragonforms.com + account.* + subscribe.*
*/
(function () {
  "use strict";

  if (window.__bnpIframeResizeParentInstalled) return;
  window.__bnpIframeResizeParentInstalled = true;

  var MSG_TYPE = "DF_IFRAME_RESIZE";

  // Modal sizing (classic)
  var MODAL_WIDTH     = "min(460px, 92vw)";
  var MODAL_MAX_WIDTH = "92vw";
  var MODAL_MIN_WIDTH = "320px";

  // Inline sizing
  var INLINE_WIDTH     = "100%";
  var INLINE_MAX_WIDTH = "100%";
  var INLINE_MIN_WIDTH = "0";

  // Height trim to remove the “iframe slightly too tall” gap
  var PARENT_PAD_PX = -6;
  var APPLY_THRESHOLD_PX = 2;

  function isAllowedOrigin(origin) {
    try {
      var u = new URL(origin);
      var host = (u.hostname || "").toLowerCase();
      if (host === "bnp.dragonforms.com") return true;
      if (host.startsWith("account.")) return true;
      if (host.startsWith("subscribe.")) return true;
      return false;
    } catch (e) {
      return false;
    }
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

  function isOverlayLike(iframe) {
    // Determine if this iframe is presented as a modal by looking for fixed/high z-index ancestors.
    try {
      var el = iframe;
      for (var i = 0; i < 8 && el; i++) {
        if (el === document.body || el === document.documentElement) break;

        var cs = window.getComputedStyle(el);
        if (cs) {
          if (cs.position === "fixed") return true;

          // many overlays are absolute within a fixed backdrop; high z-index is a strong clue
          var zi = parseInt(cs.zIndex, 10);
          if (cs.position === "absolute" && isFinite(zi) && zi >= 999) return true;
        }
        el = el.parentElement;
      }
    } catch (e) {}
    return false;
  }

  var lastApplied = new WeakMap(); // iframe -> px

  function applyBaseline(iframe) {
    if (!iframe) return;

    // Stop the tiny default iframe
    iframe.style.display = "block";
    iframe.style.border = "0";
    iframe.setAttribute("scrolling", "no");

    // baseline until first message arrives
    if (!iframe.style.minHeight) iframe.style.minHeight = "260px";
  }

  function applyWidthMode(iframe) {
    var modalish = isOverlayLike(iframe);

    if (modalish) {
      iframe.style.width = MODAL_WIDTH;
      iframe.style.maxWidth = MODAL_MAX_WIDTH;
      iframe.style.minWidth = MODAL_MIN_WIDTH;
      iframe.style.marginLeft = "auto";
      iframe.style.marginRight = "auto";
    } else {
      iframe.style.width = INLINE_WIDTH;
      iframe.style.maxWidth = INLINE_MAX_WIDTH;
      iframe.style.minWidth = INLINE_MIN_WIDTH;
      iframe.style.marginLeft = "0";
      iframe.style.marginRight = "0";
    }
  }

  function applyHeight(iframe, h) {
    var px = h + PARENT_PAD_PX;

    var prev = lastApplied.get(iframe) || 0;
    if (prev && Math.abs(px - prev) < APPLY_THRESHOLD_PX) return;

    lastApplied.set(iframe, px);
    iframe.style.height = px + "px";
    iframe.style.minHeight = px + "px";
  }

  // Optional: baseline apply on page load so every iframe looks decent immediately.
  function initBaseline() {
    var frames = document.querySelectorAll("iframe");
    for (var i = 0; i < frames.length; i++) applyBaseline(frames[i]);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initBaseline);
  else initBaseline();

  window.addEventListener("message", function (e) {
    if (!isAllowedOrigin(e.origin)) return;

    var d = e.data;
    if (!d || typeof d !== "object") return;
    if (d.type !== MSG_TYPE) return;

    var h = toInt(d.height);
    if (!h || h < 50) return;

    var iframe = findIframeForSource(e.source);
    if (!iframe) return;

    applyBaseline(iframe);
    applyWidthMode(iframe);
    applyHeight(iframe, h);
  }, true);

})();
