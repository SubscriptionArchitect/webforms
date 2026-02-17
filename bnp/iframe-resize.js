/* BNP / DF iframe autosize — SITE (PARENT) FULL SCRIPT (NO <script> TAGS)
   What it does:
   1) (Optional but recommended) If the DF iframe is sitting inside a GPT ad container
      (google_ads_iframe_*__container__), it moves it into the first real content container found.
      This fixes "too narrow" caused by leaderboard/ad-slot width caps.
   2) Sets iframe width fluid (100% of its container) with no hard-coded sizes.
   3) Sets iframe height EXACTLY to what the form (child) reports (no extra padding).

   Requirements:
   - The FORM (child) page must postMessage: { type:"DF_IFRAME_RESIZE", height:<px> }
*/
(function () {
  "use strict";

  var MSG_TYPE = "DF_IFRAME_RESIZE";

  // --------- CONFIG: tweak selectors if you want a specific placement ---------
  // Where to relocate the iframe if it's trapped in a GPT ad container.
  // Order matters: first match wins.
  var CONTENT_TARGET_SELECTORS = [
    ".article-body",
    ".article-content",
    ".article__body",
    ".article__content",
    "#article-body",
    "#content",
    "main"
  ];

  // If true, will attempt to move iframe out of GPT container once (helps width).
  var ENABLE_AUTO_RELOCATE = true;

  // -------------------------------------------------------------
  function toInt(v) {
    var n = parseInt(v, 10);
    return isFinite(n) ? n : null;
  }

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function qsa(sel, root) {
    return (root || document).querySelectorAll(sel);
  }

  function findFirst(selList) {
    for (var i = 0; i < selList.length; i++) {
      var el = qs(selList[i]);
      if (el) return el;
    }
    return null;
  }

  function isLikelyDFIframe(iframe) {
    if (!iframe) return false;
    var src = iframe.getAttribute("src") || iframe.src || "";
    return /dragoniframe=true|omedasite=|loading\.do|init\.do/i.test(src);
  }

  function findAnyDFIframe() {
    var frames = qsa("iframe");
    for (var i = 0; i < frames.length; i++) {
      if (isLikelyDFIframe(frames[i])) return frames[i];
    }
    return null;
  }

  function findIframeForSource(srcWin) {
    var frames = qsa("iframe");
    for (var i = 0; i < frames.length; i++) {
      var f = frames[i];
      try {
        if (f.contentWindow === srcWin) return f;
      } catch (e) {}
    }
    return null;
  }

  function looksLikeGPTContainer(el) {
    if (!el) return false;
    var id = el.id || "";
    // Matches: google_ads_iframe_/52040140/...__container__
    return /^google_ads_iframe_/i.test(id) && /__container__$/i.test(id);
  }

  function ensureWrapper(iframe) {
    // Wrap iframe so we can control layout without hardcoded sizes
    var parent = iframe.parentElement;
    if (parent && parent.getAttribute && parent.getAttribute("data-bnp-iframe-wrap") === "1") {
      return parent;
    }

    var wrap = document.createElement("div");
    wrap.setAttribute("data-bnp-iframe-wrap", "1");
    wrap.style.width = "100%";
    wrap.style.maxWidth = "100%";
    wrap.style.margin = "16px 0";
    wrap.style.display = "block";

    if (parent) {
      parent.insertBefore(wrap, iframe);
      wrap.appendChild(iframe);
    } else {
      document.body.appendChild(wrap);
      wrap.appendChild(iframe);
    }

    return wrap;
  }

  function applyFluidWidth(iframe) {
    // Do not set any fixed widths—just fill container
    iframe.style.width = "100%";
    iframe.style.maxWidth = "100%";
    iframe.style.minWidth = "0";
    iframe.style.display = "block";
    iframe.style.border = "0";
    iframe.removeAttribute("width");
    iframe.setAttribute("scrolling", "no");
  }

  function relocateIfTrappedInGPT(iframe) {
    if (!ENABLE_AUTO_RELOCATE) return iframe;

    var p = iframe.parentElement;
    if (!p) return iframe;

    // If already wrapped, check wrapper's parent too
    var wrap = (p.getAttribute && p.getAttribute("data-bnp-iframe-wrap") === "1") ? p : null;
    var container = wrap ? wrap.parentElement : p;

    if (!looksLikeGPTContainer(container)) return iframe;

    var target = findFirst(CONTENT_TARGET_SELECTORS);
    if (!target) return iframe;

    var w = ensureWrapper(iframe);

    // Put it at top of target (feel free to change insertion point)
    if (target.firstChild) target.insertBefore(w, target.firstChild);
    else target.appendChild(w);

    return iframe;
  }

  // ---- Height application: exact (no padding), tiny threshold to avoid jitter ----
  var lastApplied = new WeakMap();

  function applyExactHeight(iframe, h) {
    var prev = lastApplied.get(iframe) || 0;
    if (prev && Math.abs(h - prev) < 2) return;

    lastApplied.set(iframe, h);
    iframe.style.height = h + "px";
    iframe.style.minHeight = h + "px";
  }

  // ---- Boot: try to fix width trap ASAP ----
  function bootRelocate() {
    var ifr = findAnyDFIframe();
    if (!ifr) return;
    ensureWrapper(ifr);
    relocateIfTrappedInGPT(ifr);
    applyFluidWidth(ifr);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootRelocate);
  } else {
    bootRelocate();
  }
  window.addEventListener("load", bootRelocate);

  // Expose a flag for debugging
  window.__resizeListenerInstalled = true;

  // ---- Listen for child height messages ----
  window.addEventListener("message", function (e) {
    var d = e.data;
    if (!d || typeof d !== "object") return;
    if (d.type !== MSG_TYPE) return;

    var h = toInt(d.height);
    if (!h || h < 50) return;

    var iframe = findIframeForSource(e.source);
    if (!iframe) return;
    if (!isLikelyDFIframe(iframe)) return;

    // Ensure we are not constrained by ad slot container
    ensureWrapper(iframe);
    relocateIfTrappedInGPT(iframe);

    // Apply fluid width and exact height
    applyFluidWidth(iframe);
    applyExactHeight(iframe, h);
  }, true);

})();
