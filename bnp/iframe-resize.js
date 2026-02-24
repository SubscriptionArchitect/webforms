/* BNP IFRAME RESIZE — PARENT (SITE) — MODAL + INLINE (ALL BRANDS)
   Performance-safe:
   - NO MutationObserver
   - Only reacts to postMessage resize + window resize/orientationchange
   Behavior:
   - Desktop: centered modal, WIDE container
   - Mobile: near top with a small gap, centered horizontally
*/
(function () {
  "use strict";

  if (window.__BNP_IFRAME_RESIZE_PARENT_INSTALLED__) return;
  window.__BNP_IFRAME_RESIZE_PARENT_INSTALLED__ = true;

  var MSG_TYPE = "DF_IFRAME_RESIZE";

  // ✅ Wider desktop modal container
  var DESKTOP_MODAL_MAX_PX = 980;
  var DESKTOP_MODAL_WIDTH  = "min(980px, 96vw)";

  // Mobile top spacing
  var MOBILE_TOP_GAP_PX = 14;

  // Height tweak (negative reduces bottom gap)
  var PARENT_PAD_PX = -6;
  var APPLY_THRESHOLD_PX = 2;

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
      "/* BNP iframe-resize: Olytics modal guardrails (no observers) */",

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

      ".olyticsmodal {",
      "  display: block !important;",
      "  align-self: center !important;",
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

      ".olyticsmodal iframe {",
      "  display: block !important;",
      "  width: 100% !important;",
      "  max-width: 100% !important;",
      "  min-width: 0 !important;",
      "  border: 0 !important;",
      "}",

      ".olyticsmodal p { margin: 0 !important; padding: 0 !important; line-height: 0 !important; }",
      "p > iframe { display:block !important; }",

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

  function enforceModalBasics(iframe) {
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

    try {
      iframe.removeAttribute("width");
      iframe.style.setProperty("width", "100%", "important");
      iframe.style.setProperty("max-width", "100%", "important");
      iframe.style.setProperty("min-width", "0", "important");
      iframe.style.setProperty("display", "block", "important");
      iframe.style.setProperty("border", "0", "important");
    } catch (e) {}
  }

  function normalizeIframeLayout(iframe, modalMode) {
    iframe.style.display = "block";
    iframe.style.border = "0";
    iframe.style.overflow = "hidden";
    iframe.setAttribute("scrolling", "no");

    if (!modalMode) {
      iframe.style.width = "100%";
      iframe.style.maxWidth = "100%";
      iframe.style.minWidth = "0";
      iframe.style.marginLeft = "0";
      iframe.style.marginRight = "0";
    }

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
  var lastModalIframe = null;

  function applyHeight(iframe, h) {
    var px = h + PARENT_PAD_PX;
    var prev = lastApplied.get(iframe) || 0;
    if (prev && Math.abs(px - prev) < APPLY_THRESHOLD_PX) return;

    lastApplied.set(iframe, px);
    iframe.style.height = px + "px";
    iframe.style.minHeight = px + "px";
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

    injectCssOnce();

    if (modalMode) {
      lastModalIframe = iframe;
      enforceModalBasics(iframe);
    }

    normalizeIframeLayout(iframe, modalMode);
    applyHeight(iframe, h);
  }, true);

  function reapplyLastModal() {
    if (!lastModalIframe) return;
    try {
      if (document.contains(lastModalIframe) && isInOlyticsModal(lastModalIframe)) {
        enforceModalBasics(lastModalIframe);
      }
    } catch (e) {}
  }

  window.addEventListener("resize", function () { reapplyLastModal(); }, { passive: true });
  window.addEventListener("orientationchange", function () { setTimeout(reapplyLastModal, 50); }, { passive: true });

  injectCssOnce();

})();
