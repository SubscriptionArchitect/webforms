/* BNP IFRAME RESIZE — PARENT (SITE) + OLYTICSMODAL TOP-LOCK HELPER
   - Removes <p> wrapper whitespace/baseline gap.
   - Resizes iframe height from DF messages.
   - Fits width on tiny screens (<= 350px).
   - On < 500px wide screens: forces .olyticsmodal to stay near the TOP (never bottom-docked).
*/
(function () {
  "use strict";

  if (window.__bnpIframeResizeParentInstalled) return;
  window.__bnpIframeResizeParentInstalled = true;

  var MSG_TYPE = "DF_IFRAME_RESIZE";

  // Modal sizing: always fits viewport (including <= 350px)
  var MODAL_WIDTH = "min(460px, calc(100vw - 24px))";
  var MODAL_MAX_WIDTH = "calc(100vw - 24px)";
  var MODAL_MIN_WIDTH = "0";

  // Inline sizing (only when explicitly marked)
  var INLINE_WIDTH = "100%";
  var INLINE_MAX_WIDTH = "100%";
  var INLINE_MIN_WIDTH = "0";

  // Height trim
  var PARENT_PAD_PX = -6;
  var APPLY_THRESHOLD_PX = 2;

  function mobileTopOffset() {
    return "calc(env(safe-area-inset-top, 0px) + 12px)";
  }

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

  function isInlineMarked(iframe) {
    try {
      var v = (iframe.getAttribute("data-bnp-inline") || "").toLowerCase();
      if (v === "1" || v === "true" || v === "yes") return true;

      var cls = (iframe.className || "").toLowerCase();
      if (cls.indexOf("paywall-embed") !== -1) return true;
    } catch (e) {}
    return false;
  }

  function isOverlayLike(iframe) {
    try {
      var el = iframe;
      for (var i = 0; i < 10 && el; i++) {
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

  function normalizeIframeWrappers(iframe) {
    iframe.style.display = "block";
    iframe.style.verticalAlign = "top";
    iframe.style.margin = "0";
    iframe.style.padding = "0";
    iframe.style.border = "0";
    iframe.style.boxSizing = "border-box";

    var p = iframe.parentElement;
    if (!p) return;

    var tag = (p.tagName || "").toUpperCase();
    if (tag === "P") {
      p.style.display = "block";
      p.style.margin = "0";
      p.style.padding = "0";
      p.style.lineHeight = "0";
      p.style.fontSize = "0";
    } else {
      if (!p.style.marginBottom) p.style.marginBottom = "0";
    }
  }

  /* ============================
     OLYTICSMODAL TOP-LOCK HELPER
     ============================ */

  function ensureOlyticsCss() {
    if (document.getElementById("bnp-olytics-toplock-css")) return;

    var css = ""
      + "@media (max-width: 499px){\n"
      + "  .olyticsmodal{\n"
      + "    position: fixed !important;\n"
      + "    top: " + mobileTopOffset() + " !important;\n"
      + "    bottom: auto !important;\n"
      + "    left: 50% !important;\n"
      + "    right: auto !important;\n"
      + "    transform: translateX(-50%) !important;\n"
      + "    width: " + MODAL_WIDTH + " !important;\n"
      + "    max-width: " + MODAL_MAX_WIDTH + " !important;\n"
      + "    max-height: calc(100vh - 24px) !important;\n"
      + "    overflow: auto !important;\n"
      + "    margin: 0 !important;\n"
      + "  }\n"
      + "}\n";

    var style = document.createElement("style");
    style.id = "bnp-olytics-toplock-css";
    style.type = "text/css";
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }

  function enforceOlyticsTopLock() {
    if (window.innerWidth >= 500) return;

    var m = document.querySelector(".olyticsmodal");
    if (!m) return;

    // Always enforce on mobile (since you explicitly want TOP on <500px)
    m.style.position = "fixed";
    m.style.top = mobileTopOffset();
    m.style.bottom = "auto";
    m.style.left = "50%";
    m.style.right = "auto";
    m.style.transform = "translateX(-50%)";
    m.style.width = MODAL_WIDTH;
    m.style.maxWidth = MODAL_MAX_WIDTH;
    m.style.minWidth = MODAL_MIN_WIDTH;
    m.style.maxHeight = "calc(100vh - 24px)";
    m.style.overflow = "auto";
    m.style.margin = "0";
  }

  function installOlyticsTopLockHelper() {
    ensureOlyticsCss();
    enforceOlyticsTopLock();

    var scheduled = false;
    function schedule() {
      if (scheduled) return;
      scheduled = true;
      setTimeout(function () {
        scheduled = false;
        ensureOlyticsCss();
        enforceOlyticsTopLock();
      }, 0);
    }

    window.addEventListener("resize", schedule, { passive: true });

    // Watch for the modal to be inserted or restyled by third-party scripts
    try {
      var mo = new MutationObserver(schedule);
      mo.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["style", "class"]
      });
    } catch (e) {}
  }

  /* ============================
     IFRAME RESIZE HANDLERS
     ============================ */

  var lastApplied = new WeakMap();

  function applyChrome(iframe) {
    var inline = isInlineMarked(iframe);

    iframe.setAttribute("scrolling", "no");

    normalizeIframeWrappers(iframe);

    if (inline) {
      iframe.style.width = INLINE_WIDTH;
      iframe.style.maxWidth = INLINE_MAX_WIDTH;
      iframe.style.minWidth = INLINE_MIN_WIDTH;
      iframe.style.marginLeft = "0";
      iframe.style.marginRight = "0";
      if (!iframe.style.minHeight) iframe.style.minHeight = "260px";
      return;
    }

    iframe.style.width = MODAL_WIDTH;
    iframe.style.maxWidth = MODAL_MAX_WIDTH;
    iframe.style.minWidth = MODAL_MIN_WIDTH;
    iframe.style.marginLeft = "auto";
    iframe.style.marginRight = "auto";
    iframe.style.boxSizing = "border-box";
  }

  function applyHeight(iframe, h) {
    var px = h + PARENT_PAD_PX;

    var prev = lastApplied.get(iframe) || 0;
    if (prev && Math.abs(px - prev) < APPLY_THRESHOLD_PX) return;

    lastApplied.set(iframe, px);

    iframe.style.height = px + "px";
    iframe.style.minHeight = px + "px";

    if (window.innerWidth < 500) {
      iframe.style.maxHeight = "calc(100vh - 24px)";
    } else {
      iframe.style.maxHeight = "";
    }
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

    // Keep the modal top-locked on mobile after any resize message too
    enforceOlyticsTopLock();
  }, true);

  window.addEventListener("resize", function () {
    try {
      var iframes = document.querySelectorAll("iframe");
      for (var i = 0; i < iframes.length; i++) {
        var f = iframes[i];
        var src = f.getAttribute("src") || f.src || "";
        if (!isTargetIframeSrc(src)) continue;
        applyChrome(f);
      }
    } catch (e) {}

    enforceOlyticsTopLock();
  }, { passive: true });

  function boot() {
    installOlyticsTopLockHelper();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
