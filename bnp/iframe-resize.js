/*!
 * BNP / DF Iframe Autosize — PARENT (Site) v2 (wider + exact height)
 */
(function () {
  "use strict";

  var MSG_TYPE = "DF_IFRAME_RESIZE";

  var CONTENT_TARGET_SELECTORS = [
    ".article-body",
    ".article-content",
    ".article__body",
    ".article__content",
    "#article-body",
    "#content",
    "main"
  ];

  var ALLOWED_ORIGINS = {
    "https://bnp.dragonforms.com": true,
    "https://account.enr.com": true,
    "https://subscribe.enr.com": true
  };

  function qs(sel, root){ return (root || document).querySelector(sel); }
  function qsa(sel, root){ return (root || document).querySelectorAll(sel); }

  function findFirst(list){
    for (var i=0;i<list.length;i++){ var el = qs(list[i]); if (el) return el; }
    return null;
  }

  function toInt(v){ var n = parseInt(v,10); return isFinite(n) ? n : null; }

  function isLikelyDFIframe(iframe) {
    if (!iframe) return false;
    var src = iframe.getAttribute("src") || iframe.src || "";
    return /dragoniframe=true|omedasite=|loading\.do|init\.do/i.test(src);
  }

  function findIframeForSource(srcWin) {
    var frames = qsa("iframe");
    for (var i=0;i<frames.length;i++){
      var f = frames[i];
      try { if (f.contentWindow === srcWin) return f; } catch(e){}
    }
    return null;
  }

  function looksLikeGPTContainer(el) {
    if (!el) return false;
    var id = el.id || "";
    return /^google_ads_iframe_/i.test(id) && /__container__$/i.test(id);
  }

  function ensureWrapper(iframe) {
    var p = iframe.parentElement;
    if (p && p.getAttribute && p.getAttribute("data-bnp-iframe-wrap") === "1") return p;

    var wrap = document.createElement("div");
    wrap.setAttribute("data-bnp-iframe-wrap", "1");
    wrap.style.width = "100%";
    wrap.style.maxWidth = "100%";
    wrap.style.display = "block";
    wrap.style.margin = "16px 0";

    if (p) {
      p.insertBefore(wrap, iframe);
      wrap.appendChild(iframe);
    } else {
      document.body.appendChild(wrap);
      wrap.appendChild(iframe);
    }
    return wrap;
  }

  function applyFluidWidth(iframe) {
    iframe.style.width = "100%";
    iframe.style.maxWidth = "100%";
    iframe.style.minWidth = "0";
    iframe.style.display = "block";
    iframe.style.border = "0";
    iframe.removeAttribute("width");
    iframe.setAttribute("scrolling", "no");
  }

  function relocateIfTrapped(iframe) {
    var p = iframe.parentElement;
    if (!p) return;

    var wrap = (p.getAttribute && p.getAttribute("data-bnp-iframe-wrap") === "1") ? p : null;
    var container = wrap ? wrap.parentElement : p;

    if (!looksLikeGPTContainer(container)) return;

    var target = findFirst(CONTENT_TARGET_SELECTORS);
    if (!target) return;

    var w = ensureWrapper(iframe);
    if (target.firstChild) target.insertBefore(w, target.firstChild);
    else target.appendChild(w);
  }

  var lastApplied = new WeakMap();

  function applyExactHeight(iframe, h) {
    var prev = lastApplied.get(iframe) || 0;
    if (prev && Math.abs(h - prev) < 2) return;
    lastApplied.set(iframe, h);
    iframe.style.height = h + "px";
    iframe.style.minHeight = h + "px";
  }

  window.__resizeListenerInstalled = true;

  window.addEventListener("message", function (e) {
    if (ALLOWED_ORIGINS && Object.keys(ALLOWED_ORIGINS).length) {
      if (!ALLOWED_ORIGINS[e.origin]) return;
    }

    var d = e.data;
    if (!d || typeof d !== "object") return;
    if (d.type !== MSG_TYPE) return;

    var h = toInt(d.height);
    if (!h || h < 50) return;

    var iframe = findIframeForSource(e.source);
    if (!iframe) return;
    if (!isLikelyDFIframe(iframe)) return;

    ensureWrapper(iframe);
    relocateIfTrapped(iframe);   // <-- key to getting wider than the 970 leaderboard slot
    applyFluidWidth(iframe);
    applyExactHeight(iframe, h);
  }, true);
})();
