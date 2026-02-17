/* DF iframe autosize — PARENT (site)
   Sets iframe height EXACTLY to what child reports.
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

  window.__resizeListenerInstalled = true;

  window.addEventListener("message", function (e) {
    var d = e.data;
    if (!d || typeof d !== "object") return;
    if (d.type !== MSG_TYPE) return;

    var h = toInt(d.height);
    if (!h || h < 50) return;

    var iframe = findIframeForSource(e.source);
    if (!iframe) return;

    var prev = lastApplied.get(iframe) || 0;
    if (prev && Math.abs(h - prev) < 2) return;

    lastApplied.set(iframe, h);
    iframe.style.height = h + "px";
    iframe.style.minHeight = h + "px";
    iframe.setAttribute("scrolling", "no");
    iframe.style.border = "0";
  }, true);
})();
