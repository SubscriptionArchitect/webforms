(function () {
  "use strict";

  // --- diagnostics (safe to leave on; minimal noise) ---
  window.__iframeResizeLoaded = true;
  window.__iframeResizeVersion = "2026-02-17a";

  function log() {
    try { console.log.apply(console, ["[iframe-resize]"].concat([].slice.call(arguments))); }
    catch (e) {}
  }

  // Toggle to see logs
  var DEBUG = false;

  // Allowlist iframe origins (add your hosts)
  var ALLOWED = {
    "https://bnp.dragonforms.com": true,
    "https://account.enr.com": true,
    "https://subscribe.enr.com": true
  };

  // Only resize iframes whose src contains one of these markers (prevents resizing ads)
  var SRC_MARKERS = ["dragoniframe=true", "omedasite="];

  function srcLooksRight(src) {
    if (!src) return false;
    src = String(src);
    for (var i = 0; i < SRC_MARKERS.length; i++) {
      if (src.indexOf(SRC_MARKERS[i]) !== -1) return true;
    }
    return false;
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

  function parseHeight(data) {
    // Object payload: { type:"DF_IFRAME_RESIZE", height: 967 }
    if (data && typeof data === "object") {
      if (data.type === "DF_IFRAME_RESIZE" && data.height != null) {
        var h = parseInt(data.height, 10);
        return isFinite(h) ? h : null;
      }
      return null;
    }

    // String payload: "DF_IFRAME_RESIZE:967"
    if (typeof data === "string") {
      var m = data.match(/^DF_IFRAME_RESIZE:(\d+)/);
      if (m) return parseInt(m[1], 10);
    }

    return null;
  }

  // Re-apply height briefly to beat scripts that keep forcing 498px
  function enforceHeight(iframe, px) {
    var target = px + 10; // small buffer

    // Apply immediately
    iframe.style.height = target + "px";
    iframe.style.minHeight = target + "px";
    iframe.style.width = "100%";
    iframe.style.border = "0";
    iframe.setAttribute("scrolling", "no");

    // Re-apply for 3 seconds (every 150ms)
    var end = Date.now() + 3000;
    (function tick() {
      if (Date.now() > end) return;
      if (iframe.style.height !== target + "px") {
        iframe.style.height = target + "px";
        iframe.style.minHeight = target + "px";
      }
      setTimeout(tick, 150);
    })();
  }

  window.addEventListener("message", function (e) {
    if (ALLOWED && !ALLOWED[e.origin]) return;

    var h = parseHeight(e.data);
    if (!h || h < 200) return;

    var iframe = findIframeForSource(e.source);
    if (!iframe) {
      if (DEBUG) log("got resize but couldn't map source→iframe", e.origin, h);
      return;
    }

    if (!srcLooksRight(iframe.getAttribute("src") || iframe.src)) {
      if (DEBUG) log("ignoring iframe (src not marked)", iframe.src);
      return;
    }

    enforceHeight(iframe, h);

    if (DEBUG) log("resized", iframe.src, "→", (h + 10) + "px");
  }, true);

  if (DEBUG) log("loaded", window.__iframeResizeVersion, "on", location.href);
})();
