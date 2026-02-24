/* BNP IFRAME RESIZE — PARENT (SITE)
   - Removes <p> wrapper whitespace/baseline gap.
   - Keeps iframe width fitting tiny screens (<= 350px).
   - Prevents mobile bottom-docking by neutralizing flex-end alignment
     ONLY on the nearest flex overlay wrapper (no fixed/transform meddling).
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
      try {
        if (f.contentWindow === srcWin) return f;
      } catch (e) {}
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

  // Fixes the real “bottom docking” pattern: overlay/backdrop uses flex-end on mobile.
  // We only adjust the nearest flex container *above* the iframe (and only <500px wide).
  function fixMobileBottomDocking(iframe) {
    if (window.innerWidth >= 500) return;

    var el = iframe;
    for (var i = 0; i < 14 && el; i++) {
      if (el === document.body || el === document.documentElement) break;
      el = el.parentElement;
      if (!el) break;

      var cs;
      try { cs = window.getComputedStyle(el); } catch (e) { cs = null; }
      if (!cs) continue;

      // Target flex overlays that push content to bottom.
      if (cs.display === "flex") {
        var jc = (cs.justifyContent || "").toLowerCase();
        var ai = (cs.alignItems || "").toLowerCase();

        var isBottom =
          jc.indexOf("flex-end") !== -1 ||
          jc.indexOf("end") !== -1 ||
          ai.indexOf("flex-end") !== -1 ||
          ai.indexOf("end") !== -1;

        // Only intervene if it’s clearly bottom-aligning.
        if (isBottom) {
          el.style.justifyContent = "center";
          el.style.alignItems = "center";
          if (!el.style.padding) el.style.padding = "12px";
          break;
        }
      }
    }
  }

  var lastApplied = new WeakMap();

  function applyChrome(iframe) {
    var inline = isInlineMarked(iframe);
    var modalish = !inline && isOverlayLike(iframe);

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

    if (modalish) {
      fixMobileBottomDocking(iframe);
    }
  }

  function applyHeight(iframe, h) {
    var px = h + PARENT_PAD_PX;

    var prev = lastApplied.get(iframe) || 0;
    if (prev && Math.abs(px - prev) < APPLY_THRESHOLD_PX) return;

    lastApplied.set(iframe, px);

    iframe.style.height = px + "px";
    iframe.style.minHeight = px + "px";

    // Don’t let it exceed the viewport on small screens
    if (window.innerWidth < 500) {
      iframe.style.maxHeight = "calc(100vh - 24px)";
    } else {
      iframe.style.maxHeight = "";
    }
  }

  window.addEventListener(
    "message",
    function (e) {
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
    },
    true
  );

  // Re-apply chrome on resize/orientation changes (width fitting + bottom dock fix)
  window.addEventListener(
    "resize",
    function () {
      try {
        var iframes = document.querySelectorAll("iframe");
        for (var i = 0; i < iframes.length; i++) {
          var f = iframes[i];
          var src = f.getAttribute("src") || f.src || "";
          if (!isTargetIframeSrc(src)) continue;
          applyChrome(f);
        }
      } catch (e) {}
    },
    { passive: true }
  );
})();
