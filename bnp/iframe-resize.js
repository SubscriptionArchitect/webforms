(function () {
  "use strict";

  const testingMode = false;

  const FIELD_IDS = {
    firstName: "id1",
    ecid:      "id110",
    email:     "id13",
    authId:    "id153",
    wsgDrop:   "optp2396"
  };

  /* =====================================================
     Inject Overlay Styles
  ===================================================== */
  function injectStyles() {
    if (document.getElementById("account-overlay-styles")) return;

    const style = document.createElement("style");
    style.id = "account-overlay-styles";
    style.textContent = `
      #loading-overlay {
        position: fixed !important;
        inset: 0 !important;
        background: #000 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 24px !important;
        z-index: 2147483647 !important;
      }

      #spinner-container {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      #spinner {
        border: 16px solid rgba(255,255,255,.2);
        border-top: 16px solid #d71920;
        border-radius: 50%;
        width: 100px;
        height: 100px;
        animation: spin 1s linear infinite;
      }

      @keyframes spin { to { transform: rotate(360deg); } }

      #loading-text {
        color: #fff;
        font-size: 24px;
        font-weight: 700;
        margin-top: 16px;
      }

      .continue-card {
        max-width: 520px;
        width: 100%;
        background: #1a1a1a;
        border-radius: 14px;
        padding: 18px;
        color: #fff;
      }

      .continue-card button {
        border: 0;
        border-radius: 10px;
        padding: 10px 14px;
        font-weight: 700;
        background: #d71920;
        color: #fff;
        cursor: pointer;
      }
    `;
    document.head.appendChild(style);
  }

  function createOverlay() {
    if (document.getElementById("loading-overlay")) return;

    const overlay = document.createElement("div");
    overlay.id = "loading-overlay";
    overlay.innerHTML = `
      <div id="spinner-container">
        <div id="spinner"></div>
        <div id="loading-text">Loading</div>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  function inIframe() {
    try { return window.top !== window.self; }
    catch (e) { return true; }
  }

  /* =====================================================
     YOUR REAL REDIRECT LOGIC (UNCHANGED)
  ===================================================== */
  function buildRedirectUrl() {

    const fn    = (document.getElementById(FIELD_IDS.firstName)?.value || "").trim();
    const ecid  = (document.getElementById(FIELD_IDS.ecid)?.value || "").trim();
    const email = (document.getElementById(FIELD_IDS.email)?.value || "").trim();
    const ns    = (document.getElementById(FIELD_IDS.authId)?.value || "").trim();
    const wsgV  = (document.getElementById(FIELD_IDS.wsgDrop)?.value || "").trim();

    const hasWSG = (wsgV === "1");

    const returnurl = window.location.origin;

    if (hasWSG && ns) {
      return `https://account.enr.com/enr_login_welcome?fn=${encodeURIComponent(fn)}&em=${encodeURIComponent(email)}&ns=${encodeURIComponent(ns)}&returnurl=${encodeURIComponent(returnurl)}`;
    }

    if (ns && !hasWSG) {
      return `https://account.enr.com/enr_addwsg?r=${encodeURIComponent(ecid)}&returnurl=${encodeURIComponent(returnurl)}`;
    }

    if (hasWSG && !ns) {
      return `https://account.enr.com/enr_setup?em=${encodeURIComponent(email)}&returnurl=${encodeURIComponent(returnurl)}&r=${encodeURIComponent(ecid)}`;
    }

    return `https://account.enr.com/enr_setup?em=${encodeURIComponent(email)}&returnurl=${encodeURIComponent(returnurl)}`;
  }

  /* =====================================================
     My Account Button (SEPARATE LOGIC)
  ===================================================== */
  function buildEnrMyAccountUrl() {
    return "https://account.enr.com/enr_myaccount&r=@{encrypted_customer_id}@";
  }

  function replaceWithContinue() {
    const overlay = document.getElementById("loading-overlay");
    overlay.innerHTML = "";

    const card = document.createElement("div");
    card.className = "continue-card";

    card.innerHTML = `
      <h3>Continue to your account</h3>
      <p>Your browser blocked an automatic redirect.</p>
    `;

    const btn = document.createElement("button");
    btn.textContent = "My Account";

    btn.onclick = function () {
      const accountUrl = buildEnrMyAccountUrl();
      if (inIframe()) window.top.location.href = accountUrl;
      else window.location.href = accountUrl;
    };

    card.appendChild(btn);
    overlay.appendChild(card);
  }

  function attemptRedirect() {

    if (testingMode) {
      replaceWithContinue();
      return;
    }

    const redirectUrl = buildRedirectUrl(); // 👈 THIS IS YOUR REAL LOGIC

    try {
      if (inIframe()) window.top.location.href = redirectUrl;
      else window.location.href = redirectUrl;

      setTimeout(() => {
        replaceWithContinue();
      }, 300);

    } catch (e) {
      replaceWithContinue();
    }
  }

  function init() {
    injectStyles();
    createOverlay();
    setTimeout(attemptRedirect, 600);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
