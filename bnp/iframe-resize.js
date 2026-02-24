/* BNP IFRAME RESIZE — PARENT (SITE) — MODAL + INLINE (ALL BRANDS)
   Fix: prevents “modal iframe drops to bottom on mobile”
   - Detects modal containers (olytics + common overlays) and forces proper centering
   - Applies iframe sizing without breaking inline embeds
   - Removes the 10px <p> whitespace issue by forcing iframe display:block and zeroing line-height on immediate parent <p>
*/
(function () {
  "use strict";

  var MSG_TYPE = "DF_IFRAME_RESIZE";

  // Keep these modest—brands can override via CSS if needed
  var IFRAME_MIN_WIDTH = "320px";
  var IFRAME_MAX_WIDTH = "92vw";

  // Inline embeds can be wider than modal content
  var INLINE_WIDTH = "100%";
  var MODAL_WIDTH  = "min(460px, 92vw)";

  // Height tweak (negative reduces bottom whitespace)
  var PARENT_PAD_PX = -6;
  var APPLY_THRESHOLD_PX = 2;

  // Origins you expect (add more brand domains if needed)
  // If you want truly "all brands" without maintenance, set USE_ORIGIN_ALLOWLIST=false.
  var USE_ORIGIN_ALLOWLIST = false;
  var ALLOWED_ORIGINS = {
    "https://bnp.dragonforms.com": true,
    "https://subscribe.enr.com": true,
    "https://subscribe.achrnews.com": true,
    "https://subscribe.architecturalrecord.com": true,
    "https://subscribe.stoneworld.com": true,
    "https://account.enr.com": true,
    "https://account.achrnews.com": true
  };

  function toInt(v) { var n = parseInt(v, 10); return isFinite(n) ? n : null; }

  function findIframeForSource(srcWin) {
    var frames = document.querySelectorAll("iframe");
    for (var i = 0; i < frames.length; i++) {
      var f = frames[i];
      try { if (f.contentWindow === srcWin) return f; } catch (e) {}
    }
    return null;
  }

  function looksLikeDF(src) {
    src = String(src || "");
    return /dragoniframe=true|omedasite=|loading\.do|init\.do|_subscribe_|_welcome/i.test(src);
  }

  function closest(el, sel) {
    while (el && el.nodeType === 1) {
      if (el.matches(sel)) return el;
      el = el.parentElement;
    }
    return null;
  }

  function isInModal(iframe) {
    // Olytics + common overlay patterns
    return !!closest(iframe, ".olyticsmodal, .olyticsPopupBR, .olyticsPopup, .modal, .popup, .overlay, [role='dialog']");
  }

  function modalShell(iframe) {
    // Prefer the visible “dialog box” element if present
    return closest(iframe, ".olyticsmodal") ||
           closest(iframe, "[role='dialog']") ||
           closest(iframe, ".modal") ||
           closest(iframe, ".popup") ||
           closest(iframe, ".overlay") ||
           closest(iframe, ".olyticsPopupBR") ||
           null;
  }

  function normalizeIframeLayout(iframe, modalMode) {
    // Fix baseline whitespace and <p> gaps
    iframe.style.display = "block";
    iframe.style.border = "0";
    iframe.style.overflow = "hidden";
    iframe.setAttribute("scrolling", "no");
    iframe.style.maxWidth = IFRAME_MAX_WIDTH;
    iframe.style.minWidth = IFRAME_MIN_WIDTH;

    // Kill the classic 10px-ish inline gap from line-height / baseline in wrappers
    try {
      var p = iframe.parentElement && iframe.parentElement.tagName === "P" ? iframe.parentElement : null;
      if (p) {
        p.style.margin = "0";
        p.style.padding = "0";
        p.style.lineHeight = "0";
      }
    } catch (e) {}

    if (modalMode) {
      iframe.style.width = MODAL_WIDTH;
      iframe.style.marginLeft = "auto";
      iframe.style.marginRight = "auto";
    } else {
      iframe.style.width = INLINE_WIDTH;
      iframe.style.marginLeft = "0";
      iframe.style.marginRight = "0";
    }
  }

  // Ensures the modal container stays centered on mobile (prevents "drops to bottom")
  function enforceModalCentering(iframe) {
    var shell = modalShell(iframe);
    if (!shell) return;

    // Many modal libs use vertical-align:middle + display: inline-block and a parent table-cell
    // On mobile that can break and push content down. We force modern centering.
    // We ONLY touch the immediate overlay-ish parent if it exists.
    var overlay = closest(shell, ".olyticsPopupBR, .olyticsPopup, .overlay, .modal, [role='dialog']") || shell.parentElement;

    try {
      shell.style.position = "relative";
      shell.style.margin = "0";
      shell.style.maxWidth = "min(520px, 92vw)";
      shell.style.width = "100%";
      shell.style.background = "transparent";
      shell.style.boxShadow = "none";
      shell.style.padding = "0";
    } catch (e) {}

    // If we found a likely overlay wrapper, make it a flex center box
    if (overlay && overlay !== document.body && overlay !== document.documentElement) {
      try {
        overlay.style.display = "flex";
        overlay.style.alignItems = "center";
        overlay.style.justifyContent = "center";
        overlay.style.flexDirection = "column";
        overlay.style.padding = "16px";
        overlay.style.boxSizing = "border-box";
        overlay.style.width = "100%";
        overlay.style.minHeight = "100vh";
      } catch (e2) {}
    }
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

  window.addEventListener("message", function (e) {
    if (USE_ORIGIN_ALLOWLIST) {
      if (!ALLOWED_ORIGINS[e.origin]) return;
    }

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

    // ✅ Keep modal centered on mobile
    if (modalMode) enforceModalCentering(iframe);

    // ✅ Apply layout defaults (also fixes <p> whitespace)
    normalizeIframeLayout(iframe, modalMode);

    // ✅ Apply height (with your small negative pad)
    applyHeight(iframe, h);
  }, true);

})();
