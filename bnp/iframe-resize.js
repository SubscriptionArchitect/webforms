/* BNP / DF iframe autosize — SITE (PARENT) FULL SCRIPT (NO <script> TAGS)
   + Adds "My Account" button under the "Welcome, <name>" user action when present.
*/
(function () {
  "use strict";

  var MSG_TYPE = "DF_IFRAME_RESIZE";

  // --------- CONFIG: tweak selectors if you want a specific placement ---------
  var CONTENT_TARGET_SELECTORS = [
    ".article-body",
    ".article-content",
    ".article__body",
    ".article__content",
    "#article-body",
    "#content",
    "main"
  ];

  var ENABLE_AUTO_RELOCATE = true;

  // ---- My Account button config ----
  var WELCOME_LI_SELECTOR = 'li.user-actions__account.user-actions__account-link';
  var MY_ACCOUNT_BTN_ID = "bnp-my-account-btn";
  var MY_ACCOUNT_LABEL = "My Account";

  // If your site already has an account page link somewhere, we try to reuse it.
  // Otherwise, we fall back to /customerservice (safe default) and let your existing redirects handle it.
  var FALLBACK_ACCOUNT_HREF = "/customerservice";

  // -------------------------------------------------------------
  function toInt(v) {
    var n = parseInt(v, 10);
    return isFinite(n) ? n : null;
  }

  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return (root || document).querySelectorAll(sel); }

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
      try { if (f.contentWindow === srcWin) return f; } catch (e) {}
    }
    return null;
  }

  function looksLikeGPTContainer(el) {
    if (!el) return false;
    var id = el.id || "";
    return /^google_ads_iframe_/i.test(id) && /__container__$/i.test(id);
  }

  function ensureWrapper(iframe) {
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

    var wrap = (p.getAttribute && p.getAttribute("data-bnp-iframe-wrap") === "1") ? p : null;
    var container = wrap ? wrap.parentElement : p;

    if (!looksLikeGPTContainer(container)) return iframe;

    var target = findFirst(CONTENT_TARGET_SELECTORS);
    if (!target) return iframe;

    var w = ensureWrapper(iframe);
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

  // ---- "My Account" injection under Welcome ----
  function resolveAccountHref() {
    // Prefer an existing account-related link if present
    var a =
      qs('a[href*="/customerservice"]') ||
      qs('a[href*="account."]') ||
      qs('a[href*="myaccount"]') ||
      qs('a[href*="hello"]') ||
      qs('a[href*="loading.do?omedasite="]');

    if (a && a.getAttribute("href")) return a.getAttribute("href");
    return FALLBACK_ACCOUNT_HREF;
  }

  function ensureMyAccountButton() {
    var li = qs(WELCOME_LI_SELECTOR);
    if (!li) return;

    // Only act if it actually says "Welcome"
    var txt = (li.textContent || "").trim();
    if (!/^welcome\b/i.test(txt)) return;

    // Avoid duplicates
    if (qs("#" + MY_ACCOUNT_BTN_ID)) return;

    var href = resolveAccountHref();

    var btn = document.createElement("a");
    btn.id = MY_ACCOUNT_BTN_ID;
    btn.href = href;
    btn.textContent = MY_ACCOUNT_LABEL;

    // Minimal inline styling so it looks like a button without needing CSS changes
    btn.style.display = "inline-block";
    btn.style.marginTop = "8px";
    btn.style.padding = "8px 12px";
    btn.style.borderRadius = "6px";
    btn.style.textDecoration = "none";
    btn.style.fontWeight = "600";
    btn.style.lineHeight = "1";
    btn.style.border = "1px solid rgba(0,0,0,.15)";
    btn.style.background = "#fff";
    btn.style.color = "inherit";

    // Put it directly under the Welcome <li>
    li.appendChild(document.createElement("br"));
    li.appendChild(btn);
  }

  function watchForWelcome() {
    ensureMyAccountButton();
    try {
      var mo = new MutationObserver(function () { ensureMyAccountButton(); });
      mo.observe(document.documentElement, { subtree: true, childList: true, attributes: true, characterData: true });
    } catch (e) {}
  }

  // ---- Boot: try to fix width trap + inject button ASAP ----
  function boot() {
    // iframe relocate/width
    var ifr = findAnyDFIframe();
    if (ifr) {
      ensureWrapper(ifr);
      relocateIfTrappedInGPT(ifr);
      applyFluidWidth(ifr);
    }
    // account button
    ensureMyAccountButton();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      boot();
      watchForWelcome();
    });
  } else {
    boot();
    watchForWelcome();
  }
  window.addEventListener("load", boot);

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

    ensureWrapper(iframe);
    relocateIfTrappedInGPT(iframe);

    applyFluidWidth(iframe);
    applyExactHeight(iframe, h);
  }, true);

})();
