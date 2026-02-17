/* DF iframe autosize — PARENT (site)
   - Height: EXACT from child
   - Width: fluid (100%), no fixed sizes
*/
(function () {
  "use strict";

  var MSG_TYPE = "DF_IFRAME_RESIZE";
  var lastApplied = new WeakMap();

  function toInt(v) {
    var n = parseInt(v, 10);
    return isFinite(n) ? n : null;
  }

  function findIframeForSource(srcWin) {
    var frames = document.querySelectorAll("iframe");
    for (var i = 0; i < frames.length; i++) {
      var f = frames[i];
      try { if (f.contentWindow === srcWin) return f; } catch(e) {}
    }
    return null;
  }

  function applyFluidWidth(iframe) {
    // Let the iframe fill whatever container it lives in
    iframe.style.width = "100%";
    iframe.style.maxWidth = "100%";
    iframe.style.minWidth = "0";
    iframe.style.display = "block";

    // Remove common iframe constraints if present
    iframe.removeAttribute("width");

    // Keep it clean
    iframe.style.border = "0";
    iframe.setAttribute("scrolling", "no");
  }

  window.__resizeListenerInstalled = true;

  window.addEventListener("message", function (e) {
    var d = e.data;
    if (!d || typeof d !== "object") return;
    if (d.type !== MSG_TYPE) return;

    var h = toInt(d.height);
    if (!h || h < 50) return;

    var iframe = findIframeForSource(e.source);
    if (!iframe) return;

    // Width fix
    applyFluidWidth(iframe);

    // Height exact
    var prev = lastApplied.get(iframe) || 0;
    if (prev && Math.abs(h - prev) < 2) return;

    lastApplied.set(iframe, h);
    iframe.style.height = h + "px";
    iframe.style.minHeight = h + "px";
  }, true);
})();
