/* BNP IFRAME RESIZE — PARENT (SITE) — MODAL + INLINE (ALL BRANDS)
   Fixes:
   - Modal stretching full height / shoved left
   - Desktop: centered, normal modal width
   - Mobile: near top with small gap, centered horizontally
   Safe:
   - CSS injected once
   - Throttled MutationObserver
*/
(function () {
  "use strict";

  if (window.__BNP_IFRAME_RESIZE_PARENT_INSTALLED__) return;
  window.__BNP_IFRAME_RESIZE_PARENT_INSTALLED__ = true;

  var MSG_TYPE = "DF_IFRAME_RESIZE";

  // Desktop modal width (adjust if desired)
  var DESKTOP_MODAL_MAX_PX = 760;
  var DESKTOP_MODAL_WIDTH  = "min(760px, 96vw)";

  // Mobile top spacing
  var MOBILE_TOP_GAP_PX = 14;

  // Height tweak
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
      "/* BNP iframe-resize: Olytics modal layout guardrails */",

      /* Overlay wrapper: fixed, flex, centered on desktop */
      ".olyticsPopupBR, .olyticsPopup {",
      "  position: fixed !important;",
      "  inset: 0 !important;",
      "  width: 100vw !important;",
      "  height: 100vh !important;",
      "  display: flex !important;",
      "  flex-direction: column !important;",
      "  align-items: center !important;",
      "  justify-content: center !important;",
      "  padding: 16px !important;",
      "  box-sizing: border-box !important;",
      "  overflow: auto !important;",
      "  -webkit-overflow-scrolling: touch !important;",
      "}",

      /* Modal shell: prevent stretching + force centered width */
      ".olyticsmodal {",
      "  display: block !important;",
      "  align-self: center !important;",
      "  justify-self: center !important;",
      "  width: " + DESKTOP_MODAL_WIDTH + " !important;",
      "  max-width: " + DESKTOP_MODAL_MAX_PX + "px !important;",
      "  margin-left: auto !important;",
      "  margin-right: auto !important;",
      "  height: auto !important;",
      "  min-height: 0 !important;",
      "  background: transparent !important;",
      "  padding: 0 !important;",
      "  box-shadow: none !important;",
      "  border-radius: 0 !important;",
      "  box-sizing: border-box !important;",
      "}",

      /* If Olytics nests another wrapper inside .olyticsmodal, stop it from stretching */
      ".olyticsmodal > * {",
      "  max-width: 100% !important;",
      "}",

      /* Ensure iframe behaves like a block and fills the modal width (no 325px trap) */
      ".olyticsmodal iframe {",
      "  display: block !important;",
      "  width: 100% !important;",
      "  max-width: 100% !important;",
      "  border: 0 !important;",
      "}",

      /* Kill baseline whitespace from <p> wrappers */
      ".olyticsmodal p { margin: 0 !important; padding: 0 !important; line-height: 0 !important; }",
      "p > iframe { display:block !important; }",

      /* Mobile: near top with a little gap, still centered horizontally */
      "@media (max-width: 520px){",
      "  .olyticsPopupBR, .olyticsPopup {",
      "    justify-content: flex-start !important;",
      "    padding: " + MOBILE_TOP_GAP_PX + "px 12px 12px !important;",
      "  }",
      "  .olyticsmodal {",
      "    width: 100% !important;",
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

  function enforceOverlayBasics(iframe) {
    injectCssOnce();

    var popup = closest(iframe, ".olyticsPopupBR, .olyticsPopup");
    if (popup) {
      popup.style.setProperty("position", "fixed", "important");
      popup.style.setProperty("inset", "0", "important");
      popup.style.setProperty("display", "flex", "important");
      popup.style.setProperty("flex-direction", "column", "important");
      popup.style.setProperty("align-items", "center", "important");
      popup.style.setProperty("overflow", "auto", "important");
      popup.style.setProperty("-webkit-overflow-scrolling", "touch", "important");
      popup.style.setProperty("box-sizing", "border-box", "important");

      if (isMobile()) {
        popup.style.setProperty("justify-content", "flex-start", "important");
        popup.style.setProperty("padding", (MOBILE_TOP_GAP_PX + "px 12px 12px"), "important");
      } else {
        popup.style.setProperty("justify-content", "center", "important");
        popup.style.setProperty("padding", "16px", "important");
      }
    }

    var modal = closest(iframe, ".olyticsmodal");
    if (modal) {
      modal.style.setProperty("align-self", "center", "important");
      modal.style.setProperty("width", isMobile() ? "100%" : DESKTOP_MODAL_WIDTH, "important");
      modal.style.setProperty("max-width", isMobile() ? "100%" : (DESKTOP_MODAL_MAX_PX + "px"), "important");
      modal.style.setProperty("margin-left", "auto", "important");
      modal.style.setProperty("margin-right", "auto", "important");
      modal.style.setProperty("height", "auto", "important");
      modal.style.setProperty("min-height", "0", "important");
      modal.style.setProperty("background", "transparent", "important");
      modal.style.setProperty("padding", "0", "important");
      modal.style.setProperty("box-shadow", "none", "important");
      modal.style.setProperty("border-radius", "0", "important");
      modal.style.setProperty("box-sizing", "border-box", "important");
    }

    // Hard override any inline width=325 that keeps getting applied
    try {
      iframe.removeAttribute("width");
      iframe.style.setProperty("width", "100%", "important");
      iframe.style.setProperty("max-width", "100%", "important");
      iframe.style.setProperty("display", "block", "important");
    } catch (e) {}
  }

  function normalizeIframeLayout(iframe, modalMode) {
    iframe.style.display = "block";
    iframe.style.border = "0";
    iframe.style.overflow = "hidden";
    iframe.setAttribute("scrolling", "no");

    // Inline embeds: responsive
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
