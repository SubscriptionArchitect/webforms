/* BNP IFRAME RESIZE — PARENT (SITE)
   - Works for modals + inline
   - Multi-brand: bnp.dragonforms.com + account.* + subscribe.*
   - Fixes <p> wrapper whitespace around iframes (modal bottom gap)
   - Kills loading-overlay backdrop when showing Continue/message card
*/
(function () {
  "use strict";

  if (window.__bnpSiteScriptInstalled) return;
  window.__bnpSiteScriptInstalled = true;

  /* =========================
     PART A — LOADING OVERLAY
     ========================= */

  // CSS override for cases where dimming/backdrop is applied via ::before/::after
  (function injectOverlayCSS() {
    try {
      var css =
        "#loading-overlay.is-continue," +
        "#loading-overlay.is-continue::before," +
        "#loading-overlay.is-continue::after{" +
        "background:transparent !important;" +
        "backdrop-filter:none !important;" +
        "-webkit-backdrop-filter:none !important;" +
        "box-shadow:none !important;" +
        "}" +
        "#loading-overlay.is-continue{background:transparent !important;}";
      var style = document.createElement("style");
      style.type = "text/css";
      style.appendChild(document.createTextNode(css));
      document.head.appendChild(style);
    } catch (e) {}
  })();

  function killLoadingBackdropIfContinue() {
    var overlay = document.getElementById("loading-overlay");
    if (!overlay) return;

    // Primary state flag you showed in your markup
    var isContinue = overlay.classList.contains("is-continue");

    if (!isContinue) return;

    // Remove backdrop/dimming applied directly to the overlay element
    overlay.style.background = "transparent";
    overlay.style.backdropFilter = "none";
    overlay.style.webkitBackdropFilter = "none";
    overlay.style.boxShadow = "none";

    // Hide common spinner/loading elements if present
    overlay.querySelectorAll(
      ".spinner, .loading-spinner, [data-spinner], .loading-text, [data-loading]"
    ).forEach(function (el) {
      el.style.display = "none";
    });

    // Ensure the message card remains clickable
    var card = overlay.firstElementChild;
    if (card) card.style.pointerEvents = "auto";
    overlay.style.pointerEvents = "auto";
  }

  // Run now and keep enforcing
  killLoadingBackdropIfContinue();
  try {
    new MutationObserver(function () {
      killLoadingBackdropIfContinue();
    }).observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["class", "style", "aria-busy", "aria-hidden"]
    });
  } catch (e) {}
  setInterval(killLoadingBackdropIfContinue, 700);

  /* =========================
     PART B — IFRAME RESIZE
     ========================= */

  var MSG_TYPE = "DF_IFRAME_RESIZE";

  // Modal sizing (your original behavior)
  var IFRAME_WIDTH     = "min(460px, 92vw)";
  var IFRAME_MAX_WIDTH = "92vw";
  var IFRAME_MIN_WIDTH = "320px";

  // Inline sizing (only when explicitly marked)
  var INLINE_WIDTH     = "100%";
  var INLINE_MAX_WIDTH = "100%";
  var INLINE_MIN_WIDTH = "0";

  // Height trim
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
    return /dragoniframe=true|omedasite=|loading\.do|init\.do|paywall|articlelimit|welcome/i.test(src);
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

  // Removes the 8–12px whitespace caused by <p> wrappers / baseline layout
  function normalizeIframeWrappers(iframe) {
    iframe.style.display = "block";
    iframe.style.verticalAlign = "top";
    iframe.style.margin = "0";
    iframe.style.padding = "0";
    iframe.style.border = "0";

    var p = iframe.parentElement;
    if (!p) return;

    var tag = (p.tagName || "").toUpperCase();
    if (tag === "P") {
      p.style.display = "block";
      p.style.margin = "0";
      p.style.padding = "0";
      p.style.lineHeight = "0";
      p.style.fontSize = "0";
    }
  }

  var lastApplied = new WeakMap(); // iframe -> px

  function applyChrome(iframe) {
    var inline = isInlineMarked(iframe);
    var modalish = !inline && isOverlayLike(iframe);

    iframe.setAttribute("scrolling", "no");

    // Always normalize to prevent wrapper whitespace
    if (modalish) normalizeIframeWrappers(iframe);

    if (inline) {
      iframe.style.display = "block";
      iframe.style.width = INLINE_WIDTH;
      iframe.style.maxWidth = INLINE_MAX_WIDTH;
      iframe.style.minWidth = INLINE_MIN_WIDTH;
      iframe.style.marginLeft = "0";
      iframe.style.marginRight = "0";
      iframe.style.verticalAlign = "top";
      if (!iframe.style.minHeight) iframe.style.minHeight = "260px";
      return;
    }

    // Modal/default behavior
    iframe.style.display = "block";
    iframe.style.width = IFRAME_WIDTH;
    iframe.style.maxWidth = IFRAME_MAX_WIDTH;
    iframe.style.minWidth = IFRAME_MIN_WIDTH;
    iframe.style.marginLeft = "auto";
    iframe.style.marginRight = "auto";
    iframe.style.verticalAlign = "top";

    // If modal-ish, wrapper normalization already handled baseline gap
    if (modalish) {
      // keep as-is
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
