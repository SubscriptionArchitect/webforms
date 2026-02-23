/* BNP IFRAME RESIZE — PARENT (SITE)
   Fixes modal bottom whitespace by:
   - allowing shrink (do not pin minHeight to last applied height)
   - applying a slightly stronger trim for modal iframes
*/
(function () {
  "use strict";

  if (window.__bnpIframeResizeParentInstalled) return;
  window.__bnpIframeResizeParentInstalled = true;

  var MSG_TYPE = "DF_IFRAME_RESIZE";

  // Modal sizing
  var MODAL_WIDTH     = "min(460px, 92vw)";
  var MODAL_MAX_WIDTH = "92vw";
  var MODAL_MIN_WIDTH = "320px";

  // Inline sizing
  var INLINE_WIDTH     = "100%";
  var INLINE_MAX_WIDTH = "100%";
  var INLINE_MIN_WIDTH = "0";

  // Height trims
  var INLINE_PAD_PX = -6;
  var MODAL_PAD_PX  = -10; // trims the “extra” that shows as bottom whitespace in modals
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
    try {
      var el = iframe;
      for (var i = 0; i < 8 && el; i++) {
        if (el === document.body || el === document.documentElement) break;
        var cs = window.getComputedStyle(el);
        if (cs) {
          if (cs.position === "fixed") return true;
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
    iframe.style.display = "block";
    iframe.style.border = "0";
    iframe.setAttribute("scrolling", "no");

    // Only a startup baseline; do NOT keep minHeight tied to updates
    if (!iframe.style.minHeight) iframe.style.minHeight = "260px";
  }

  function applyWidthMode(iframe, modalish) {
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

  function applyHeight(iframe, h, modalish) {
    var pad = modalish ? MODAL_PAD_PX : INLINE_PAD_PX;
    var px = h + pad;

    var prev = lastApplied.get(iframe) || 0;
    if (prev && Math.abs(px - prev) < APPLY_THRESHOLD_PX) return;

    lastApplied.set(iframe, px);

    // Set height only (so it can shrink)
    iframe.style.height = px + "px";

    // Important: DO NOT pin minHeight to px; that’s what causes “whitespace” on shrink.
    // Keep it at the initial baseline only.
  }

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

    var modalish = isOverlayLike(iframe);
    applyWidthMode(iframe, modalish);
    applyHeight(iframe, h, modalish);
  }, true);

})();
