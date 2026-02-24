/* BNP IFRAME RESIZE — PARENT (SITE) — MODAL + INLINE (ALL BRANDS)
   Fixes: modal “drops to bottom” on mobile (Olytics + similar overlays)
   - Injects strong CSS to force Olytics overlay to fixed + flex-centered on small screens
   - Keeps iframe resize messaging intact
   - Removes <p> baseline whitespace (10px gap) around iframes
*/
(function () {
  "use strict";

  var MSG_TYPE = "DF_IFRAME_RESIZE";

  // Sizing
  var IFRAME_MIN_WIDTH = 320;              // px
  var MODAL_MAX_WIDTH  = 520;              // px
  var MODAL_WIDTH_CSS  = "min(520px, 92vw)";
  var INLINE_WIDTH_CSS = "100%";

  // Height tweak (negative reduces bottom gap)
  var PARENT_PAD_PX = -6;
  var APPLY_THRESHOLD_PX = 2;

  // Keep “all brands”: do NOT hard-block origins.
  // Safety is provided by finding the real iframe (contentWindow match) + src heuristics.
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

  function isInModal(iframe) {
    return !!closest(
      iframe,
      ".olyticsPopupBR, .olyticsPopup, .olyticsmodal, [role='dialog'], .modal, .overlay, .popup"
    );
  }

  // --- Strong CSS injection (wins over many mobile breakpoints) ---
  function injectCssOnce() {
    if (document.getElementById("bnp-iframe-resize-modal-css")) return;

    var css = [
      "/* BNP iframe-resize modal centering overrides */",
      ".olyticsPopupBR, .olyticsPopup {",
      "  position: fixed !important;",
      "  inset: 0 !important;",
      "  width: 100vw !important;",
      "  height: 100vh !important;",
      "  display: flex !important;",
      "  align-items: center !important;",
      "  justify-content: center !important;",
      "  padding: 16px !important;",
      "  box-sizing: border-box !important;",
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
      /* Baseline/paragraph whitespace killer */
      ".olyticsmodal p { margin: 0 !important; padding: 0 !important; line-height: 0 !important; }",
      "p > iframe { display:block !important; }",
      "",
      "@media (max-width: 520px){",
      "  .olyticsPopupBR, .olyticsPopup { padding: 14px !important; }",
      "  .olyticsmodal { width: 92vw !important; }",
      "  .olyticsmodal iframe { min-width: 0 !important; }",
      "}"
    ].join("\n");

    var style = document.createElement("style");
    style.id = "bnp-iframe-resize-modal-css";
    style.type = "text/css";
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }

  // If Olytics toggles display later, re-apply “center” styles on the active wrapper.
  function enforceOlyticsCentering(iframe) {
    injectCssOnce();

    var popup = closest(iframe, ".olyticsPopupBR, .olyticsPopup");
    if (popup) {
      popup.style.setProperty("position", "fixed", "important");
      popup.style.setProperty("inset", "0", "important");
      popup.style.setProperty("width", "100vw", "important");
      popup.style.setProperty("height", "100vh", "important");
      popup.style.setProperty("display", "flex", "important");
      popup.style.setProperty("align-items", "center", "important");
      popup.style.setProperty("justify-content", "center", "important");
      popup.style.setProperty("padding", "16px", "important");
      popup.style.setProperty("box-sizing", "border-box", "important");
    }

    var modal = closest(iframe, ".olyticsmodal") || closest(iframe, "[role='dialog']") || null;
    if (modal) {
      modal.style.setProperty("background", "transparent", "important");
      modal.style.setProperty("padding", "0", "important");
      modal.style.setProperty("box-shadow", "none", "important");
      modal.style.setProperty("border-radius", "0", "important");
      modal.style.setProperty("max-width", MODAL_MAX_WIDTH + "px", "important");
      modal.style.setProperty("width", MODAL_WIDTH_CSS, "important");
      modal.style.setProperty("margin", "0 auto", "important");
      modal.style.setProperty("box-sizing", "border-box", "important");
    }
  }

  function normalizeIframeLayout(iframe, modalMode) {
    iframe.style.display = "block";
    iframe.style.border = "0";
    iframe.style.overflow = "hidden";
    iframe.setAttribute("scrolling", "no");

    if (modalMode) {
      iframe.style.width = "100%";
      iframe.style.maxWidth = MODAL_WIDTH_CSS;
      iframe.style.minWidth = IFRAME_MIN_WIDTH + "px";
      iframe.style.marginLeft = "auto";
      iframe.style.marginRight = "auto";
    } else {
      iframe.style.width = INLINE_WIDTH_CSS;
      iframe.style.maxWidth = "100%";
      iframe.style.minWidth = "0";
      iframe.style.marginLeft = "0";
      iframe.style.marginRight = "0";
    }

    // Kill <p> baseline whitespace if present
    try {
      var p = iframe.parentElement && iframe.parentElement.tagName === "P" ? iframe.parentElement : null;
      if (p) {
        p.style.margin = "0";
        p.style.padding = "0";
        p.style.lineHeight = "0";
      }
    } catch (e) {}
  }

  var lastApplied = new WeakMap(); // iframe -> px

  function applyHeight(iframe, h) {
    var px = h + PARENT_PAD_PX;
    var prev = lastApplied.get(iframe) || 0;
    if (prev && Math.abs(px - prev) < APPLY_THRESHOLD_PX) return;

    lastApplied.set(iframe, px);
    iframe.style.height = px + "px";
    iframe.style.minHeight = px + "px";
  }

  // Observe DOM because Olytics often re-wraps or changes display after load on mobile
  function installModalObserver() {
    injectCssOnce();
    try {
      var mo = new MutationObserver(function () {
        // If a modal is visible, keep it centered
        var modal = document.querySelector(".olyticsPopupBR .olyticsmodal, .olyticsPopup .olyticsmodal, .olyticsmodal");
        if (!modal) return;

        var iframe = modal.querySelector("iframe");
        if (!iframe) return;

        if (isInModal(iframe)) enforceOlyticsCentering(iframe);
      });

      mo.observe(document.documentElement, { subtree: true, childList: true, attributes: true });
    } catch (e) {}
  }

  // Message listener
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

    var modalMode = isInModal(iframe);

    if (modalMode) enforceOlyticsCentering(iframe);
    normalizeIframeLayout(iframe, modalMode);
    applyHeight(iframe, h);
  }, true);

  // Boot
  injectCssOnce();
  installModalObserver();

})();
