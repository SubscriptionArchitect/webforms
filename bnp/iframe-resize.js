/* BNP IFRAME RESIZE — PARENT (SITE)
   Applies height with a SMALL NEGATIVE PAD to remove the “iframe too tall” gap.
*/
(function () {
  "use strict";

  var MSG_TYPE = "DF_IFRAME_RESIZE";

  // Width controls (unchanged unless you want to tweak)
  var IFRAME_WIDTH     = "min(460px, 92vw)";
  var IFRAME_MAX_WIDTH = "92vw";
  var IFRAME_MIN_WIDTH = "320px";

  // ✅ If iframe is still too tall, this should be negative.
  // Start at -6. If still tall, try -8. If it clips, try -4.
  var PARENT_PAD_PX = -6;

  var APPLY_THRESHOLD_PX = 2;

  var ALLOWED_ORIGINS = {
    "https://bnp.dragonforms.com": true,
    "https://account.enr.com": true,
    "https://subscribe.enr.com": true
  };

  function isTargetIframeSrc(src) {
    src = String(src || "");
    return /dragoniframe=true|omedasite=|loading\.do|init\.do/i.test(src);
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
    var px = h + PARENT_PAD_PX;

    var prev = lastApplied.get(iframe) || 0;
    if (prev && Math.abs(px - prev) < APPLY_THRESHOLD_PX) return;

    lastApplied.set(iframe, px);
    iframe.style.height = px + "px";
    iframe.style.minHeight = px + "px";
  }

  window.__resizeListenerInstalled = true;

  window.addEventListener("message", function (e) {
    if (ALLOWED_ORIGINS && Object.keys(ALLOWED_ORIGINS).length) {
      if (!ALLOWED_ORIGINS[e.origin]) return;
    }

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
