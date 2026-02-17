
/*!
 * BNP iframe autosize (stable + centered width)
 * - Parent: listens for DF_IFRAME_RESIZE and resizes the correct iframe (via e.source mapping)
 * - Child: posts DF_IFRAME_RESIZE with debounced + thresholded height (prevents jump)
 *
 * Usage:
 * 1) Include THIS SAME SCRIPT on the PARENT page (the page containing the iframe).
 * 2) Also include THIS SAME SCRIPT on the IFRAME page (the form page).
 * 3) Optionally set data-bnp-iframe-resize on the iframe tag (recommended).
 *
 * Notes:
 * - Width: parent enforces a responsive width (min(560px, 92vw)) and centers the iframe.
 * - Height: buffered + debounced to avoid micro-jitter.
 */
(function () {
  "use strict";

  // ------------ shared helpers ------------
  function nowHeight() {
    var de = document.documentElement;
    var b = document.body;
    return Math.max(
      de ? de.scrollHeight : 0,
      b ? b.scrollHeight : 0,
      de ? de.offsetHeight : 0,
      b ? b.offsetHeight : 0,
      de ? de.clientHeight : 0,
      b ? b.clientHeight : 0
    );
  }

  function asInt(v) {
    var n = parseInt(v, 10);
    return isFinite(n) ? n : null;
  }

  // ------------ CHILD (iframe) sender ------------
  // If we're inside an iframe, send heights to parent.
  // (Same-origin not required; postMessage is allowed.)
  var isInIframe = false;
  try { isInIframe = window.self !== window.top; } catch (e) { isInIframe = true; }

  if (isInIframe) {
    var CHILD_DEBOUNCE_MS = 140;
    var CHILD_THRESHOLD_PX = 10;

    var childLastSent = 0;
    var childTimer = 0;

    function childPost(h) {
      try { window.parent.postMessage({ type: "DF_IFRAME_RESIZE", height: h }, "*"); } catch (e) {}
    }

    function childSchedule(force) {
      if (childTimer) return;
      childTimer = window.setTimeout(function () {
        childTimer = 0;
        var h = nowHeight();
        if (force || !childLastSent || Math.abs(h - childLastSent) >= CHILD_THRESHOLD_PX) {
          childLastSent = h;
          childPost(h);
        }
      }, CHILD_DEBOUNCE_MS);
    }

    function childKick() {
      childSchedule(true);
      setTimeout(function(){ childSchedule(true); }, 250);
      setTimeout(function(){ childSchedule(true); }, 900);
      setTimeout(function(){ childSchedule(true); }, 1800);
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", childKick);
    } else {
      childKick();
    }
    window.addEventListener("load", childKick);
    window.addEventListener("resize", function(){ childSchedule(false); });

    try { new ResizeObserver(function(){ childSchedule(false); }).observe(document.body); } catch (e) {}
    try { new MutationObserver(function(){ childSchedule(false); }).observe(document.body, {subtree:true, childList:true, attributes:true}); } catch (e) {}

    // Safety pulse (low frequency)
    setInterval(function(){ childSchedule(false); }, 1800);
  }

  // ------------ PARENT listener + iframe styling ------------
  // If we're NOT in an iframe, we're the parent context.
  if (!isInIframe) {
    // Mark for easy verification
    window.__resizeListenerInstalled = true;

    var PARENT_HEIGHT_BUFFER = 10;     // prevents 1px scrollbars
    var PARENT_THRESHOLD_PX = 12;      // prevents micro-jitter
    var PARENT_ENFORCE_MS = 1200;      // brief enforcement window to beat "498px" setters
    var parentLastApplied = new WeakMap(); // iframe -> px

    // Responsive width (fix "not wide enough")
    var IFRAME_WIDTH = "min(560px, 92vw)";
    var IFRAME_MAX_WIDTH = "92vw";
    var IFRAME_MIN_WIDTH = "320px";

    function parentFindIframeBySource(srcWin) {
      var iframes = document.querySelectorAll("iframe");
      for (var i = 0; i < iframes.length; i++) {
        var f = iframes[i];
        try {
          if (f.contentWindow === srcWin) return f;
        } catch (e) {}
      }
      return null;
    }

    function parentLooksTarget(iframe) {
      // Recommended: add data-bnp-iframe-resize to the iframe tag
      if (iframe.hasAttribute("data-bnp-iframe-resize")) return true;

      // Fallback: only touch likely DF embeds (avoid ads)
      var src = iframe.getAttribute("src") || iframe.src || "";
      return /dragoniframe=true|omedasite=|loading\.do|init\.do/i.test(src);
    }

    function parentApplyIframeChrome(iframe) {
      // Width + centering (fix narrow embed)
      iframe.style.width = IFRAME_WIDTH;
      iframe.style.maxWidth = IFRAME_MAX_WIDTH;
      iframe.style.minWidth = IFRAME_MIN_WIDTH;
      iframe.style.display = "block";
      iframe.style.marginLeft = "auto";
      iframe.style.marginRight = "auto";

      // Clean frame
      iframe.style.border = "0";
      iframe.setAttribute("scrolling", "no");
    }

    function parentEnforceHeight(iframe, px) {
      var prev = parentLastApplied.get(iframe) || 0;
      if (prev && Math.abs(px - prev) < PARENT_THRESHOLD_PX) return;

      parentLastApplied.set(iframe, px);

      iframe.style.height = px + "px";
      iframe.style.minHeight = px + "px";

      // brief enforcement (beats scripts that snap back to 498px)
      var end = Date.now() + PARENT_ENFORCE_MS;
      (function tick() {
        if (Date.now() > end) return;
        if (iframe.style.height !== px + "px") {
          iframe.style.height = px + "px";
          iframe.style.minHeight = px + "px";
        }
        setTimeout(tick, 140);
      })();
    }

    window.addEventListener("message", function (e) {
      var d = e.data;
      if (!d || typeof d !== "object") return;
      if (d.type !== "DF_IFRAME_RESIZE") return;

      var h = asInt(d.height);
      if (!h || h < 200) return;

      var iframe = parentFindIframeBySource(e.source);
      if (!iframe) return;
      if (!parentLooksTarget(iframe)) return;

      parentApplyIframeChrome(iframe);

      var target = h + PARENT_HEIGHT_BUFFER;
      parentEnforceHeight(iframe, target);
    }, true);
  }
})();

