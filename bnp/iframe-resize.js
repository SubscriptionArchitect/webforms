/* BNP IFRAME RESIZE — PARENT (SITE) — MODAL + INLINE (ALL BRANDS)
   Performance-safe version (won't freeze the site):
   - One passive message listener
   - One MutationObserver (throttled) only to keep Olytics modal pinned to top on mobile
   - CSS injected once
   - No scanning loops; only touches DOM when a resize message arrives or modal wrapper mutates
*/
(function () {
  "use strict";

  // Prevent double-install
  if (window.__BNP_IFRAME_RESIZE_PARENT_INSTALLED__) return;
  window.__BNP_IFRAME_RESIZE_PARENT_INSTALLED__ = true;

  var MSG_TYPE = "DF_IFRAME_RESIZE";

  var IFRAME_MIN_WIDTH = 320;       // px
  var MODAL_MAX_WIDTH  = 520;       // px
  var MODAL_WIDTH_CSS  = "min(520px, 92vw)";
  var INLINE_WIDTH_CSS = "100%";

  // Height tweak (negative reduces bottom gap)
  var PARENT_PAD_PX = -6;
  var APPLY_THRESHOLD_PX = 2;

  // Throttle any “fixup” work triggered by mutations
  var FIXUP_THROTTLE_MS = 120;
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
    // Fast path: most pages have 1–2 iframes; NodeList scan is cheap and only on message
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
    return !!closest(iframe, ".olyticsPopupBR, .olyticsPopup, .olyticsmodal");
  }

  function injectCssOnce() {
    if (document.getElementById("bnp-iframe-resize-modal-css")) return;

    var css = [
      "/* BNP iframe-resize modal placement overrides (safe) */",
      ".olyticsPopupBR, .olyticsPopup {",
      "  position: fixed !important;",
      "  inset: 0 !important;",
      "  width: 100vw !important;",
      "  height: 100vh !important;",
      "  display: flex !important;",
      "  padding: 16px !important;",
      "  box-sizing: border-box !important;",
      "  overflow: auto !important;",
      "  -webkit-overflow-scrolling: touch !important;",
      "  align-items: center !important;",
      "  justify-content: center !important;",
      "}",
      ".olyticsmodal {",
      "  display: block !important;",
      "  position: relative !important;",
      "  margin: 0 auto !important;",
      "  max-width: " + MODAL_MAX_WIDTH + "px !important;",
      "  width: " + MODAL_WIDTH_CSS + " !important;",
      "  background: transparent !important;",
      "  padding: 0 !important;",
      "  box-shadow: none !important;",
      "  border-radius: 0 !important;",
      "  box-sizing: border-box !important;",
      "}",
      ".olyticsmodal * { box-sizing: border-box !important; }",
      ".olyticsmodal iframe {",
      "  display: block !important;",
      "  width: 100% !important;",
      "  max-width: " + MODAL_WIDTH_CSS + " !important;",
      "  min-width: " + IFRAME_MIN_WIDTH + "px !important;",
      "  border: 0 !important;",
      "}",
      ".olyticsmodal p { margin: 0 !important; padding: 0 !important; line-height: 0 !important; }",
      "p > iframe { display:block !important; }",
      "",
      "/* ✅ MOBILE: PIN MODAL TO TOP */",
      "@media (max-width: 520px){",
      "  .olyticsPopupBR, .olyticsPopup {",
      "    align-items: flex-start !important;",
      "    justify-content: flex-start !important;",
      "    padding: 12px !important;",
      "  }",
      "  .olyticsmodal {",
      "    width: 100% !important;",
      "    max-width: 100% !important;",
      "    margin: 0 !important;",
      "  }",
      "  .olyticsmodal iframe {",
      "    min-width: 0 !important;",
      "    max-width: 100% !important;",
      "  }",
      "}"
    ].join("\n");

    var style = document.createElement("style");
    style.id = "bnp-iframe-resize-modal-css";
    style.type = "text/css";
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }

  function enforceOlyticsPlacement(iframe) {
    injectCssOnce();

    var popup = closest(iframe, ".olyticsPopupBR, .olyticsPopup");
    if (popup) {
      // Only set a few critical properties; let CSS handle the rest
      popup.style.setProperty("position", "fixed", "important");
      popup.style.setProperty("inset", "0", "important");
      popup.style.setProperty("overflow", "auto", "important");
      popup.style.setProperty("-webkit-overflow-scrolling", "touch", "important");

      if (isMobile()) {
        popup.style.setProperty("align-items", "flex-start", "important");
        popup.style.setProperty("justify-content", "flex-start", "important");
      } else {
        popup.style.setProperty("align-items", "center", "important");
        popup.style.setProperty("justify-content", "center", "important");
      }
    }

    var modal = closest(iframe, ".olyticsmodal");
    if (modal) {
      modal.style.setProperty("background", "transparent", "important");
      modal.style.setProperty("padding", "0", "important");
      modal.style.setProperty("box-shadow", "none", "important");
      modal.style.setProperty("border-radius", "0", "important");
      modal.style.setProperty("box-sizing", "border-box", "important");

      if (isMobile()) {
        modal.style.setProperty("width", "100%", "important");
        modal.style.setProperty("max-width", "100%", "important");
        modal.style.setProperty("margin", "0", "important");
      } else {
        modal.style.setProperty("width", MODAL_WIDTH_CSS, "important");
        modal.style.setProperty("max-width", MODAL_MAX_WIDTH + "px", "important");
        modal.style.setProperty("margin", "0 auto", "important");
      }
    }
  }

  function normalizeIframeLayout(iframe, modalMode) {
    iframe.style.display = "block";
    iframe.style.border = "0";
    iframe.style.overflow = "hidden";
    iframe.setAttribute("scrolling", "no");

    if (modalMode) {
      iframe.style.width = "100%";
      iframe.style.maxWidth = "100%";
      iframe.style.minWidth = isMobile() ? "0" : (IFRAME_MIN_WIDTH + "px");
      iframe.style.marginLeft = "0";
      iframe.style.marginRight = "0";
    } else {
      iframe.style.width = INLINE_WIDTH_CSS;
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

  // Throttled modal “keep at top” fixup (only if Olytics exists)
  function scheduleFixup() {
    if (fixupTimer) return;
    fixupTimer = window.setTimeout(function () {
      fixupTimer = 0;

      var iframe = document.querySelector(".olyticsPopupBR iframe, .olyticsPopup iframe, .olyticsmodal iframe");
      if (!iframe) return;
      if (!isInOlyticsModal(iframe)) return;

      enforceOlyticsPlacement(iframe);
    }, FIXUP_THROTTLE_MS);
  }

  function installObserver() {
    injectCssOnce();

    // Only observe if Olytics is present or likely to appear
    try {
      var mo = new MutationObserver(function () {
        scheduleFixup();
      });

      // Observe minimal surface area: body subtree is enough for modals
      mo.observe(document.body || document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true
      });
    } catch (e) {}
  }

  // Resize messages from the child iframe
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

    if (modalMode) enforceOlyticsPlacement(iframe);
    normalizeIframeLayout(iframe, modalMode);
    applyHeight(iframe, h);
  }, true);

  // Boot
  injectCssOnce();
  installObserver();

  // Re-apply on resize/orientation changes (cheap + necessary on iOS)
  window.addEventListener("resize", scheduleFixup, { passive: true });
  window.addEventListener("orientationchange", function () { setTimeout(scheduleFixup, 50); }, { passive: true });

})();
