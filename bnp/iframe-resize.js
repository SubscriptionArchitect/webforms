/* BNP My Account Injector
   - Detects Welcome, <Name>
   - Maps domain → brandcode
   - Uses ?r= if present, else uses data-encrypted="@{encrypted_customer_id}@"
   - Builds: https://account.brandsite.com/BRAND_myaccount&r=...
*/

(function () {
  "use strict";

  if (window.__BNP_MY_ACCOUNT__) return;
  window.__BNP_MY_ACCOUNT__ = true;

  var BTN_ID = "bnp-my-account-btn";
  var WELCOME_LI_SELECTOR = 'li.user-actions__account.user-actions__account-link';

  // ---------------- DOMAIN → BRAND CODE MAP ----------------
  var BRAND_MAP = {
    "achrnews.com": "NEWS",
    "enr.com": "ENR",
    "architecturalrecord.com": "AR",
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
    return String(window.location.hostname || "")
      .toLowerCase()
      .replace(/^www\./, "");
  }

  function getBrandCode() {
    var host = normalizeHost();
    if (BRAND_MAP[host]) return BRAND_MAP[host];
    return host.split(".")[0].toUpperCase();
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
    var v = loader.getAttribute("data-encrypted") || "";
    return String(v).trim();
  }

  function buildAccountUrl() {
    var host = normalizeHost();
    var brand = getBrandCode();

    // Prefer real value from URL; otherwise use DF merge token from loader
    var enc = getEncryptedFromQuery() || getEncryptedFromLoaderAttr();

    // Always include &r= (even if token is blank)
    // NOTE: your required format uses "&r=" (not "?r=")
    var base = "https://account." + host + "/";
    var path = brand + "_myaccount";

    if (enc) return base + path + "&r=" + encodeURIComponent(enc);
    return base + path + "&r=";
  }

  function injectButton() {
    var li = document.querySelector(WELCOME_LI_SELECTOR);
    if (!li) return;

    var txt = (li.textContent || "").trim();
    if (!/^welcome\b/i.test(txt)) return;

    if (document.getElementById(BTN_ID)) return;

    var btn = document.createElement("a");
    btn.id = BTN_ID;
    btn.href = buildAccountUrl();
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
