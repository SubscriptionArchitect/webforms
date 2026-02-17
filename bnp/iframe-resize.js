/* BNP My Account Injector (FIX: put r= on the MYACCOUNT URL itself, not inside returnurl)
   Builds:
   https://{site}/user/omeda/redirect?url={ENCODED https://account.{site}/loading.do?omedasite={brand}_myaccount&r=<ENC>}

   Key fix:
   - We now resolve ENC robustly:
     1) URL ?r=
     2) loader data-encrypted="@{encrypted_customer_id}@"
     3) scrape any existing omeda/account links on the page and extract r=
     4) scrape returnurl=... and extract r= inside it (last resort)
*/

(function () {
  "use strict";

  if (window.__BNP_MY_ACCOUNT__) return;
  window.__BNP_MY_ACCOUNT__ = true;

  var BTN_ID = "bnp-my-account-btn";
  var WELCOME_LI_SELECTOR = 'li.user-actions__account.user-actions__account-link';
  var REDIRECT_PATH = "/user/omeda/redirect";

  // Domain → Brand code map (expand as needed)
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

  function safeParams(url) {
    try { return new URL(url, window.location.origin).searchParams; } catch (e) { return null; }
  }

  function getQueryRFromHref(href) {
    var sp = safeParams(href);
    return sp ? (sp.get("r") || "") : "";
  }

  function getEncryptedFromQuery() {
    try {
      var params = new URLSearchParams(window.location.search);
      return params.get("r") || "";
    } catch (e) {
      return "";
    }
  }

  function getEncryptedFromLoaderAttr() {
    var loader = document.getElementById("bnp-myaccount-loader");
    if (!loader) return "";
    return String(loader.getAttribute("data-encrypted") || "").trim();
  }

  function scrapeRFromExistingLinks() {
    // Look for any link that already has r= (account/omeda/loading)
    var links = document.querySelectorAll('a[href*="r="], a[href*="loading.do"], a[href*="/user/omeda"]');
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute("href") || "";
      if (!href) continue;

      // Direct r=
      var r = getQueryRFromHref(href);
      if (r) return r;

      // Sometimes r is inside returnurl=...
      try {
        var sp = safeParams(href);
        if (sp) {
          var ru = sp.get("returnurl") || sp.get("url") || "";
          if (ru) {
            var r2 = getQueryRFromHref(ru);
            if (r2) return r2;
          }
        }
      } catch (e) {}
    }
    return "";
  }

  function resolveEncryptedId() {
    // 1) Direct query
    var r = getEncryptedFromQuery();
    if (r) return r;

    // 2) Merge token passed via loader attr
    r = getEncryptedFromLoaderAttr();
    if (r) return r;

    // 3) Scrape from any existing links (very common on logged-in pages)
    r = scrapeRFromExistingLinks();
    if (r) return r;

    return "";
  }

  function buildHref() {
    var host = normalizeHost();
    var brand = getBrandCode().toLowerCase(); // omedasite convention: lowercase
    var enc = resolveEncryptedId();

    // IMPORTANT: r MUST be on the myaccount URL itself
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
