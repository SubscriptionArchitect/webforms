/* BNP My Account Injector
   - Detects Welcome, <Name>
   - Maps domain → brandcode
   - Pulls encrypted ID from ?r=
   - Builds: https://account.brandsite.com/brandcode_myaccount&r=<id>
*/

(function () {
  "use strict";

  if (window.__BNP_MY_ACCOUNT__) return;
  window.__BNP_MY_ACCOUNT__ = true;

  var BTN_ID = "bnp-my-account-btn";

  /* --------------------------------------------------
     DOMAIN → BRAND CODE MAP
     Add to this as needed.
  -------------------------------------------------- */

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

  /* -------------------------------------------------- */

  function getEncryptedId() {
    try {
      var params = new URLSearchParams(window.location.search);
      return params.get("r") || "";
    } catch (e) {
      return "";
    }
  }

  function normalizeHost() {
    var host = window.location.hostname.toLowerCase();
    host = host.replace(/^www\./, "");
    return host;
  }

  function getBrandCode() {
    var host = normalizeHost();

    if (BRAND_MAP[host]) return BRAND_MAP[host];

    // fallback: use first domain segment uppercase
    return host.split(".")[0].toUpperCase();
  }

  function buildAccountUrl() {
    var brand = getBrandCode();
    var host = normalizeHost();
    var encrypted = getEncryptedId();

    var base = "https://account." + host + "/";
    var path = brand + "_myaccount";

    if (encrypted) {
      return base + path + "&r=" + encodeURIComponent(encrypted);
    }
    return base + path;
  }

  function injectButton() {
    var li = document.querySelector(
      'li.user-actions__account.user-actions__account-link'
    );

    if (!li) return;

    var txt = (li.textContent || "").trim();
    if (!/^welcome\b/i.test(txt)) return;

    if (document.getElementById(BTN_ID)) return;

    var btn = document.createElement("a");
    btn.id = BTN_ID;
    btn.href = buildAccountUrl();
    btn.textContent = "My Account";

    // Minimal styling so it looks intentional but brand-neutral
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

    var mo = new MutationObserver(function () {
      injectButton();
    });

    mo.observe(document.documentElement, {
      subtree: true,
      childList: true,
      characterData: true
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", watch);
  } else {
    watch();
  }

})();
