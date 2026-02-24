/* BNP IFRAME RESIZE — PARENT (SITE)
   - Fixes <p> wrapper whitespace around iframes in modals (and anywhere).
   - Keeps modal from “dropping” to the bottom on small mobile widths.
   - Ensures width fits even on ultra-small screens (<= 350px).
*/
(function () {
  "use strict";

  if (window.__bnpIframeResizeParentInstalled) return;
  window.__bnpIframeResizeParentInstalled = true;

  var MSG_TYPE = "DF_IFRAME_RESIZE";

  // Modal sizing
  // NOTE: allow shrinking below 320px so <=350px screens always fit without forcing layout shifts
  var IFRAME_WIDTH     = "min(460px, 92vw)";
  var IFRAME_MAX_WIDTH = "92vw";
  var IFRAME_MIN_WIDTH = "0";

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

  function closestElement(el, selector) {
    try {
      if (el && el.closest) return el.closest(selector);
    } catch (e) {}
    return null;
  }

  // ✅ Removes the 8–12px whitespace caused by <p> wrappers / baseline layout
  function normalizeIframeWrappers(iframe) {
    iframe.style.display = "block";
    iframe.style.verticalAlign = "top";
    iframe.style.margin = "0";
    iframe.style.padding = "0";
    iframe.style.border = "0";
    iframe.style.maxWidth = iframe.style.maxWidth || "100%";

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

  // ✅ Prevent the “modal goes to bottom of page” behavior on mobile:
  // If the iframe is inside a fixed overlay/modal, make the modal center itself (not bottom-align),
  // and keep it within viewport with safe padding.
  function normalizeOverlayContainer(iframe) {
    // Only do this on narrow viewports where you reported the problem
    if (window.innerWidth >= 500) return;

    // Find the nearest fixed-position ancestor (likely the modal/dialog wrapper)
    var fixedAncestor = null;
    try {
      var el = iframe.parentElement;
      for (var i = 0; i < 10 && el; i++) {
        if (el === document.body || el === document.documentElement) break;
        var cs = window.getComputedStyle(el);
        if (cs && cs.position === "fixed") { fixedAncestor = el; break; }
        el = el.parentElement;
      }
    } catch (e) {}

    // If we don’t find a fixed container, don’t guess.
    if (!fixedAncestor) return;

    // If the fixed ancestor is already handling centering via transforms, leave it alone.
    var csA = window.getComputedStyle(fixedAncestor);
    var hasTransform = csA && csA.transform && csA.transform !== "none";

    // Force “center-ish” placement and keep within viewport. This avoids bottom docking.
    fixedAncestor.style.left = fixedAncestor.style.left || "50%";
    fixedAncestor.style.top = fixedAncestor.style.top || "50%";

    if (!hasTransform) {
      fixedAncestor.style.transform = "translate(-50%, -50%)";
    }

    fixedAncestor.style.right = "auto";
    fixedAncestor.style.bottom = "auto";
    fixedAncestor.style.margin = "0";
    fixedAncestor.style.maxWidth = "calc(100vw - 24px)";
    fixedAncestor.style.maxHeight = "calc(100vh - 24px)";
    fixedAncestor.style.overflow = fixedAncestor.style.overflow || "visible";

    // If the modal is using flex to bottom-align, normalize alignment.
    // This targets the common pattern: overlay/backdrop is flex with align-items/end.
    var flexWrapper = null;
    try {
      var el2 = fixedAncestor.parentElement;
      for (var j = 0; j < 4 && el2; j++) {
        var cs2 = window.getComputedStyle(el2);
        if (cs2 && cs2.display === "flex") { flexWrapper = el2; break; }
        if (el2 === document.body || el2 === document.documentElement) break;
        el2 = el2.parentElement;
      }
    } catch (e) {}

    if (flexWrapper) {
      flexWrapper.style.alignItems = "center";
      flexWrapper.style.justifyContent = "center";
      flexWrapper.style.padding = flexWrapper.style.padding || "12px";
    }
  }

  var lastApplied = new WeakMap();

  function applyChrome(iframe) {
    var inline = isInlineMarked(iframe);
    var modalish = !inline && isOverlayLike(iframe);

    iframe.setAttribute("scrolling", "no");

    // Always normalize wrappers to prevent whitespace
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

    // Modal/default sizing
    iframe.style.width = IFRAME_WIDTH;
    iframe.style.maxWidth = IFRAME_MAX_WIDTH;
    iframe.style.minWidth = IFRAME_MIN_WIDTH;
    iframe.style.marginLeft = "auto";
    iframe.style.marginRight = "auto";

    // Ultra-small screens: allow even more breathing room
    if (window.innerWidth <= 350) {
      iframe.style.width = "calc(100vw - 24px)";
      iframe.style.maxWidth = "calc(100vw - 24px)";
      iframe.style.minWidth = "0";
    }

    // Prevent bottom docking on small mobile widths
    if (modalish) {
      normalizeOverlayContainer(iframe);
    }
  }

  function applyHeight(iframe, h) {
    var px = h + PARENT_PAD_PX;

    var prev = lastApplied.get(iframe) || 0;
    if (prev && Math.abs(px - prev) < APPLY_THRESHOLD_PX) return;

    lastApplied.set(iframe, px);

    iframe.style.height = px + "px";
    iframe.style.minHeight = px + "px";

    // If the modal has a max-height constraint, keep iframe from overflowing viewport
    if (window.innerWidth < 500) {
      iframe.style.maxHeight = "calc(100vh - 24px)";
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
  }, true);

  // Also re-apply sizing behavior on rotate / resize (helps the <=350px requirement)
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
  }, { passive: true });

})();
