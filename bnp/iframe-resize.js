/* BNP IFRAME RESIZE — PARENT (SITE)
   - Doesn't care what div the iframe is in
   - Always sizes the iframe that posted the message
   - Auto width mode:
     * If iframe (or ancestor) is fixed/overlay-ish => modal sizing
     * Else => inline sizing (100%)
*/
(function () {
  "use strict";

  if (window.__bnpIframeResizeInstalled) return;
  window.__bnpIframeResizeInstalled = true;

  var MSG_TYPE = "DF_IFRAME_RESIZE";

  // Modal sizing (original intent)
  var MODAL_WIDTH     = "min(460px, 92vw)";
  var MODAL_MAX_WIDTH = "92vw";
  var MODAL_MIN_WIDTH = "320px";

  // Inline sizing
  var INLINE_WIDTH     = "100%";
  var INLINE_MAX_WIDTH = "100%";
  var INLINE_MIN_WIDTH = "0";

  // Height trim (your original approach)
  var PARENT_PAD_PX = -6;
  var APPLY_THRESHOLD_PX = 2;

  // Origin allow (multi-brand safe)
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

  function isOverlayLike(el) {
    // Walk up a bit and look for "fixed overlay/modal" characteristics
    // This avoids needing specific wrapper divs.
    try {
      var cur = el;
      for (var i = 0; i < 6 && cur; i++) {
        if (cur === document.body || cur === document.documentElement) break;
        var cs = window.getComputedStyle(cur);
        if (!cs) { cur = cur.parentElement; continue; }

        var pos = cs.position;
        if (pos === "fixed") return true;

        // Some modals are absolute inside a fixed backdrop; treat large absolute layers as modal-ish.
        if (pos === "absolute") {
          var zi = parseInt(cs.zIndex, 10);
          if (isFinite(zi) && zi >= 999) return true;
        }

        cur = cur.parentElement;
      }
    } catch (e) {}
    return false;
  }

  var lastApplied = new WeakMap(); // iframe -> px

  function applyBaseline(iframe) {
    iframe.style.display = "block";
    iframe.style.border = "0";
    iframe.setAttribute("scrolling", "no");

    // Prevent tiny default size before first message / during load
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

  // Baseline apply for any iframe we might resize later (optional but helps)
  function initAllIframes() {
    var frames = document.querySelectorAll("iframe");
    for (var i = 0; i < frames.length; i++) {
      applyBaseline(frames[i]);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAllIframes);
  } else {
    initAllIframes();
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

    applyBaseline(iframe);
    applyWidthMode(iframe);
    applyHeight(iframe, h);
  }, true);

})();
