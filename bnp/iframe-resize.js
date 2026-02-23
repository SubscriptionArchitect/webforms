/* BNP IFRAME RESIZE — PARENT (SITE)
   - Modal behavior preserved (centered + constrained width)
   - Inline embeds supported (full width) without breaking modal
   - Brand-agnostic: use data-bnp-inline="1" for inline embeds
*/
(function () {
  "use strict";

  if (window.__bnpIframeResizeInstalled) return;
  window.__bnpIframeResizeInstalled = true;

  var MSG_TYPE = "DF_IFRAME_RESIZE";

  // Modal sizing (your original behavior)
  var IFRAME_WIDTH     = "min(460px, 92vw)";
  var IFRAME_MAX_WIDTH = "92vw";
  var IFRAME_MIN_WIDTH = "320px";

  // Inline sizing
  var INLINE_WIDTH     = "100%";
  var INLINE_MAX_WIDTH = "100%";
  var INLINE_MIN_WIDTH = "0";

  // Height trim
  var PARENT_PAD_PX = -6;

  var APPLY_THRESHOLD_PX = 2;

  var ALLOWED_ORIGINS = {
    "https://bnp.dragonforms.com": true,
    "https://account.enr.com": true,
    "https://subscribe.enr.com": true
  };

  function isTargetIframeSrc(src) {
    src = String(src || "");
    return /dragoniframe=true|omedasite=|loading\.do|init\.do|_paywall_|paywall|articlelimit/i.test(src);
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

  // Inline detection:
  // 1) Explicit marker (recommended everywhere): data-bnp-inline="1"
  // 2) DOM context: common inline/embed containers (safe list)
  // Never uses src to decide inline vs modal (prevents modal breakage).
  function isInlineEmbed(iframe) {
    try {
      if (!iframe) return false;

      var mark = iframe.getAttribute && (iframe.getAttribute("data-bnp-inline") || "");
      if (mark === "1" || mark === "true" || mark === "yes") return true;

      // DOM-based inline hints (generic, not brand-specific)
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

  var lastApplied = new WeakMap(); // iframe -> px

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

      // Baseline so it never renders tiny before first resize message
      if (!iframe.style.minHeight) iframe.style.minHeight = "260px";
    } else {
      iframe.style.width = IFRAME_WIDTH;
      iframe.style.maxWidth = IFRAME_MAX_WIDTH;
      iframe.style.minWidth = IFRAME_MIN_WIDTH;
      iframe.style.marginLeft = "auto";
      iframe.style.marginRight = "auto";
      // No modal baseline min-height (keeps original modal behavior intact)
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
