/* BNP IFRAME RESIZE — PARENT (SITE)
   - Modal behavior preserved (centered + constrained width)
   - Inline embeds supported (full width)
   - Brand-agnostic
*/

(function () {
  "use strict";

  if (window.__bnpIframeResizeInstalled) return;
  window.__bnpIframeResizeInstalled = true;

  var MSG_TYPE = "DF_IFRAME_RESIZE";

  /* ------------------------------
     MODAL SIZING (unchanged)
  ------------------------------ */
  var IFRAME_WIDTH     = "min(460px, 92vw)";
  var IFRAME_MAX_WIDTH = "92vw";
  var IFRAME_MIN_WIDTH = "320px";

  /* ------------------------------
     INLINE SIZING
  ------------------------------ */
  var INLINE_WIDTH     = "100%";
  var INLINE_MAX_WIDTH = "100%";
  var INLINE_MIN_WIDTH = "0";

  /* ------------------------------
     HEIGHT ADJUSTMENT
  ------------------------------ */
  var PARENT_PAD_PX = -6;  // adjust if ever slightly tall
  var APPLY_THRESHOLD_PX = 2;

  /* ------------------------------
     ORIGIN VALIDATION (multi-brand safe)
     Allows:
       - bnp.dragonforms.com
       - any account.<brand>.com
       - any subscribe.<brand>.com
  ------------------------------ */
  function isAllowedOrigin(origin) {
    try {
      var url = new URL(origin);
      var host = url.hostname.toLowerCase();

      if (host === "bnp.dragonforms.com") return true;
      if (host.startsWith("account.")) return true;
      if (host.startsWith("subscribe.")) return true;

      return false;
    } catch (e) {
      return false;
    }
  }

  function isTargetIframeSrc(src) {
    src = String(src || "");
    return /dragoniframe=true|omedasite=|loading\.do|init\.do|_paywall_|paywall|articlelimit/i.test(src);
  }

  function toInt(v) {
    var n = parseInt(v, 10);
    return isFinite(n) ? n : null;
  }

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

  /* ------------------------------
     INLINE DETECTION
     - data-bnp-inline="1" (recommended)
     - any class containing "paywall-embed"
     - common inline content containers
  ------------------------------ */
  function isInlineEmbed(iframe) {
    try {
      if (!iframe) return false;

      // Explicit generic marker
      var mark = iframe.getAttribute && (iframe.getAttribute("data-bnp-inline") || "");
      if (mark === "1" || mark === "true" || mark === "yes") return true;

      // Backward compatibility: any class containing paywall-embed
      var cls = (iframe.className || "").toLowerCase();
      if (cls.indexOf("paywall-embed") !== -1) return true;

      // DOM context hints
      return !!iframe.closest(
        "#paywall-container," +
        ".paywall-container," +
        ".paywall," +
        ".metered-paywall," +
        ".regwall," +
        ".regwall-container," +
        ".article-body," +
        ".article-content," +
        ".story-body," +
        ".entry-content," +
        ".post-content," +
        ".content-body," +
        ".page-content"
      );
    } catch (e) {
      return false;
    }
  }

  var lastApplied = new WeakMap();

  function applyChrome(iframe) {
    var inline = isInlineEmbed(iframe);

    iframe.style.display = "block";
    iframe.style.border = "0";
    iframe.setAttribute("scrolling", "no");

    if (inline) {
      iframe.style.width = INLINE_WIDTH;
      iframe.style.maxWidth = INLINE_MAX_WIDTH;
      iframe.style.minWidth = INLINE_MIN_WIDTH;
      iframe.style.marginLeft = "0";
      iframe.style.marginRight = "0";

      // Prevent tiny default 300x150 render
      if (!iframe.style.minHeight) iframe.style.minHeight = "260px";
    } else {
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
