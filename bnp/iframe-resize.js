(function () {
  "use strict";

  const testingMode = false;

  /* =====================================================
     Inject Styles
  ===================================================== */
  function injectStyles() {
    if (document.getElementById("account-overlay-styles")) return;

    const style = document.createElement("style");
    style.id = "account-overlay-styles";
    style.textContent = `
      #loading-overlay {
        position: fixed !important;
        inset: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        background: #000 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 24px !important;
        box-sizing: border-box !important;
        z-index: 2147483647 !important;
        isolation: isolate !important;
      }

      #spinner-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        max-width: 520px;
        min-height: 260px;
        width: 100%;
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
        font-family: system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;
      }

      #loading-overlay .continue-card {
        max-width: 520px;
        width: min(520px,100%);
        background: #1a1a1a;
        border-radius: 14px;
        padding: 18px 18px 14px;
        box-shadow: 0 18px 60px rgba(0,0,0,.25);
        color: #fff;
        text-align: left;
        font-family: system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;
      }

      #loading-overlay .continue-card h3 {
        margin: 0 0 6px;
        font-size: 18px;
      }

      #loading-overlay .continue-card p {
        margin: 0 0 12px;
        font-size: 14px;
        line-height: 1.35;
      }

      #loading-overlay .continue-card button {
        appearance: none;
        border: 0;
        border-radius: 10px;
        padding: 10px 14px;
        font-weight: 700;
        cursor: pointer;
        background: #d71920;
        color: #fff;
      }
    `;

    document.head.appendChild(style);
  }

  /* =====================================================
     Create Overlay
  ===================================================== */
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

  /* =====================================================
     ENR My Account URL (Exact Format Required)
  ===================================================== */
  function buildEnrMyAccountUrl() {
    return "https://account.enr.com/enr_myaccount&r=@{encrypted_customer_id}@";
  }

  function inIframe() {
    try { return window.top !== window.self; }
    catch (e) { return true; }
  }

  /* =====================================================
     Replace Spinner With Continue Card
  ===================================================== */
  function replaceWithContinue() {
    const overlay = document.getElementById("loading-overlay");

    // Hide everything visually behind overlay
    document.querySelectorAll("body > *:not(#loading-overlay)").forEach(el => {
      el.style.display = "none";
    });

    overlay.innerHTML = "";

    const card = document.createElement("div");
    card.className = "continue-card";

    card.innerHTML = `
      <h3>Continue to your account</h3>
      <p>Your browser blocked an automatic redirect. Click below to proceed.</p>
    `;

    const btn = document.createElement("button");
    btn.textContent = "My Account";

    btn.onclick = function () {
      const accountUrl = buildEnrMyAccountUrl();

      try {
        if (inIframe()) window.top.location.href = accountUrl;
        else window.location.href = accountUrl;
      } catch (e) {
        window.location.href = accountUrl;
      }
    };

    card.appendChild(btn);
    overlay.appendChild(card);
    btn.focus();
  }

  /* =====================================================
     Attempt Redirect
  ===================================================== */
  function attemptRedirect() {

    if (testingMode) {
      replaceWithContinue();
      return;
    }

    const accountUrl = buildEnrMyAccountUrl();

    try {
      if (inIframe()) window.top.location.href = accountUrl;
      else window.location.href = accountUrl;

      // If still here after attempt, assume blocked
      setTimeout(() => {
        replaceWithContinue();
      }, 300);

    } catch (e) {
      replaceWithContinue();
    }
  }

  /* =====================================================
     Spinner Animation
  ===================================================== */
  function startSpinnerDots() {
    setInterval(() => {
      const text = document.getElementById("loading-text");
      if (!text) return;

      text.dataset.dots = (parseInt(text.dataset.dots || 0) + 1) % 4;
      text.textContent = "Loading" + ".".repeat(text.dataset.dots);
    }, 500);
  }

  /* =====================================================
     Init
  ===================================================== */
  function init() {
    injectStyles();
    createOverlay();
    startSpinnerDots();
    setTimeout(attemptRedirect, 600);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
