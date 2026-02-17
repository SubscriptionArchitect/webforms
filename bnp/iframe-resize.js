/* BNP My Account Injector — robust r extraction (handles nested referer/returnurl)
   Builds:
   https://{site}/user/omeda/redirect?url={ENCODED https://account.{site}/loading.do?omedasite={brand}_myaccount&r=<ENC>}
*/

(function () {
  "use strict";

  if (window.__BNP_MY_ACCOUNT__) return;
  window.__BNP_MY_ACCOUNT__ = true;

  var BTN_ID = "bnp-my-account-btn";
  var WELCOME_LI_SELECTOR = 'li.user-actions__account.user-actions__account-link';
  var REDIRECT_PATH = "/user/omeda/redirect";

  var BRAND_MAP = {
    "architecturalrecord.com": "AR",
    "achrnews.com": "NEWS",
    "enr.com": "ENR",
    "assemblymag.com": "ASM",
    "adhesivesmag.com": "ASI",
    "bevindustry.com": "BI",
    "buildingenclosureonline.com": "BE",
    "dairyfoods.com": "DF",
    "engineered-systems.com": "ES",
    "foodengineeringmag.com": "FE",
    "foodsafetymagazine.com": "FSM",
    "ishn.com": "ISHN",
    "nationaldriller.com": "ND",
    "provisioneronline.com": "NP",
    "pcimag.com": "PCI",
    "pmengineer.com": "PM",
    "preparedfoods.com": "PF",
    "roofingcontractor.com": "RC",
    "stoneworld.com": "SW"
  };

  function normalizeHost() {
    return String(window.location.hostname || "").toLowerCase().replace(/^www\./, "");
  }

  function getBrandCode() {
    var host = normalizeHost();
    return (BRAND_MAP[host] || host.split(".")[0] || "").toUpperCase();
  }

  function tryGetParam(urlLike, key) {
    try {
      var u = new URL(urlLike, window.location.origin);
      return u.searchParams.get(key) || "";
    } catch (e) {
      return "";
    }
  }

  // Pull r from:
  // - direct URL (?r=)
  // - any query param value that itself contains a URL with r=
  // - any query param value that is URL-encoded and contains r=
  function findRDeep() {
    // 1) direct
    try {
      var sp = new URLSearchParams(window.location.search);
      var direct = sp.get("r") || "";
      if (direct) return direct;

      // 2) scan all params for nested URLs containing r
      for (var pair of sp.entries()) {
        var val = pair[1] || "";
        if (!val) continue;

        // raw nested URL
        var r1 = tryGetParam(val, "r");
        if (r1) return r1;

        // decoded nested URL
        try {
          var decoded = decodeURIComponent(val);
          var r2 = tryGetParam(decoded, "r");
          if (r2) return r2;
        } catch (e2) {}
      }
    } catch (e3) {}

    // 3) scan any existing links for r directly or inside returnurl/url
    var links = document.querySelectorAll('a[href*="r="], a[href*="returnurl="], a[href*="referer="], a[href*="url="], a[href*="loading.do"], a[href*="/user/omeda"]');
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute("href") || "";
      if (!href) continue;

      var r = tryGetParam(href, "r");
      if (r) return r;

      var ru = tryGetParam(href, "returnurl") || tryGetParam(href, "referer") || tryGetParam(href, "url");
      if (ru) {
        var r3 = tryGetParam(ru, "r");
        if (r3) return r3;
        try {
          var ruDec = decodeURIComponent(ru);
          var r4 = tryGetParam(ruDec, "r");
          if (r4) return r4;
        } catch (e4) {}
      }
    }

    return "";
  }

  function buildHref() {
    var host = normalizeHost();
    var brand = getBrandCode().toLowerCase();
    var enc = findRDeep(); // ✅ this is the fix

    // Put r on the MYACCOUNT URL (not in returnurl)
    var accountUrl =
      "https://account." + host +
      "/loading.do?omedasite=" + encodeURIComponent(brand + "_myaccount") +
      "&r=" + encodeURIComponent(enc || "");

    var siteBase = window.location.origin.replace(/\/+$/, "");
    return siteBase + REDIRECT_PATH + "?url=" + encodeURIComponent(accountUrl);
  }

  function injectButton() {
    var li = document.querySelector(WELCOME_LI_SELECTOR);
    if (!li) return;

    var txt = (li.textContent || "").trim();
    if (!/^welcome\b/i.test(txt)) return;

    if (document.getElementById(BTN_ID)) return;

    var btn = document.createElement("a");
    btn.id = BTN_ID;
    btn.href = buildHref();
    btn.textContent = "My Account";

    btn.style.display = "inline-block";
    btn.style.marginTop = "8px";
    btn.style.padding = "8px 12px";
    btn.style.borderRadius = "6px";
    btn.style.textDecoration = "none";
    btn.style.fontWeight = "600";
    btn.style.border = "1px solid rgba(0,0,0,.15)";
    btn.style.background = "#fff";
    btn.style.color = "inherit";

    li.appendChild(document.createElement("br"));
    li.appendChild(btn);
  }

  function watch() {
    injectButton();
    try {
      new MutationObserver(injectButton).observe(document.documentElement, {
        subtree: true,
        childList: true,
        characterData: true
      });
    } catch (e) {}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", watch);
  } else {
    watch();
  }
})();
