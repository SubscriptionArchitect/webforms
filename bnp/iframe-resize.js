/* BNP IFRAME RESIZE — PARENT (SITE) — MODAL + INLINE (ALL BRANDS)
   Rollback:
   - Desktop/tablet: Olytics modal stays CENTERED and uses Olytics' natural width
   - Mobile (<=520px): modal moves toward TOP with a small gap (CSS-only)
   - Removes min-width enforcement that can cause ~320/325px skinny modals
   - Performance-safe: throttled observer, CSS injected once, minimal DOM work
*/
(function () {
  "use strict";

  if (window.__BNP_IFRAME_RESIZE_PARENT_INSTALLED__) return;
  window.__BNP_IFRAME_RESIZE_PARENT_INSTALLED__ = true;

  var MSG_TYPE = "DF_IFRAME_RESIZE";

  // Mobile spacing from top when pinned
  var MOBILE_TOP_GAP_PX = 14;

  // Height tweak (negative reduces bottom gap)
  var PARENT_PAD_PX = -6;
  var APPLY_THRESHOLD_PX = 2;

  var FIXUP_THROTTLE_MS = 140;
  var fixupTimer = 0;

  function looksLikeDF(src) {
    src = String(src || "");
    return /dragoniframe=true|omedasite=|loading\.do|init\.do|_subscribe_|_welcome|subscribe\.|account\./i.test(src);
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

  function closest(el, sel) {
    while (el && el.nodeType === 1) {
      try { if (el.matches(sel)) return el; } catch (e) {}
      el = el.parentElement;
    }
    return null;
  }

  function isInOlyticsModal(iframe) {
    return !!closest(iframe, ".olyticsPopupBR, .olyticsPopup, .olyticsmodal, [role='dialog']");
  }

  function injectCssOnce() {
    if (document.getElementById("bnp-iframe-resize-modal-css")) return;

    var css = [
      "/* BNP iframe-resize: keep Olytics modal behavior intact on desktop */",

      /* Ensure wrapper is a real overlay and can center on desktop (no width forcing) */
      ".olyticsPopupBR, .olyticsPopup {",
      "  position: fixed !important;",
      "  inset: 0 !important;",
      "  width: 100vw !important;",
      "  height: 100vh !important;",
      "  display: flex !important;",
      "  align-items: center !important;",     /* ✅ desktop centered */
      "  justify-content: center !important;", /* ✅ desktop centered */
      "  padding: 16px !important;",
      "  box-sizing: border-box !important;",
      "  overflow: auto !important;",
      "  -webkit-overflow-scrolling: touch !important;",
      "}",

      /* Kill baseline whitespace that creates the “10px gap” */
      ".olyticsmodal p { margin: 0 !important; padding: 0 !important; line-height: 0 !important; }",
      "p > iframe { display:block !important; }",

      /* Make iframe not inline-baseline, but DO NOT force width on desktop */
      ".olyticsmodal iframe { display:block !important; border:0 !important; }",

      /* ✅ Mobile: move modal toward top with a little gap (CSS-only) */
      "@media (max-width: 520px){",
      "  .olyticsPopupBR, .olyticsPopup {",
      "    align-items: flex-start !important;",
      "    justify-content: center !important;",
      "    padding: " + MOBILE_TOP_GAP_PX + "px 12px 12px !important;",
      "  }",
      "}"
    ].join("\n");

    var style = document.createElement("style");
    style.id = "bnp-iframe-resize-modal-css";
    style.type = "text/css";
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }

  function enforceOlyticsOverlayBasics(iframe) {
    injectCssOnce();

    // Only ensure overlay positioning; do NOT touch widths (that was causing skinny desktop)
    var popup = closest(iframe, ".olyticsPopupBR, .olyticsPopup");
    if (popup) {
      popup.style.setProperty("position", "fixed", "important");
      popup.style.setProperty("inset", "0", "important");
      popup.style.setProperty("width", "100vw", "important");
      popup.style.setProperty("height", "100vh", "important");
      popup.style.setProperty("display", "flex", "important");
      popup.style.setProperty("overflow", "auto", "important");
      popup.style.setProperty("-webkit-overflow-scrolling", "touch", "important");
      popup.style.setProperty("box-sizing", "border-box", "important");
      // Alignment handled by CSS + media query only
    }
  }

  function normalizeIframeLayout(iframe, modalMode) {
    // Always remove baseline behavior + borders
    iframe.style.display = "block";
    iframe.style.border = "0";
    iframe.style.overflow = "hidden";
    iframe.setAttribute("scrolling", "no");

    // Inline embeds should be responsive
    if (!modalMode) {
      iframe.style.width = "100%";
      iframe.style.maxWidth = "100%";
      iframe.style.minWidth = "0";
      iframe.style.marginLeft = "0";
      iframe.style.marginRight = "0";
    }

    // Kill <p> baseline gap if present
    try {
      var p = iframe.parentElement && iframe.parentElement.tagName === "P" ? iframe.parentElement : null;
      if (p) {
        p.style.margin = "0";
        p.style.padding = "0";
        p.style.lineHeight = "0";
      }
    } catch (e) {}
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

  function scheduleFixup() {
    if (fixupTimer) return;
    fixupTimer = window.setTimeout(function () {
      fixupTimer = 0;
      var iframe = document.querySelector(".olyticsPopupBR iframe, .olyticsPopup iframe, .olyticsmodal iframe");
      if (!iframe) return;
      if (!isInOlyticsModal(iframe)) return;
      enforceOlyticsOverlayBasics(iframe);
    }, FIXUP_THROTTLE_MS);
  }

  function installObserver() {
    injectCssOnce();
    try {
      var mo = new MutationObserver(function () { scheduleFixup(); });
      mo.observe(document.body || document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true
      });
    } catch (e) {}
  }

  window.addEventListener("message", function (e) {
    var d = e.data;
    if (!d || typeof d !== "object") return;
    if (d.type !== MSG_TYPE) return;

    var h = toInt(d.height);
    if (!h || h < 50) return;

    var iframe = findIframeForSource(e.source);
    if (!iframe) return;

    var src = iframe.getAttribute("src") || iframe.src || "";
    if (!looksLikeDF(src)) return;

    var modalMode = isInOlyticsModal(iframe);

    if (modalMode) enforceOlyticsOverlayBasics(iframe);
    normalizeIframeLayout(iframe, modalMode);
    applyHeight(iframe, h);
  }, true);

  injectCssOnce();
  installObserver();

  window.addEventListener("resize", scheduleFixup, { passive: true });
  window.addEventListener("orientationchange", function () { setTimeout(scheduleFixup, 50); }, { passive: true });

})();
