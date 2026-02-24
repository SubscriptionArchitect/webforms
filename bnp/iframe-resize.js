/* BNP IFRAME RESIZE — PARENT (SITE) — MODAL + INLINE (ALL BRANDS)
   - Desktop/tablet: centered, wider modal
   - Mobile (<=520px): pinned near top with small spacing
   - Performance-safe (throttled observer, CSS once, minimal DOM work)
*/
(function () {
  "use strict";

  if (window.__BNP_IFRAME_RESIZE_PARENT_INSTALLED__) return;
  window.__BNP_IFRAME_RESIZE_PARENT_INSTALLED__ = true;

  var MSG_TYPE = "DF_IFRAME_RESIZE";

  // ✅ Desktop modal width controls (increase these if you want even wider)
  var DESKTOP_MODAL_MAX_WIDTH = 680;              // px
  var DESKTOP_MODAL_WIDTH_CSS = "min(680px, 94vw)";

  // General constraints
  var IFRAME_MIN_WIDTH = 400;                     // px
  var INLINE_WIDTH_CSS = "100%";

  // Mobile placement spacing
  var MOBILE_TOP_GAP_PX = 14;

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
    return !!closest(iframe, ".olyticsPopupBR, .olyticsPopup, .olyticsmodal");
  }

  function injectCssOnce() {
    if (document.getElementById("bnp-iframe-resize-modal-css")) return;

    var css = [
      "/* BNP iframe-resize modal placement overrides */",
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
      "  align-items: center !important;",     /* centered desktop */
      "  justify-content: center !important;", /* centered desktop */
      "}",

      "/* Wider modal shell on desktop */",
      ".olyticsmodal {",
      "  display: block !important;",
      "  position: relative !important;",
      "  margin: 0 auto !important;",
      "  max-width: " + DESKTOP_MODAL_MAX_WIDTH + "px !important;",
      "  width: " + DESKTOP_MODAL_WIDTH_CSS + " !important;",
      "  background: transparent !important;",
      "  padding: 0 !important;",
      "  box-shadow: none !important;",
      "  border-radius: 0 !important;",
      "  box-sizing: border-box !important;",
      "}",
      ".olyticsmodal * { box-sizing: border-box !important; }",

      "/* Make iframe fill the modal width */",
      ".olyticsmodal iframe {",
      "  display: block !important;",
      "  width: 100% !important;",
      "  max-width: 100% !important;",
      "  min-width: " + IFRAME_MIN_WIDTH + "px !important;",
      "  border: 0 !important;",
      "}",

      "/* baseline/paragraph whitespace killer */",
      ".olyticsmodal p { margin: 0 !important; padding: 0 !important; line-height: 0 !important; }",
      "p > iframe { display:block !important; }",

      "",
      "/* MOBILE: PIN NEAR TOP WITH A LITTLE SPACE */",
      "@media (max-width: 520px){",
      "  .olyticsPopupBR, .olyticsPopup {",
      "    align-items: flex-start !important;",
      "    justify-content: center !important;",
      "    padding: " + MOBILE_TOP_GAP_PX + "px 12px 12px !important;",
      "  }",
      "  .olyticsmodal {",
      "    width: 100% !important;",
      "    max-width: 100% !important;",
      "    margin: 0 !important;",
      "  }",
      "  .olyticsmodal iframe {",
      "    min-width: 0 !important;",
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
      popup.style.setProperty("position", "fixed", "important");
      popup.style.setProperty("inset", "0", "important");
      popup.style.setProperty("width", "100vw", "important");
      popup.style.setProperty("height", "100vh", "important");
      popup.style.setProperty("display", "flex", "important");
      popup.style.setProperty("overflow", "auto", "important");
      popup.style.setProperty("-webkit-overflow-scrolling", "touch", "important");
      popup.style.setProperty("box-sizing", "border-box", "important");

      if (isMobile()) {
        popup.style.setProperty("align-items", "flex-start", "important");
        popup.style.setProperty("justify-content", "center", "important");
        popup.style.setProperty("padding", (MOBILE_TOP_GAP_PX + "px 12px 12px"), "important");
      } else {
        popup.style.setProperty("align-items", "center", "important");
        popup.style.setProperty("justify-content", "center", "important");
        popup.style.setProperty("padding", "16px", "important");
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
        modal.style.setProperty("width", DESKTOP_MODAL_WIDTH_CSS, "important");
        modal.style.setProperty("max-width", DESKTOP_MODAL_MAX_WIDTH + "px", "important");
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
      enforceOlyticsPlacement(iframe);
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

    if (modalMode) enforceOlyticsPlacement(iframe);
    normalizeIframeLayout(iframe, modalMode);
    applyHeight(iframe, h);
  }, true);

  injectCssOnce();
  installObserver();

  window.addEventListener("resize", scheduleFixup, { passive: true });
  window.addEventListener("orientationchange", function () { setTimeout(scheduleFixup, 50); }, { passive: true });

})();
