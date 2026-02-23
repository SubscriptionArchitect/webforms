/* BNP IFRAME RESIZE — PARENT (SITE)
   Supports BOTH:
   - Inline:  iframe[data-bnp-inline="1"]  => full width
   - Modal:   iframe[data-bnp-modal="1"]   => constrained modal panel (you control wrapper)
*/
(function () {
  "use strict";

  if (window.__bnpIframeResizeParentInstalled) return;
  window.__bnpIframeResizeParentInstalled = true;

  var MSG_TYPE = "DF_IFRAME_RESIZE";

  // Height trim to remove the “iframe too tall” gap
  var PARENT_PAD_PX = -6;
  var APPLY_THRESHOLD_PX = 2;

  // Safer origin allow: bnp.dragonforms.com + any account.* + any subscribe.*
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

  function isTargetIframeSrc(src) {
    src = String(src || "");
    return /dragoniframe=true|omedasite=|loading\.do|init\.do|paywall|articlelimit/i.test(src);
  }

  function toInt(v) {
    var n = parseInt(v, 10);
    return isFinite(n) ? n : null;
  }

  function findIframeForSource(srcWin) {
    var frames = document.querySelectorAll("iframe");
    for (var i = 0; i < frames.length; i++) {
      var f = frames[i];
      try { if (f.contentWindow === srcWin) return f; } catch (e) {}
    }
    return null;
  }

  function isInline(iframe) {
    var v = (iframe.getAttribute("data-bnp-inline") || "").toLowerCase();
    return v === "1" || v === "true" || v === "yes";
  }

  function isModal(iframe) {
    var v = (iframe.getAttribute("data-bnp-modal") || "").toLowerCase();
    return v === "1" || v === "true" || v === "yes";
  }

  // Apply baseline “chrome” so iframes never render tiny, and modes never conflict
  function applyChrome(iframe) {
    if (!iframe) return;

    iframe.style.display = "block";
    iframe.style.border = "0";
    iframe.setAttribute("scrolling", "no");

    if (isInline(iframe)) {
      iframe.style.width = "100%";
      iframe.style.maxWidth = "100%";
      iframe.style.minWidth = "0";
      iframe.style.marginLeft = "0";
      iframe.style.marginRight = "0";
      if (!iframe.style.minHeight) iframe.style.minHeight = "260px";
      return;
    }

    if (isModal(iframe)) {
      // Modal iframe itself should be 100% of its modal panel
      iframe.style.width = "100%";
      iframe.style.maxWidth = "100%";
      iframe.style.minWidth = "0";
      iframe.style.marginLeft = "0";
      iframe.style.marginRight = "0";
      if (!iframe.style.minHeight) iframe.style.minHeight = "260px";
      return;
    }

    // If neither marker exists, do nothing (prevents accidental mode switching)
  }

  var lastApplied = new WeakMap();

  function applyHeight(iframe, h) {
    var px = h + PARENT_PAD_PX;

    var prev = lastApplied.get(iframe) || 0;
    if (prev && Math.abs(px - prev) < APPLY_THRESHOLD_PX) return;

    lastApplied.set(iframe, px);
    iframe.style.height = px + "px";
    iframe.style.minHeight = px + "px";
  }

  // Baseline pass on load (so inline doesn't start tiny)
  function initMarkedIframes() {
    var frames = document.querySelectorAll('iframe[data-bnp-inline="1"], iframe[data-bnp-modal="1"]');
    for (var i = 0; i < frames.length; i++) applyChrome(frames[i]);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMarkedIframes);
  } else {
    initMarkedIframes();
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

    // Only act on explicitly marked iframes (prevents unexpected side-effects)
    if (!isInline(iframe) && !isModal(iframe)) return;

    var src = iframe.getAttribute("src") || iframe.src || "";
    if (src && !isTargetIframeSrc(src)) {
      // If you want to allow ALL pages to resize, remove this guard.
      // Keeping it prevents random third-party iframes from being controlled.
      return;
    }

    applyChrome(iframe);
    applyHeight(iframe, h);
  }, true);

})();
