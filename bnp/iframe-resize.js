/* BNP — Force olytics modal to TOP on small screens */
(function () {
  "use strict";

  if (window.__bnpOlyticsTopLockInstalled) return;
  window.__bnpOlyticsTopLockInstalled = true;

  function injectCss() {
    if (document.getElementById("bnp-olytics-toplock-css")) return;

    var css = `
@media (max-width: 499px){
  .olyticsmodal{
    position: fixed !important;
    top: calc(env(safe-area-inset-top, 0px) + 12px) !important;
    bottom: auto !important;

    left: 50% !important;
    right: auto !important;
    transform: translateX(-50%) !important;

    width: min(460px, calc(100vw - 24px)) !important;
    max-width: calc(100vw - 24px) !important;

    max-height: calc(100vh - 24px) !important;
    overflow: auto !important;

    margin: 0 !important;
  }

  /* If the overlay/backdrop is flex and was bottom-aligning, this neutralizes it.
     Applies only when .olyticsmodal sits inside a flex container. */
  .olyticsmodal:where(*) {
    align-self: flex-start !important;
  }
}
    `.trim();

    var style = document.createElement("style");
    style.id = "bnp-olytics-toplock-css";
    style.type = "text/css";
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }

  function enforceInline() {
    if (window.innerWidth >= 500) return;

    var m = document.querySelector(".olyticsmodal");
    if (!m) return;

    // Only override if it's clearly bottom-docked
    var cs = window.getComputedStyle(m);
    var bottomVal = (cs.bottom || "").toLowerCase();
    var topVal = (cs.top || "").toLowerCase();

    var isBottomAnchored = bottomVal && bottomVal !== "auto" && bottomVal !== "initial";
    var isTopAuto = !topVal || topVal === "auto";

    if (isBottomAnchored || isTopAuto) {
      m.style.position = "fixed";
      m.style.top = "calc(env(safe-area-inset-top, 0px) + 12px)";
      m.style.bottom = "auto";
      m.style.left = "50%";
      m.style.right = "auto";
      m.style.transform = "translateX(-50%)";
      m.style.width = "min(460px, calc(100vw - 24px))";
      m.style.maxWidth = "calc(100vw - 24px)";
      m.style.maxHeight = "calc(100vh - 24px)";
      m.style.overflow = "auto";
      m.style.margin = "0";
    }
  }

  function boot() {
    injectCss();
    enforceInline();

    // Keep enforcing in case their scripts re-apply bottom styles
    var t = null;
    function tick() {
      if (t) return;
      t = setTimeout(function () {
        t = null;
        enforceInline();
      }, 0);
    }

    window.addEventListener("resize", tick, { passive: true });

    // Watch for modal being inserted / restyled
    var mo = new MutationObserver(tick);
    mo.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["style", "class"] });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
/* BNP — Force olytics modal to TOP on small screens */
(function () {
  "use strict";

  if (window.__bnpOlyticsTopLockInstalled) return;
  window.__bnpOlyticsTopLockInstalled = true;

  function injectCss() {
    if (document.getElementById("bnp-olytics-toplock-css")) return;

    var css = `
@media (max-width: 499px){
  .olyticsmodal{
    position: fixed !important;
    top: calc(env(safe-area-inset-top, 0px) + 12px) !important;
    bottom: auto !important;

    left: 50% !important;
    right: auto !important;
    transform: translateX(-50%) !important;

    width: min(460px, calc(100vw - 24px)) !important;
    max-width: calc(100vw - 24px) !important;

    max-height: calc(100vh - 24px) !important;
    overflow: auto !important;

    margin: 0 !important;
  }

  /* If the overlay/backdrop is flex and was bottom-aligning, this neutralizes it.
     Applies only when .olyticsmodal sits inside a flex container. */
  .olyticsmodal:where(*) {
    align-self: flex-start !important;
  }
}
    `.trim();

    var style = document.createElement("style");
    style.id = "bnp-olytics-toplock-css";
    style.type = "text/css";
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }

  function enforceInline() {
    if (window.innerWidth >= 500) return;

    var m = document.querySelector(".olyticsmodal");
    if (!m) return;

    // Only override if it's clearly bottom-docked
    var cs = window.getComputedStyle(m);
    var bottomVal = (cs.bottom || "").toLowerCase();
    var topVal = (cs.top || "").toLowerCase();

    var isBottomAnchored = bottomVal && bottomVal !== "auto" && bottomVal !== "initial";
    var isTopAuto = !topVal || topVal === "auto";

    if (isBottomAnchored || isTopAuto) {
      m.style.position = "fixed";
      m.style.top = "calc(env(safe-area-inset-top, 0px) + 12px)";
      m.style.bottom = "auto";
      m.style.left = "50%";
      m.style.right = "auto";
      m.style.transform = "translateX(-50%)";
      m.style.width = "min(460px, calc(100vw - 24px))";
      m.style.maxWidth = "calc(100vw - 24px)";
      m.style.maxHeight = "calc(100vh - 24px)";
      m.style.overflow = "auto";
      m.style.margin = "0";
    }
  }

  function boot() {
    injectCss();
    enforceInline();

    // Keep enforcing in case their scripts re-apply bottom styles
    var t = null;
    function tick() {
      if (t) return;
      t = setTimeout(function () {
        t = null;
        enforceInline();
      }, 0);
    }

    window.addEventListener("resize", tick, { passive: true });

    // Watch for modal being inserted / restyled
    var mo = new MutationObserver(tick);
    mo.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["style", "class"] });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
