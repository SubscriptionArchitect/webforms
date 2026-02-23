/* BNP IFRAME RESIZE — PARENT (SITE)
   Also handles inline article/paywall embeds (e.g. #paywall-container .olyticsPopupBR iframe).
*/
(function () {
  "use strict";

  if (window.__bnpIframeResizeInstalled) return;
  window.__bnpIframeResizeInstalled = true;

  var MSG_TYPE = "DF_IFRAME_RESIZE";

  // Default “modal-like” sizing (your existing behavior)
  var IFRAME_WIDTH     = "min(460px, 92vw)";
  var IFRAME_MAX_WIDTH = "92vw";
  var IFRAME_MIN_WIDTH = "320px";

  // Inline embed sizing (inside article/paywall containers)
  var INLINE_WIDTH     = "100%";
  var INLINE_MAX_WIDTH = "100%";
  var INLINE_MIN_WIDTH = "0";

  // ✅ If iframe is still too tall, this should be negative.
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

  function isInlineEmbed(iframe) {
    try {
      return !!iframe.closest("#paywall-container, .olyticsPopupBR, .paywall-container, .paywall, article");
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

  var lastApplied = new WeakMap(); // iframe -> px

  function applyChrome(iframe) {
    var inline = isInlineEmbed(iframe);

    iframe.style.width = inline ? INLINE_WIDTH : IFRAME_WIDTH;
    iframe.style.maxWidth = inline ? INLINE_MAX_WIDTH : IFRAME_MAX_WIDTH;
    iframe.style.minWidth = inline ? INLINE_MIN_WIDTH : IFRAME_MIN_WIDTH;

    iframe.style.display = "block";
    iframe.style.border = "0";
    iframe.setAttribute("scrolling", "no");

    if (inline) {
      iframe.style.marginLeft = "0";
      iframe.style.marginRight = "0";
    } else {
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
