/* BNP IFRAME RESIZE — PARENT (SITE) — MODAL + INLINE (ALL BRANDS)
   Fixes:
   - Olytics forcing ~325px width on desktop (inline styles/attrs) -> override ONLY when modal is skinny
   - Desktop: centered + wide modal
   - Mobile (<=520px): pinned near top with a little gap
   Safe:
   - CSS injected once
   - One throttled MutationObserver
   - DOM work only on resize messages + throttled fixups
*/
(function () {
  "use strict";

  if (window.__BNP_IFRAME_RESIZE_PARENT_INSTALLED__) return;
  window.__BNP_IFRAME_RESIZE_PARENT_INSTALLED__ = true;

  var MSG_TYPE = "DF_IFRAME_RESIZE";

  // Mobile spacing from top
  var MOBILE_TOP_GAP_PX = 14;

  // Desktop widening (only applied if Olytics modal is "skinny")
  var DESKTOP_MIN_ACCEPTABLE_PX = 520;
  var DESKTOP_MODAL_WIDTH_CSS   = "min(760px, 96vw)";
  var DESKTOP_MODAL_MAX_PX      = 760;

  // Height tweak (negative reduces bottom gap)
  var PARENT_PAD_PX = -6;
  var APPLY_THRESHOLD_PX = 2;

  var FIXUP_THROTTLE_MS = 140;
  var fixupTimer = 0;

  function isMobile() {
    try { return window.matchMedia && window.matchMedia("(max-width: 520px)").matches; }
    catch (e) { return window.innerWidth <= 520; }
  }

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
      "/* BNP iframe-resize modal placement */",
      ".olyticsPopupBR, .olyticsPopup {",
      "  position: fixed !important;",
      "  inset: 0 !important;",
      "  width: 100vw !important;",
      "  height: 100vh !important;",
      "  display: flex !important;",
      "  align-items: center !important;",     /* desktop centered */
      "  justify-content: center !important;", /* desktop centered */
      "  padding: 16px !important;",
      "  box-sizing: border-box !important;",
      "  overflow: auto !important;",
      "  -webkit-overflow-scrolling: touch !important;",
      "}",

      "/* Baseline whitespace killer */",
      ".olyticsmodal p { margin: 0 !important; padding: 0 !important; line-height: 0 !important; }",
      "p > iframe { display:block !important; }",

      "/* Always: iframe behaves like a block inside modal */",
      ".olyticsmodal iframe { display:block !important; border:0 !important; }",

      "/* Mobile: pin near top with a bit of space */",
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

  function getRectW(el) {
    try { return Math.floor(el.getBoundingClientRect().width || 0); } catch (e) { return 0; }
  }

  function widenIfSkinnyDesktop(iframe) {
    if (isMobile()) return;

    var modal = closest(iframe, ".olyticsmodal") || closest(iframe, "[role='dialog']") || null;
    if (!modal) return;

    var w = getRectW(modal);
    if (!w) return;

    // Only intervene if it's clearly "skinny" (your 325px problem)
    if (w >= DESKTOP_MIN_ACCEPTABLE_PX) return;

    // Remove attribute widths that can hard-lock to 325
    try {
      iframe.removeAttribute("width");
      modal.removeAttribute("width");
    } catch (e) {}

    // Nuke inline width that Olytics might set
    try {
      iframe.style.removeProperty("width");
      iframe.style.removeProperty("max-width");
      modal.style.removeProperty("width");
      modal.style.removeProperty("max-width");
    } catch (e2) {}

    // Force modal shell wide
    try {
      modal.style.setProperty("width", DESKTOP_MODAL_WIDTH_CSS, "important");
      modal.style.setProperty("max-width", DESKTOP_MODAL_MAX_PX + "px", "important");
      modal.style.setProperty("margin", "0 auto", "important");
      modal.style.setProperty("background", "transparent", "important");
      modal.style.setProperty("box-shadow", "none", "important");
      modal.style.setProperty("padding", "0", "important");
      modal.style.setProperty("border-radius", "0", "important");
      modal.style.setProperty("box-sizing", "border-box", "important");
    } catch (e3) {}

    // Force iframe to fill modal
    try {
      iframe.style.setProperty("display", "block", "important");
      iframe.style.setProperty("width", "100%", "important");
      iframe.style.setProperty("max-width", "100%", "important");
      iframe.style.setProperty("min-width", "0", "important");
      iframe.style.setProperty("border", "0", "important");
    } catch (e4) {}
  }

  function enforceOverlayBasics(iframe) {
    injectCssOnce();

    var popup = closest(iframe, ".olyticsPopupBR, .olyticsPopup");
    if (popup) {
      popup.style.setProperty("position", "fixed", "important");
      popup.style.setProperty("inset", "0", "important");
      popup.style.setProperty("display", "flex", "important");
      popup.style.setProperty("overflow", "auto", "important");
      popup.style.setProperty("-webkit-overflow-scrolling", "touch", "important");
      popup.style.setProperty("box-sizing", "border-box", "important");
      // Alignment is handled by CSS + media query
    }

    // Fix your skinny desktop issue if present
    widenIfSkinnyDesktop(iframe);
  }

  function normalizeIframeLayout(iframe, modalMode) {
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

    // Kill <p> baseline gap
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
      enforceOverlayBasics(iframe);
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

    if (modalMode) enforceOverlayBasics(iframe);
    normalizeIframeLayout(iframe, modalMode);
    applyHeight(iframe, h);
  }, true);

  injectCssOnce();
  installObserver();

  window.addEventListener("resize", scheduleFixup, { passive: true });
  window.addEventListener("orientationchange", function () { setTimeout(scheduleFixup, 50); }, { passive: true });

})();
