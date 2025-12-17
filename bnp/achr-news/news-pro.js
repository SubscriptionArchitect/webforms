/* =====================================================================================
NEWS PRO SITE MASTER SCRIPT
Brandon Decker
UX LAB
Updated: 12/17/2025

===================================================================================== */

(function () {
  "use strict";

  /* ============================================================
     BNP GLOBAL NAMESPACE + SMALL UTILS
     ============================================================ */
  if (!window.__BNP_MASTER__) window.__BNP_MASTER__ = {};
  var BNP = window.__BNP_MASTER__;

  function onReady(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }
  function text(el) { return ((el && (el.innerText || el.textContent)) || "").trim(); }

  function moneyFromString(str) {
    if (!str) return null;
    var m =
      /([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{1,2})|[0-9]+(?:\.[0-9]{1,2})?)/.exec(String(str));
    if (!m) return null;
    return parseFloat(m[1].replace(/,/g, ""));
  }
  function formatMoney(n) {
    return typeof n === "number" && !isNaN(n) ? "$" + n.toFixed(2) : null;
  }
  function isVisible(el) {
    if (!el) return false;
    var cs = getComputedStyle(el);
    return cs.display !== "none" && cs.visibility !== "hidden" && cs.opacity !== "0";
  }
  function isFieldVisible(el) {
    if (!el) return false;
    if (el.type === "hidden") return false;
    var cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || cs.opacity === "0") return false;
    if (el.offsetParent === null && cs.position !== "fixed") return false;
    return true;
  }
  function debounce(fn, ms) {
    var t = null;
    return function () {
      var args = arguments;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(null, args); }, ms);
    };
  }

  /* ============================================================
     DEFENSIVE: HARD-KILL #bnp-cart-summary IF IT EVER APPEARS
     ============================================================ */
  (function () {
    if (BNP.__KILL_BNP_CART_SUMMARY__) return;
    BNP.__KILL_BNP_CART_SUMMARY__ = true;

    function kill() {
      var el = document.getElementById("bnp-cart-summary");
      if (el && el.parentNode) el.parentNode.removeChild(el);
    }

    onReady(function () {
      kill();
      if (!window.MutationObserver) return;
      var mo = new MutationObserver(function () { kill(); });
      mo.observe(document.documentElement, { childList: true, subtree: true });
    });
  })();

  /* ============================================================
     SECTION A — PAYMENT-SAFE SUBMIT GUUARD (ORIGINAL)
     ============================================================ */
  (function () {
    if (BNP.__SAFE_SUBMIT_GUARD__) return;
    BNP.__SAFE_SUBMIT_GUARD__ = true;

    var nativeSubmit = HTMLFormElement.prototype.submit;

    function findRealSubmitButton(form) {
      if (!form) return null;
      return (
        form.querySelector('button[type="submit"]:not([disabled])') ||
        form.querySelector('input[type="submit"]:not([disabled])') ||
        form.querySelector('button:not([type]):not([disabled])')
      );
    }

    HTMLFormElement.prototype.submit = function () {
      try {
        var form = this;

        if (
          form &&
          ((form.dataset && form.dataset.allowNativeSubmit === "1") ||
            (form.classList && form.classList.contains("bnp-allow-native-submit")))
        ) {
          return nativeSubmit.call(form);
        }

        if (form && typeof form.requestSubmit === "function") {
          console.warn("[BNP SafeSubmit] Intercepted form.submit(); using requestSubmit() instead.");
          return form.requestSubmit();
        }

        var btn = findRealSubmitButton(form);
        if (btn) {
          console.warn("[BNP SafeSubmit] Intercepted form.submit(); clicking submit button instead.");
          btn.click();
          return;
        }

        console.warn("[BNP SafeSubmit] No requestSubmit/button found; falling back to native submit().");
        return nativeSubmit.call(form);
      } catch (e) {
        try { return nativeSubmit.call(this); } catch (e2) {}
      }
    };
  })();

  /* ============================================================
     SECTION B — ZIP / CITY / STATE FAIL-SAFE (ORIGINAL)
     ============================================================ */
  (function () {
    if (BNP.__ZIP_HELPER__) return;
    BNP.__ZIP_HELPER__ = true;

    onReady(function () {
      var zipInput = document.getElementById("id9"); // Zip/Postal
      var cityInput = document.getElementById("id6"); // City (hidden)
      var stateSelect = document.getElementById("id8"); // State/Province (hidden)

      if (!zipInput || !cityInput || !stateSelect) return;

      var zipLabel = document.querySelector('label[for="id9"]');
      var zipLabelText = (zipLabel && (zipLabel.textContent || "")).toLowerCase();
      if (zipLabelText && zipLabelText.indexOf("zip") === -1 && zipLabelText.indexOf("postal") === -1) {
        console.warn("[ZIP] id9 label does not look like ZIP/Postal; skipping ZIP helper.");
        return;
      }

      function tweakLabel(labelSelector) {
        var labelEl = document.querySelector(labelSelector);
        if (!labelEl) return;

        var stars = labelEl.querySelectorAll(".req-star");
        stars.forEach(function (s) { s.remove(); });

        var baseText = (labelEl.textContent || "").replace("*", "").trim().replace(/:$/, "");
        labelEl.textContent = baseText + ":";
      }

      tweakLabel("#p6 .questionlabel label"); // City label
      tweakLabel("#p8 .questionlabel label"); // State/Province label

      var stateCodeToLabel = {
        "AL": "Alabama","AK": "Alaska","AZ": "Arizona","AR": "Arkansas","CA": "California","CO": "Colorado","CT": "Connecticut","DE": "Delaware","DC": "District of Columbia",
        "FL": "Florida","GA": "Georgia","HI": "Hawaii","ID": "Idaho","IL": "Illinois","IN": "Indiana","IA": "Iowa","KS": "Kansas","KY": "Kentucky","LA": "Louisiana","ME": "Maine",
        "MD": "Maryland","MA": "Massachusetts","MI": "Michigan","MN": "Minnesota","MS": "Mississippi","MO": "Missouri","MT": "Montana","NE": "Nebraska","NV": "Nevada","NH": "New Hampshire",
        "NJ": "New Jersey","NM": "New Mexico","NY": "New York","NC": "North Carolina","ND": "North Dakota","OH": "Ohio","OK": "Oklahoma","OR": "Oregon","PA": "Pennsylvania","RI": "Rhode Island",
        "SC": "South Carolina","SD": "South Dakota","TN": "Tennessee","TX": "Texas","UT": "Utah","VT": "Vermont","VI": "Virgin Islands","VA": "Virginia","WA": "Washington","WV": "West Virginia","WI": "Wisconsin","WY": "Wyoming"
      };

      var cityDisplay = document.createElement("span");
      cityDisplay.id = "cityDisplayText";
      cityDisplay.className = "address-display-text";
      cityDisplay.style.display = "none";
      cityDisplay.style.minHeight = "1.5em";
      cityDisplay.style.fontSize = "inherit";
      cityDisplay.style.fontWeight = "600";
      cityDisplay.style.marginLeft = "4px";

      var stateDisplay = document.createElement("span");
      stateDisplay.id = "stateDisplayText";
      stateDisplay.className = "address-display-text";
      stateDisplay.style.display = "none";
      stateDisplay.style.minHeight = "1.5em";
      stateDisplay.style.fontSize = "inherit";
      stateDisplay.style.fontWeight = "600";
      stateDisplay.style.marginLeft = "4px";

      var cityParent = cityInput.parentNode;
      var stateParent = stateSelect.parentNode;

      if (cityParent && !document.getElementById("cityDisplayText")) cityParent.appendChild(cityDisplay);
      if (stateParent && !document.getElementById("stateDisplayText")) stateParent.appendChild(stateDisplay);

      function syncCityDisplay() { cityDisplay.textContent = cityInput.value || ""; }
      function syncStateDisplay() {
        var idx = stateSelect.selectedIndex;
        var opt = idx >= 0 ? stateSelect.options[idx] : null;
        stateDisplay.textContent = (opt && opt.text) ? opt.text : "";
      }

      function applyCityStateVisibility() {
        var hasCity = !!(cityInput.value || "").trim();
        var hasState = !!(stateSelect.value || "").trim();

        if (hasCity) {
          cityDisplay.style.display = "inline-block";
          cityInput.style.display = "none";
        } else {
          cityDisplay.style.display = "none";
          cityInput.style.display = "";
        }

        if (hasState) {
          stateDisplay.style.display = "inline-block";
          stateSelect.style.display = "none";
        } else {
          stateDisplay.style.display = "none";
          stateSelect.style.display = "";
        }
      }

      function setStateByCode(stateCode) {
        var label = stateCodeToLabel[stateCode];
        if (!label) return;

        var options = stateSelect.options;
        var target = label.toLowerCase();

        for (var i = 0; i < options.length; i++) {
          var opt = options[i];
          if ((opt.text || "").toLowerCase() === target) {
            stateSelect.value = opt.value;
            stateSelect.dispatchEvent(new Event("change", { bubbles: true }));
            break;
          }
        }

        syncStateDisplay();
        applyCityStateVisibility();
      }

      syncCityDisplay();
      syncStateDisplay();
      applyCityStateVisibility();

      var lastZipLookedUp = "";

      function lookupZip(zip) {
        var cleanZip = (zip || "").trim();
        if (cleanZip.length < 5) return;
        if (cleanZip === lastZipLookedUp) return;
        lastZipLookedUp = cleanZip;

        fetch("https://api.zippopotam.us/us/" + encodeURIComponent(cleanZip))
          .then(function (response) {
            if (!response.ok) throw new Error("ZIP not found");
            return response.json();
          })
          .then(function (data) {
            if (!data || !data.places || !data.places.length) return;

            var place = data.places[0];
            var city = place["place name"] || "";
            var stateCode = place["state abbreviation"] || "";

            if (city) {
              cityInput.value = city;
              cityInput.dispatchEvent(new Event("input", { bubbles: true }));
              cityInput.dispatchEvent(new Event("change", { bubbles: true }));
              syncCityDisplay();
            }

            if (stateCode) setStateByCode(stateCode);
            else syncStateDisplay();

            applyCityStateVisibility();
          })
          .catch(function (err) {
            console.warn("[ZIP] Lookup failed:", err);
            applyCityStateVisibility();
          });
      }

      function readZipDigits() {
        return (zipInput.value || "").replace(/\D/g, "").slice(0, 9);
      }

      zipInput.addEventListener("input", function () {
        var v = readZipDigits();
        if (v.length < 5) {
          lastZipLookedUp = "";
          applyCityStateVisibility();
          return;
        }
        if (v.length === 5) lookupZip(v);
      });

      zipInput.addEventListener("blur", function () {
        var v = readZipDigits();
        if (v.length === 5) lookupZip(v);
      });

      cityInput.addEventListener("input", function () {
        syncCityDisplay();
        applyCityStateVisibility();
      });
      stateSelect.addEventListener("change", function () {
        syncStateDisplay();
        applyCityStateVisibility();
      });
    });
  })();

  /* ============================================================
     SECTION C — HIDDEN CONTENT VISIBILITY GUARD + MAC SAFE HOTKEY (ORIGINAL)
     ============================================================ */
  (function () {
    if (BNP.__HIDDEN_GUARD__) return;
    BNP.__HIDDEN_GUARD__ = true;

    onReady(function () {
      var c2 = document.getElementById("content2");
      var c3 = document.getElementById("content3");
      if (c2) c2.hidden = true;
      if (c3) c3.hidden = true;

      function matchesHotkey(e) {
        if (e.code !== "Period") return false;
        var ctrl = e.ctrlKey === true;
        var shiftOrAlt = e.shiftKey === true || e.altKey === true;
        return ctrl && shiftOrAlt;
      }

      function toggleHidden(id) {
        var el = document.getElementById(id);
        if (!el) return;
        el.hidden = !el.hidden;
      }

      document.addEventListener("keydown", function (e) {
        if (!matchesHotkey(e)) return;
        e.preventDefault();
        toggleHidden("content2");
        toggleHidden("content3");
        console.log("[Hotkey] Toggled #content2/#content3");
      }, true);
    });
  })();

  /* ============================================================
     SECTION D — FAQ ACCORDION (SINGLE-OPEN) (ORIGINAL)
     ============================================================ */
  (function () {
    if (BNP.__FAQ_ACCORDION__) return;
    BNP.__FAQ_ACCORDION__ = true;

    function bind() {
      var lists = document.querySelectorAll('.faq[data-accordion="true"]');
      lists.forEach(function (list) {
        if (list.dataset.__faqBound === "1") return;
        list.dataset.__faqBound = "1";

        list.addEventListener('toggle', function (e) {
          var d = e.target;
          if (!d || d.tagName.toLowerCase() !== 'details' || !d.open) return;
          list.querySelectorAll('details[open]').forEach(function (other) {
            if (other !== d) other.open = false;
          });
        }, true);
      });
    }

    onReady(bind);

    if (window.MutationObserver) {
      var mo = new MutationObserver(debounce(bind, 150));
      mo.observe(document.documentElement, { childList: true, subtree: true });
    }
  })();

  /* ============================================================
     SECTION E — ICON INJECTION (ORIGINAL)
     ============================================================ */
  (function () {
    if (BNP.__ICON_INJECT__) return;
    BNP.__ICON_INJECT__ = true;

    var ICONS = {
      checkCircle: "<svg viewBox='0 0 24 24' aria-hidden='true'><circle cx='12' cy='12' r='10' fill='#2E7D32'/><path d='M7.5 12.5l3 3L16.5 9.5' fill='none' stroke='#E8F5E9' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'/></svg>",
      envelope: "<svg viewBox='0 0 24 24' aria-hidden='true'><rect x='2' y='5' width='20' height='14' rx='2' fill='#42A5F5'/><path d='M3 7l9 6 9-6' fill='none' stroke='#E3F2FD' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg>",
      trophy: "<svg viewBox='0 0 24 24' aria-hidden='true'><path d='M6 6h12v3a5 5 0 01-5 5h-2a5 5 0 01-5-5V6z' fill='#FFC107'/><path d='M8 20h8v-2a3 3 0 00-3-3h-2a3 3 0 00-3 3v2z' fill='#BDBDBD'/><path d='M18 6h3a3 3 0 01-3 3V6zM6 6H3a3 3 0 003 3V6z' fill='#FFA000'/></svg>",
      newspaper: "<svg viewBox='0 0 24 24' aria-hidden='true'><rect x='3' y='5' width='18' height='14' rx='2' fill='#ECEFF1'/><rect x='5' y='7' width='7' height='6' rx='1' fill='#B0BEC5'/><rect x='13.5' y='7' width='5.5' height='2' rx='1' fill='#90A4AE'/><rect x='13.5' y='10' width='5.5' height='2' rx='1' fill='#90A4AE'/><rect x='5' y='14' width='14' height='3' rx='1.5' fill='#CFD8DC'/></svg>",
      arrowRight: "<svg viewBox='0 0 24 24' aria-hidden='true'><path d='M5 12h10' stroke='#FFFFFF' stroke-width='2' stroke-linecap='round'/><path d='M12 7l5 5-5 5' fill='none' stroke='#FFFFFF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg>"
    };

    function inject(el, svg, extraClass) {
      if (!el) return;
      el.classList.add("emoji");
      if (extraClass) el.classList.add(extraClass);
      el.innerHTML = svg;
    }
    function setText(el, t) { if (el) el.textContent = t; }

    function run() {
      var cards = document.querySelectorAll(".plans .card");
      if (cards.length < 4) return;

      var e0 = cards[0].querySelector(".eyebrow");
      if (e0) { setText(e0, "Great choice "); var i0 = document.createElement("span"); inject(i0, ICONS.checkCircle, "svg-eyebrow"); e0.appendChild(i0); }

      var e1 = cards[1].querySelector(".eyebrow");
      if (e1) { setText(e1, "Newsletter plus "); var i1 = document.createElement("span"); inject(i1, ICONS.envelope, "svg-eyebrow"); e1.appendChild(i1); }

      var e2 = cards[2].querySelector(".eyebrow");
      if (e2) { setText(e2, "Most popular "); var i2 = document.createElement("span"); inject(i2, ICONS.trophy, "svg-eyebrow"); e2.appendChild(i2); }

      var e3 = cards[3].querySelector(".eyebrow");
      if (e3) { setText(e3, "Best value with print "); var i3 = document.createElement("span"); inject(i3, ICONS.newspaper, "svg-eyebrow"); e3.appendChild(i3); }

      var btnArrows = document.querySelectorAll(".plans .card .btn .arrow");
      btnArrows.forEach(function (el) {
        inject(el, ICONS.arrowRight);
        el.style.width = "clamp(1.2em, 1em + 0.7vw, 1.9em)";
        el.style.height = "clamp(1.2em, 1em + 0.7vw, 1.9em)";
      });
    }

    onReady(run);
    if (window.MutationObserver) {
      var mo = new MutationObserver(debounce(run, 150));
      mo.observe(document.documentElement, { childList: true, subtree: true });
    }
  })();

  /* ============================================================
     SECTION F — TILE ALIGNMENT (ORIGINAL)
     ============================================================ */
  (function () {
    if (BNP.__TILE_ALIGN__) return;
    BNP.__TILE_ALIGN__ = true;

    var S = { cards: ".plans .card", h2: "h2", sub: ".sub", price: ".price", features: ".features" };

    function clearMinHeights(cards) {
      [S.h2, S.sub, S.price, S.features].forEach(function (sel) {
        cards.forEach(function (card) {
          var el = card.querySelector(sel);
          if (el) el.style.minHeight = "";
        });
      });
    }
    function maxHeight(els) {
      return Math.max.apply(null, [0].concat(els.map(function (el) { return el ? el.offsetHeight : 0; })));
    }
    function setMinHeight(els, h) {
      els.forEach(function (el) { if (el) el.style.minHeight = h + "px"; });
    }

    function alignTiles() {
      var cards = $all(S.cards);
      if (!cards.length) return;

      clearMinHeights(cards);
      void document.body.offsetHeight;

      var h2s = cards.map(function (c) { return c.querySelector(S.h2); }).filter(Boolean);
      var subs = cards.map(function (c) { return c.querySelector(S.sub); }).filter(Boolean);
      var prices = cards.map(function (c) { return c.querySelector(S.price); }).filter(Boolean);
      var feats = cards.map(function (c) { return c.querySelector(S.features); }).filter(Boolean);

      setMinHeight(h2s, maxHeight(h2s));
      setMinHeight(subs, maxHeight(subs));
      setMinHeight(prices, maxHeight(prices));
      setMinHeight(feats, maxHeight(feats));
    }

    var raf = null;
    function scheduleAlign() {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(alignTiles);
    }

    window.addEventListener("load", alignTiles, { passive: true });
    window.addEventListener("resize", scheduleAlign, { passive: true });

    if (typeof ResizeObserver !== "undefined") {
      var ro = new ResizeObserver(scheduleAlign);
      function hook() {
        $all(S.cards).forEach(function (card) {
          [S.price, S.features].forEach(function (sel) {
            var el = card.querySelector(sel);
            if (el) ro.observe(el);
          });
        });
      }
      onReady(hook);
      if (window.MutationObserver) {
        var mo = new MutationObserver(debounce(hook, 150));
        mo.observe(document.documentElement, { childList: true, subtree: true });
      }
    }

    if (typeof window.setAnnual === "function") {
      var origA = window.setAnnual;
      window.setAnnual = function () { origA(); scheduleAlign(); };
    }
    if (typeof window.setMonthly === "function") {
      var origM = window.setMonthly;
      window.setMonthly = function () { origM(); scheduleAlign(); };
    }
  })();

  /* ============================================================
     SECTION G — NEWSLETTER SYNC (ORIGINAL)
     ============================================================ */
  (function () {
    if (BNP.__NL_SYNC__) return;
    BNP.__NL_SYNC__ = true;

    function norm(str) {
      return (str || "")
        .toLowerCase()
        .replace(/&/g, " and ")
        .replace(/[-_/]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }

    function tokens(str) {
      var keep = new Set([
        "the","and","news","today","cut","hvac","hvacr","series",
        "homeowner","homeowners","engineering","distribution","trends",
        "frostlines","breaking","electrify","decarbonize","contractor","pro"
      ]);
      return norm(str)
        .split(/[^a-z0-9]+/)
        .filter(Boolean)
        .filter(function (t) { return t.length > 1 || keep.has(t); });
    }

    function scoreMatch(aTokens, bTokens) {
      var a = new Set(aTokens);
      var b = new Set(bTokens);
      var inter = 0;
      a.forEach(function (t) { if (b.has(t)) inter++; });
      var union = new Set([].concat(Array.from(a), Array.from(b))).size || 1;
      var score = inter / union;

      var aStr = aTokens.join(" ");
      var bStr = bTokens.join(" ");
      if (aStr && bStr && (aStr.indexOf(bStr) >= 0 || bStr.indexOf(aStr) >= 0)) score += 0.25;

      ["frostlines","distribution","trends","electrify","decarbonize","engineering","breaking"].forEach(function (t) {
        if (a.has(t) && b.has(t)) score += 0.15;
      });

      return score;
    }

    function findLabelForInput(id) {
      return document.querySelector('label[for="' + id + '"]');
    }

    function setStateLabel(toggleEl) {
      var wrap = toggleEl.closest(".nl-switch");
      if (!wrap) return;
      var state = wrap.querySelector(".state");
      if (state) state.textContent = toggleEl.checked ? "On" : "Off";
      wrap.classList.toggle("is-on", !!toggleEl.checked);
    }

    function syncFromHiddenToToggle(hiddenEl, toggleEl) {
      toggleEl.checked = !!hiddenEl.checked;
      setStateLabel(toggleEl);
    }

    function syncFromToggleToHidden(toggleEl, hiddenEl) {
      if (!hiddenEl) return;
      hiddenEl.checked = !!toggleEl.checked;
      hiddenEl.dispatchEvent(new Event("change", { bubbles: true }));
    }

    function bindPair(toggleEl, hiddenEl) {
      syncFromHiddenToToggle(hiddenEl, toggleEl);

      toggleEl.addEventListener("change", function () {
        syncFromToggleToHidden(toggleEl, hiddenEl);
        setStateLabel(toggleEl);
      });

      hiddenEl.addEventListener("change", function () {
        syncFromHiddenToToggle(hiddenEl, toggleEl);
      });

      if (window.MutationObserver) {
        var mo = new MutationObserver(function () {
          syncFromHiddenToToggle(hiddenEl, toggleEl);
        });
        mo.observe(hiddenEl, { attributes: true, attributeFilter: ["checked"] });
      }

      setStateLabel(toggleEl);
    }

    function buildHiddenIndex() {
      var hiddenInputs = Array.from(document.querySelectorAll(
        '.hidden-checkboxes input[type="checkbox"], .hidden-checkboxes input[type="radio"]'
      ));

      return hiddenInputs.map(function (inp) {
        var lbl = findLabelForInput(inp.id);
        var t = lbl ? lbl.textContent : (inp.name || inp.id || "");
        var cleaned = (t || "").replace(/^would you like a subscription to\s*/i, "");
        var cleaned2 = cleaned.replace(/^nl[-\s]*news[-\s]*/i, "");
        return { el: inp, raw: t, keyTokens: tokens(cleaned2) };
      });
    }

    function run() {
      var hiddenIndex = buildHiddenIndex();
      var toggles = Array.from(document.querySelectorAll('.nl-switch input[type="checkbox"]'));

      toggles.forEach(function (toggleEl) {
        if (toggleEl.dataset.__nlBound === "1") return;
        toggleEl.dataset.__nlBound = "1";

        var card = toggleEl.closest(".nl-card");
        var h4El = card ? card.querySelector("h4") : null;
        var imgEl = card ? card.querySelector("img") : null;

        var h4Text = h4El ? h4El.textContent : "";
        var imgAlt = imgEl ? imgEl.alt : "";
        var idGuess = (toggleEl.id || "")
          .replace(/^nl[-_]/i, "")
          .replace(/[-_]+/g, " ");

        var candidates = [
          { src: "h4", text: h4Text },
          { src: "alt", text: imgAlt },
          { src: "id", text: idGuess }
        ].filter(function (c) { return (c.text || "").trim().length > 0; });

        var tokenSets = candidates.map(function (c) { return tokens(c.text); });
        var mergedTokens = (tokenSets[0] || [])
          .concat(tokenSets[1] || [])
          .concat(tokenSets[2] || []);

        if (mergedTokens.length === 0) {
          setStateLabel(toggleEl);
          console.warn("[NL Sync] No identifiable title/alt/id for toggle", toggleEl);
          return;
        }

        var bestIdx = -1;
        var bestScore = -1;

        hiddenIndex.forEach(function (h, i) {
          var s = scoreMatch(mergedTokens, h.keyTokens);
          if (s > bestScore) { bestScore = s; bestIdx = i; }
        });

        var accept = bestScore >= 0.28 || (mergedTokens.length <= 2 && bestScore >= 0.2);
        if (!accept || bestIdx === -1) {
          setStateLabel(toggleEl);
          console.warn("[NL Sync] No hidden input matched for:", h4Text || idGuess, "bestScore=", bestScore.toFixed(3));
          return;
        }

        bindPair(toggleEl, hiddenIndex[bestIdx].el);
      });

      document.querySelectorAll('.nl-switch input[type="checkbox"]').forEach(setStateLabel);
    }

    onReady(run);
    if (window.MutationObserver) {
      var mo = new MutationObserver(debounce(run, 180));
      mo.observe(document.documentElement, { childList: true, subtree: true });
    }
  })();

  /* ============================================================
     SECTION H — FIX ACTION BAR BUTTON ALIGNMENT & SIZE (ORIGINAL)
     ============================================================ */
  (function () {
    if (BNP.__ACTION_BAR_FIX__) return;
    BNP.__ACTION_BAR_FIX__ = true;

    onReady(function () {
      function fixActionBars() {
        document.querySelectorAll(".nl-actions").forEach(function (bar) {
          var backBtn = bar.querySelector(".btn-back");
          var nextBtn = bar.querySelector(".btn-next");

          if (bar && backBtn && nextBtn) {
            bar.style.display = "flex";
            bar.style.alignItems = "center";

            backBtn.style.margin = "0";
            nextBtn.style.margin = "0 0 0 auto";

            [backBtn, nextBtn].forEach(function (btn) {
              btn.style.padding = "10px 16px";
              btn.style.fontSize = "1rem";
              btn.style.lineHeight = "1.3";
              btn.style.borderRadius = "6px";
            });
          }
        });
      }

      fixActionBars();
      if (window.MutationObserver) {
        var observer = new MutationObserver(debounce(fixActionBars, 150));
        observer.observe(document.body, { childList: true, subtree: true });
      }
    });
  })();

  /* ============================================================
     SECTION I — WIZARD VISIBILITY GUARD (PAYMENT-SAFE) (ORIGINAL)
     ============================================================ */
  (function () {
    if (BNP.__WIZ_VIS_GUARD__) return;
    BNP.__WIZ_VIS_GUARD__ = true;

    function looksLikePaymentStep(el) {
      if (!el) return false;
      return !!(
        el.querySelector('iframe[src*="stripe"]') ||
        el.querySelector('[id*="stripe"], [class*="stripe"]') ||
        el.querySelector('[name*="credit"], [name*="card"], [id*="credit"], [id*="card"]') ||
        el.querySelector('[data-payment], .payment, #payment')
      );
    }

    onReady(function () {
      var plans = document.querySelector('section.plans[aria-label="Plans"]');
      var compare = document.querySelector('section.compare[aria-label="Compare features"]');
      var newsletters = document.querySelector('section[aria-label="Newsletters"]');
      var content1 = document.getElementById("content1");
      var content4 = document.getElementById("content4");
      var content6 = document.getElementById("content6");

      var running = false;

      function enforceVisibility() {
        if (running) return;
        running = true;

        try {
          if (plans && compare) {
            if (!isVisible(plans)) compare.style.display = "none";
          }

          var steps = [newsletters, content1, content4, content6].filter(Boolean);
          var visibleSteps = steps.filter(isVisible);

          if (!visibleSteps.length) return;

          if (content6 && isVisible(content6)) return;
          if (content6 && looksLikePaymentStep(content6) && isVisible(content6)) return;

          if (visibleSteps.length > 1) {
            var active = null;
            try {
              var ae = document.activeElement;
              if (ae) active = visibleSteps.find(function (s) { return s.contains(ae); }) || null;
            } catch (e) {}

            if (!active) active = visibleSteps[visibleSteps.length - 1];

            visibleSteps.forEach(function (s) {
              if (s !== active) s.style.display = "none";
            });
          }
        } finally {
          running = false;
        }
      }

      enforceVisibility();

      if (window.MutationObserver) {
        var observer = new MutationObserver(debounce(enforceVisibility, 120));
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ["style", "class"]
        });
      }

      window.addEventListener("resize", enforceVisibility);
    });
  })();

  /* ============================================================
     SECTION J — MOBILE NL CARD PATCH (ORIGINAL)
     ============================================================ */
  (function () {
    if (BNP.__MOBILE_NL_PATCH__) return;
    BNP.__MOBILE_NL_PATCH__ = true;

    var MOBILE_MAX = 600;
    var STYLE_ID = "nl-compact-hardlock";

    function hasPlanSelected() {
      return !!(
        document.querySelector(".plans .card.__selected") ||
        document.querySelector(".plans input[type=radio]:checked") ||
        document.body.classList.contains("nl-ready") ||
        document.querySelector(".nl-grid[data-ready='1']") ||
        document.querySelector("[data-plan-selected='1']")
      );
    }

    function showInline(el) { if (el) el.style.setProperty("display", "inline-block", "important"); }
    function hideEl(el) { if (el) el.style.setProperty("display", "none", "important"); }

    function injectStyles() {
      if (document.getElementById(STYLE_ID)) return;

      var css =
        ".nl-card.__compact{display:grid;grid-template-columns:56px 1fr;align-items:start;gap:10px;padding:10px;border:1px solid var(--border,rgba(0,0,0,.12));border-radius:12px;background:var(--bg,#fff);box-shadow:var(--shadow,0 1px 2px rgba(0,0,0,.06));overflow:hidden}" +
        ".nl-card.__compact img{width:56px;height:56px;object-fit:cover;border-radius:8px;border:1px solid var(--border,rgba(0,0,0,.08));display:block;grid-row:1 / span 3}" +
        ".nl-card.__compact h4,.nl-card.__compact p{grid-column:2 / -1;display:block !important}" +
        ".nl-card.__compact h4{margin:0 0 2px;font-weight:700;font-size:14px;line-height:1.15;letter-spacing:-.01em}" +
        ".nl-card.__compact p{margin:0 0 6px;font-size:12px;line-height:1.3;color:var(--muted,#5b6573);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}" +
        ".nl-card.__compact .nl-cta{grid-column:2 / -1;justify-self:center;margin-top:2px;padding:8px 12px;border:1px solid var(--border,rgba(0,0,0,.12));border-radius:12px;box-sizing:border-box;overflow:hidden}" +
        ".nl-card.__compact .nl-cta-inner{display:flex;align-items:center;justify-content:center;gap:10px;margin:0 auto;white-space:nowrap}" +
        ".nl-card.__compact .nl-switch{display:inline-flex;align-items:center;gap:10px}" +
        ".nl-card.__compact .nl-switch input[type=checkbox]{position:absolute;opacity:0;pointer-events:none}" +
        ".nl-card.__compact .nl-switch .track{position:relative;width:36px;height:20px;border-radius:999px;background:#d4d7de;overflow:hidden;display:inline-block;vertical-align:middle;box-sizing:content-box}" +
        ".nl-card.__compact .nl-switch .knob{position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.15);transition:transform .2s}" +
        ".nl-card.__compact .nl-switch input[type=checkbox]:checked + .track{background:var(--brand,#c8102e)}" +
        ".nl-card.__compact .nl-switch input[type=checkbox]:checked + .track .knob{transform:translateX(calc(100% - 18px))}" +
        ".nl-card.__compact .nl-switch .label,.nl-card.__compact .nl-switch .state{font-size:12px;line-height:1}" +
        ".nl-card.__compact .nl-cta,.nl-card.__compact{contain:layout paint}";

      var el = document.createElement("style");
      el.id = STYLE_ID;
      el.textContent = css;
      document.head.appendChild(el);
    }

    function measureText(t, refEl) {
      var probe = document.createElement("span");
      var cs = window.getComputedStyle(refEl);
      probe.textContent = t;
      probe.style.position = "absolute";
      probe.style.visibility = "hidden";
      probe.style.whiteSpace = "nowrap";
      probe.style.fontFamily = cs.fontFamily;
      probe.style.fontSize = cs.fontSize;
      probe.style.fontWeight = cs.fontWeight;
      probe.style.letterSpacing = cs.letterSpacing;
      probe.style.lineHeight = "1";
      document.body.appendChild(probe);
      var w = Math.ceil(probe.getBoundingClientRect().width);
      document.body.removeChild(probe);
      return w;
    }

    function ensureInnerLane(cta) {
      var existing = cta.querySelector(".nl-cta-inner");
      if (existing) return existing;

      var wrap = document.createElement("div");
      wrap.className = "nl-cta-inner";

      var first = cta.firstChild;
      cta.insertBefore(wrap, first);

      while (cta.childNodes.length > 1) wrap.appendChild(cta.childNodes[1]);
      return wrap;
    }

    function compactCard(card) {
      if (card.classList.contains("__compact")) return;
      var cta = card.querySelector(".nl-cta");
      if (!cta) return;

      if (!cta.dataset.origStyle) cta.dataset.origStyle = cta.getAttribute("style") || "";
      ensureInnerLane(cta);
      card.classList.add("__compact");
    }

    function restoreCard(card) {
      if (!card.classList.contains("__compact")) return;
      card.classList.remove("__compact");

      var cta = card.querySelector(".nl-cta");
      if (cta && cta.dataset.origStyle !== undefined) {
        if (cta.dataset.origStyle) cta.setAttribute("style", cta.dataset.origStyle);
        else cta.removeAttribute("style");
      }
    }

    function layoutCTA(cta) {
      var inner = cta.querySelector(".nl-cta-inner") || ensureInnerLane(cta);
      var label = inner.querySelector(".label");
      var state = inner.querySelector(".state");
      var track = inner.querySelector(".track");
      if (!label || !state || !track) return;

      var maxState = Math.max(measureText("On", state), measureText("Off", state));
      state.style.display = "inline-block";
      state.style.width = (maxState + 2) + "px";

      var labelW = Math.ceil(label.getBoundingClientRect().width);
      var lane = labelW + 10 + 36 + 10 + (maxState + 2);
      inner.style.width = lane + "px";
      inner.style.maxWidth = lane + "px";

      track.style.width = "36px";
      track.style.height = "20px";
      track.style.overflow = "hidden";
    }

    function applyMode() {
      var isMobile = window.innerWidth <= MOBILE_MAX;
      var ready = hasPlanSelected();
      var cards = document.querySelectorAll(".nl-grid .nl-card");

      cards.forEach(function (card) {
        var cta = card.querySelector(".nl-cta");
        if (!cta) return;

        if (isMobile) {
          compactCard(card);
          if (ready) {
            showInline(cta);
            layoutCTA(cta);
          } else {
            hideEl(cta);
          }
        } else {
          restoreCard(card);
          if (!ready) hideEl(cta);
          else cta.style.removeProperty("display");
        }
      });
    }

    function wirePlanWatchers() {
      document.addEventListener("click", function (e) {
        var card = e.target && e.target.closest ? e.target.closest(".plans .card") : null;
        if (card) {
          document.body.classList.add("nl-ready");
          setTimeout(applyMode, 0);
        }
      }, true);

      document.addEventListener("change", function (e) {
        var t = e.target;
        if (!t || !t.matches) return;
        if (
          t.matches(".plans input[type=radio]") ||
          t.matches(".plans select") ||
          t.matches("[name*='PLAN']") ||
          t.matches("[name*='plan']")
        ) {
          setTimeout(applyMode, 0);
        }
      }, true);
    }

    function init() {
      injectStyles();
      applyMode();
      wirePlanWatchers();
      window.addEventListener("resize", applyMode, { passive: true });
      document.addEventListener("nl:ready", applyMode);
    }

    onReady(init);
  })();

  /* ============================================================
     SECTION K — COMPACT CHECKBOXES (ORIGINAL)
     ============================================================ */
  (function () {
    if (BNP.__COMPACT_CHECKBOXES__) return;
    BNP.__COMPACT_CHECKBOXES__ = true;

    var SCALE = 0.70;
    var GAP = 8;
    var NUDGE = -2;
    var EXCLUDE_SELECTOR = ".nl-switch, .toggle, .switch, [data-compact='off']";
    var IS_FIREFOX = typeof InstallTrigger !== "undefined";

    function ensureWrapper(cb) {
      var wrap = cb.closest ? cb.closest("[data-compact-wrap]") : null;
      if (!wrap) {
        wrap = document.createElement("span");
        wrap.setAttribute("data-compact-wrap", "1");
        wrap.style.display = "inline-flex";
        wrap.style.alignItems = "center";
        wrap.style.gap = GAP + "px";
        wrap.style.lineHeight = "1.3";
        cb.parentNode.insertBefore(wrap, cb);
        wrap.appendChild(cb);
      }
      return wrap;
    }

    function styleCheckbox(cb) {
      if (!cb || cb.type !== "checkbox") return;
      if (cb.dataset.compactApplied === "1") return;
      if ((cb.matches && cb.matches(EXCLUDE_SELECTOR)) || (cb.closest && cb.closest(EXCLUDE_SELECTOR))) return;

      var wrap = ensureWrapper(cb);

      cb.style.setProperty("transform", "scale(" + SCALE + ")", "important");
      cb.style.setProperty("transform-origin", "left center", "important");
      cb.style.setProperty("margin-right", "0", "important");
      cb.style.setProperty("vertical-align", NUDGE + "px", "important");

      if (!IS_FIREFOX) {
        try { cb.style.setProperty("zoom", String(SCALE), "important"); } catch (e) {}
      } else {
        wrap.style.paddingLeft = "0px";
      }

      try { cb.style.setProperty("accent-color", "var(--brand, #C8102E)", "important"); } catch (e) {}
      cb.style.setProperty("font-size", "12px", "important");

      var lbl = null;
      if (cb.id) lbl = document.querySelector('label[for="' + cb.id + '"]');
      if (!lbl) lbl = cb.closest ? cb.closest("label") : null;

      if (lbl) {
        lbl.style.setProperty("display", "inline", "important");
        lbl.style.setProperty("font-size", "12px", "important");
        lbl.style.setProperty("line-height", "1.2", "important");
        lbl.style.setProperty("margin", "0", "important");
        lbl.style.setProperty("cursor", "pointer", "important");
      }

      var outer = cb.closest ? cb.closest("p, div") : null;
      if (outer) {
        outer.style.setProperty("font-size", "12px", "important");
        outer.style.setProperty("line-height", "1.4", "important");
      }

      cb.dataset.compactApplied = "1";
    }

    function run(root) {
      (root || document).querySelectorAll('input[type="checkbox"]').forEach(styleCheckbox);
    }

    onReady(function () { run(); });

    if (window.MutationObserver) {
      var mo = new MutationObserver(function (mutations) {
        mutations.forEach(function (m) {
          (m.addedNodes || []).forEach(function (node) {
            if (!node || node.nodeType !== 1) return;
            if (node.matches && node.matches('input[type="checkbox"]')) styleCheckbox(node);
            else run(node);
          });

          if (m.type === "attributes" && m.target && m.target.matches && m.target.matches('input[type="checkbox"]')) {
            m.target.dataset.compactApplied = "";
            styleCheckbox(m.target);
          }
        });
      });

      mo.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["style", "class"]
      });
    }

    setInterval(function () { run(); }, 1200);
  })();

  /* ============================================================
     SECTION L — HERO BACKGROUND (ORIGINAL)
     ============================================================ */
  (function () {
    if (BNP.__HERO_BG__) return;
    BNP.__HERO_BG__ = true;

    onReady(function () {
      var plans = document.querySelector("section.plans");
      if (!plans) return;

      var bg = document.createElement("div");
      bg.style.position = "absolute";
      bg.style.left = "0";
      bg.style.width = "100%";
      bg.style.zIndex = "-1";
      bg.style.overflow = "hidden";
      bg.style.pointerEvents = "none";
      bg.style.fontSize = "80px";

      bg.innerHTML =
        "<i class='bi bi-snow' style='position:absolute;color:#00AEEF;opacity:0.25;'></i>" +
        "<i class='bi bi-thermometer-half' style='position:absolute;color:#E63946;opacity:0.25;'></i>" +
        "<i class='bi bi-fan' style='position:absolute;color:#6C757D;opacity:0.25;'></i>" +
        "<i class='bi bi-wrench-adjustable' style='position:absolute;color:#FF8C42;opacity:0.25;'></i>";

      document.body.appendChild(bg);

      var icons = Array.from(bg.children).map(function (el, i) {
        return {
          el: el,
          x: 200 * i,
          y: 150 * i,
          dx: (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random()),
          dy: (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random())
        };
      });

      function animate() {
        var width = window.innerWidth;
        var height = bg.offsetHeight || window.innerHeight;

        icons.forEach(function (icon) {
          icon.x += icon.dx;
          icon.y += icon.dy;

          if (icon.x < 0 || icon.x > width - 100) icon.dx *= -1;
          if (icon.y < 0 || icon.y > height - 100) icon.dy *= -1;

          icon.el.style.transform = "translate(" + icon.x + "px, " + icon.y + "px)";
        });

        requestAnimationFrame(animate);
      }

      function updateBg() {
        var rect = plans.getBoundingClientRect();
        bg.style.top = (window.scrollY + rect.top - 200) + "px";
        bg.style.height = (rect.height + 400) + "px";
      }

      updateBg();
      window.addEventListener("resize", updateBg);
      window.addEventListener("scroll", updateBg);

      animate();
    });
  })();

  /* ============================================================
     SECTION M — FULL SUBSCRIBE + PRICING ORCHESTRATOR (NO GEO)
     ============================================================ */
  (function () {
    if (BNP.__ORCH1__) return;
    BNP.__ORCH1__ = true;

    function hide(el) {
      if (!el) return;

      if (!el.dataset.__prevDisplayCaptured) {
        el.dataset.__prevDisplayCaptured = "1";
        var inline = (el.style && el.style.display) ? el.style.display : "";
        var computed = getComputedStyle(el).display || "";
        if (inline && inline !== "none") el.dataset.__prevDisplay = inline;
        else if (computed && computed !== "none") el.dataset.__prevDisplay = computed;
      }
      el.style.display = "none";
    }

    function show(el) {
      if (!el) return;

      var prev = el.dataset && el.dataset.__prevDisplay;
      if (prev && prev !== "none") {
        el.style.display = prev;
        return;
      }

      if (el.matches("section.plans, section.compare, section.hero")) {
        el.style.removeProperty("display");
        return;
      }

      if (
        el.matches("#content1, #content4, #content6, section[aria-label='Newsletters']") ||
        /^content(1|4|6)$/.test(el.id || "")
      ) {
        el.style.display = "block";
        return;
      }

      el.style.removeProperty("display");
      if (getComputedStyle(el).display === "none") el.style.display = "block";
    }

    function scrollToHeaderNow() {
      try { window.scrollTo({ top: 0, behavior: "auto" }); } catch (e) {}
    }

    // ---------- STRONG REQUIRED VALIDATION (NEW) ----------
    function ensureValidationStyles() {
      if (document.getElementById("bnp-required-style")) return;
      var s = document.createElement("style");
      s.id = "bnp-required-style";
      s.textContent = `
        .bnp-invalid { outline: 2px solid rgba(180,0,0,.35) !important; outline-offset: 4px; border-radius: 6px; }
        .bnp-invalid input, .bnp-invalid select, .bnp-invalid textarea { border-color: #b00000 !important; }
      `;
      document.head.appendChild(s);
    }

    function clearInvalidMarks(stepRoot) {
      if (!stepRoot) return;
      $all(".bnp-invalid", stepRoot).forEach(function (n) { n.classList.remove("bnp-invalid"); });
    }

    function closestQuestionBlock(el, stepRoot) {
      if (!el) return null;
      return (
        el.closest("p[id^='p']") ||
        el.closest(".drg-element") ||
        el.closest(".form-group") ||
        el.closest(".question") ||
        (stepRoot || document).querySelector("p[id^='p']")
      );
    }

    function isEmptyValue(v) {
      return !String(v == null ? "" : v).trim();
    }

    function validateQuestionBlock(block) {
      if (!block) return { ok: true };

      var fields = $all("input, select, textarea", block).filter(function (el) {
        if (!el) return false;
        if (!isFieldVisible(el)) return false;
        return true;
      });

      if (!fields.length) return { ok: true };

      // If there is ANY checked radio/checkbox in the block, it's ok.
      var radios = fields.filter(function (f) { return f.type === "radio"; });
      if (radios.length) {
        var anyChecked = radios.some(function (r) { return r.checked; });
        return { ok: anyChecked, focusEl: (radios[0] || null) };
      }

      var cbs = fields.filter(function (f) { return f.type === "checkbox"; });
      if (cbs.length) {
        var anyCb = cbs.some(function (c) { return c.checked; });
        return { ok: anyCb, focusEl: (cbs[0] || null) };
      }

      // Otherwise check text/select/textarea
      for (var i = 0; i < fields.length; i++) {
        var f = fields[i];
        if (f.tagName === "SELECT") {
          if (isEmptyValue(f.value)) return { ok: false, focusEl: f };
        } else if (f.type === "email" || f.type === "text" || f.type === "tel" || f.type === "number" || f.type === "password" || f.tagName === "TEXTAREA") {
          if (isEmptyValue(f.value)) return { ok: false, focusEl: f };
        } else {
          // fallback
          if ("value" in f && isEmptyValue(f.value)) return { ok: false, focusEl: f };
        }
      }
      return { ok: true };
    }

    function validateStep(stepId) {
      ensureValidationStyles();

      var root = document.getElementById(stepId);
      if (!root) return { ok: true };

      clearInvalidMarks(root);

      // 1) HTML5 required attr pass
      var required = $all("input[required], select[required], textarea[required]", root).filter(function (el) {
        if (!el || el.disabled) return false;
        if (!isFieldVisible(el)) return false;
        return true;
      });

      for (var i = 0; i < required.length; i++) {
        var el = required[i];
        if (el.type === "radio" && el.name) {
          var any = $all('input[type="radio"][name="' + el.name + '"]', root).filter(isFieldVisible).some(function (r) { return r.checked; });
          if (!any) {
            var b1 = closestQuestionBlock(el, root) || el;
            if (b1 && b1.classList) b1.classList.add("bnp-invalid");
            return { ok: false, focusEl: el };
          }
        } else if (el.type === "checkbox") {
          if (!el.checked) {
            var b2 = closestQuestionBlock(el, root) || el;
            if (b2 && b2.classList) b2.classList.add("bnp-invalid");
            return { ok: false, focusEl: el };
          }
        } else {
          if (isEmptyValue(el.value)) {
            var b3 = closestQuestionBlock(el, root) || el;
            if (b3 && b3.classList) b3.classList.add("bnp-invalid");
            return { ok: false, focusEl: el };
          }
        }
      }

      // 2) DragonForms "required star" pass
      var starNodes = $all(".req-star, .reqStar, .required-star", root);
      var blocks = [];
      var seen = new Set();

      starNodes.forEach(function (s) {
        var block =
          (s.closest && (s.closest("p[id^='p']") || s.closest(".drg-element") || s.closest(".form-group") || s.closest(".question"))) ||
          null;
        if (block && !seen.has(block)) {
          seen.add(block);
          blocks.push(block);
        }
      });

      for (var j = 0; j < blocks.length; j++) {
        var b = blocks[j];
        // Skip blocks that are not visible
        if (!isVisible(b)) continue;

        var res = validateQuestionBlock(b);
        if (!res.ok) {
          if (b.classList) b.classList.add("bnp-invalid");
          return { ok: false, focusEl: res.focusEl || (b.querySelector("input,select,textarea") || b) };
        }
      }

      return { ok: true };
    }

    var COUNTRY_DROPDOWN_ID = "#id7";
    var WRAPPER_SELECTORS = [
      ".campaign-placeholder",
      ".standard-rates",
      ".promo-key",
      ".requested-version",
      ".achr-requested-version",
      ".wc-requested-version"
    ];

    var CACHE = (BNP.__CACHE__ = BNP.__CACHE__ || { region: "usa", period: "yearly", rates: null, product: null });

    function ensureStylesAndBackdrop() {
      if (!document.getElementById("focus-style-override")) {
        var s = document.createElement("style");
        s.id = "focus-style-override";
        s.textContent = `
          input, select, textarea { border: 1px solid #ccc !important; box-shadow: none !important; }
          input:focus, select:focus, textarea:focus {
            outline: none !important;
            border: 2px solid #0072B4 !important;
            box-shadow: 0 0 6px rgba(0,114,180,.6) !important;
          }

          #modal-backdrop{
            position:fixed;inset:0;
            background:rgba(14,17,22,.45);
            backdrop-filter:blur(2px);
            z-index:9998;
            display:none;
            pointer-events:auto;
          }

          html.payment-open, body.payment-open { overflow:hidden !important; }

          #content6.payment-preload-hidden{
            display:block !important;
            position:absolute !important;
            left:-10000px !important;
            top:auto !important;
            width:1px !important;
            height:1px !important;
            overflow:hidden !important;
            visibility:hidden !important;
            pointer-events:none !important;
          }

          #content6.modal-open{
            display:block !important;
            position:fixed !important;
            z-index:9999 !important;
            top:50% !important;
            left:50% !important;
            transform:translate(-50%,-50%) !important;
            width:min(900px,92vw) !important;
            max-width:900px !important;
            max-height:90vh !important;
            overflow:auto !important;
            background:#fff !important;
            border-radius:16px !important;
            box-shadow:0 24px 60px rgba(0,0,0,.25) !important;
            padding:20px !important;
            -webkit-overflow-scrolling:touch;
            visibility:visible !important;
            pointer-events:auto !important;
          }

          html.payment-open footer,
          html.payment-open .footer,
          body.payment-open footer,
          body.payment-open .footer { display:none !important; }
        `;
        document.head.appendChild(s);
      }

      if (!document.getElementById("modal-backdrop")) {
        var b = document.createElement("div");
        b.id = "modal-backdrop";
        document.body.appendChild(b);
      }
    }

    function emptyMap() {
      return {
        digital: { monthly: null, yearly: null },
        chill: { monthly: null, yearly: null },
        print: { usa: { monthly: null, yearly: null }, can: { monthly: null, yearly: null }, int: { monthly: null, yearly: null } }
      };
    }

    function findCampaignCandidates() {
      var list = [];
      WRAPPER_SELECTORS.forEach(function (sel) { var n = $(sel); if (n) list.push(n); });
      $all("[id^='campaignPlaceholder_'], [id*='campaignPlaceholder']").forEach(function (n) { list.push(n); });
      $all("#campaignPricingSuccess, .paidElementProduct3309").forEach(function (h) {
        var n = h.closest("div,section,form") || h.parentElement;
        if (n) list.push(n);
      });

      var seen = new Set(), out = [];
      list.forEach(function (n) { if (n && !seen.has(n)) { seen.add(n); out.push(n); } });
      return out;
    }

    function parseCampaignRates(root) {
      var map = emptyMap();
      if (!root) return map;

      $all("li", root).forEach(function (li) {
        var input = li.querySelector("input[type='radio']");
        if (!input) return;

        var cls = (li.className || "") + " " + (input.className || "");
        var isDigital = /\bDprod\b/i.test(cls);
        var isPrint = /\bPprod\b/i.test(cls);
        var isChill = /\bAprod\b/i.test(cls);
        if (!isDigital && !isPrint && !isChill) return;

        var region = /\bCANprod\b/i.test(cls) ? "can" : /\bINTprod\b/i.test(cls) ? "int" : "usa";
        var per = /\bterm2\b/i.test(cls) || /\bterm3\b/i.test(cls) ? "monthly" : /\bterm26\b/i.test(cls) ? "yearly" : null;

        var labelEl =
          (input.id && root.querySelector("label[for='" + input.id + "']")) ||
          li.querySelector("label") ||
          null;

        var raw = labelEl ? text(labelEl) : text(li);
        var priceNum = moneyFromString(raw);
        if (priceNum == null) return;

        if (isDigital) {
          if (per) map.digital[per] = priceNum;
          else map.digital.yearly = (map.digital.yearly == null ? priceNum : map.digital.yearly);
        } else if (isPrint) {
          if (per) map.print[region][per] = priceNum;
          else map.print[region].yearly = (map.print[region].yearly == null ? priceNum : map.print[region].yearly);
        } else if (isChill) {
          if (per) map.chill[per] = priceNum;
          else map.chill.yearly = (map.chill.yearly == null ? priceNum : map.chill.yearly);
        }
      });

      return map;
    }

    function bestRatesNow() {
      var candidates = findCampaignCandidates();
      for (var i = 0; i < candidates.length; i++) {
        var c = candidates[i];
        var ok = $("#campaignPricingSuccess", c);
        if (ok && ("" + ok.value).toLowerCase() === "true") return parseCampaignRates(c);
      }
      var std = $(".standard-rates") || document.body;
      return parseCampaignRates(std);
    }

    function currentPeriod() {
      var seg = document.getElementById("billingSeg");
      var mode = seg && seg.dataset && seg.dataset.active;

      if (mode === "monthly") return "monthly";
      if (mode === "annual") return "yearly";

      var per = (
        (document.getElementById("chillPer") && document.getElementById("chillPer").textContent) ||
        (document.getElementById("proPer") && document.getElementById("proPer").textContent) ||
        (document.getElementById("plusPer") && document.getElementById("plusPer").textContent) ||
        ""
      ).toLowerCase();

      return /\bmo\b/.test(per) ? "monthly" : "yearly";
    }

    function tileKindFromCard(card) {
      var t = ((card.querySelector("h2,h3,h4") && card.querySelector("h2,h3,h4").textContent) || "").toLowerCase();
      if (/free/.test(t)) return "free";
      if (/fan only/.test(t)) return "fan";
      if (/chill/.test(t)) return "chill";
      if (/ac\s*pro\s*\+\s*print|print/.test(t)) return "print";
      return "digital";
    }

    function applyRatesToTiles(rates) {
      var period = currentPeriod();
      var region = CACHE.region || "usa";

      $all("section.plans .card, section.plans article").forEach(function (tile) {
        var amountEl = tile.querySelector(".price .amount");
        var perEl = tile.querySelector(".price .per");
        if (!amountEl || !perEl) return;

        var kind = tileKindFromCard(tile);
        if (kind === "free" || kind === "fan") return;

        var price = null;
        if (kind === "chill") price = rates.chill[period];
        else if (kind === "print") {
          price =
            (rates.print[region] && rates.print[region][period]) ||
            rates.print.usa[period] ||
            rates.print.can[period] ||
            rates.print.int[period];
        } else price = rates.digital[period];

        if (price != null) {
          amountEl.textContent = formatMoney(price);
          perEl.textContent = period === "monthly" ? "/ mo" : "/ yr";
        }
      });
    }

    function applyPricesNow() {
      try {
        CACHE.period = currentPeriod();
        CACHE.rates = bestRatesNow();
        if (CACHE.rates) applyRatesToTiles(CACHE.rates);
      } catch (e) {
        console.warn("applyPricesNow error:", e);
      }
    }

    function initCountryListener() {
      var ALERT_ID = "country-change-msg";

      function detectRegionFromLabel(label) {
        var lower = (label || "").toLowerCase();
        if (lower.includes("united states")) return "usa";
        if (lower.includes("canada")) return "can";
        return "int";
      }

      function alertMsg(msg) {
        var s = document.getElementById(ALERT_ID);
        if (!s) {
          s = document.createElement("small");
          s.id = ALERT_ID;
          s.style.display = "block";
        }
        s.textContent = msg;
        s.style.display = "block";

        var sel = document.querySelector(COUNTRY_DROPDOWN_ID);
        if (sel) {
          (sel.closest("p,.drg-element") || sel.parentNode).insertBefore(s, sel);
        }

        clearTimeout(s._timeout);
        s._timeout = setTimeout(function () { s.style.display = "none"; }, 2200);
      }

      var sel = document.querySelector(COUNTRY_DROPDOWN_ID);
      if (!sel) return;

      function applyFromSelect() {
        var label = sel.options[sel.selectedIndex] ? sel.options[sel.selectedIndex].textContent : "";
        CACHE.region = detectRegionFromLabel(label);

        applyPricesNow();
        if (typeof window.__FORCE_CART_SYNC === "function") window.__FORCE_CART_SYNC();

        alertMsg(
          "Pricing updated for " +
          (CACHE.region === "usa" ? "United States" : CACHE.region === "can" ? "Canada" : "International") +
          "."
        );
      }

      sel.addEventListener("change", function () { setTimeout(applyFromSelect, 40); });
      setTimeout(applyFromSelect, 10);
    }

    function initPromoUI() {
      var FIELD_ID = "id49";
      var BAR_ID = "promo-code-ui";
      var INPUT_ID = "promo-code-input";
      var SAVE_ID = "promo-code-save";
      var CLEAR_ID = "promo-code-clear";
      var MSG_ID = "promo-msg";

      function toast(msg, ok) {
        var s = document.getElementById(MSG_ID);
        if (!s) { s = document.createElement("small"); s.id = MSG_ID; }
        s.textContent = msg;
        s.style.cssText = "display:block;margin-top:6px;color:" + (ok ? "#0a6" : "#b00") + ";font-weight:600";
        var host = document.getElementById(BAR_ID) || document.body;
        host.appendChild(s);
        setTimeout(function () { if (s) s.style.display = "none"; }, 2500);
      }

      var field = document.getElementById(FIELD_ID);
      var bar = document.getElementById(BAR_ID);
      var input = document.getElementById(INPUT_ID);
      var btn = document.getElementById(SAVE_ID);
      var clr = document.getElementById(CLEAR_ID);

      if (!field || !bar || !input || !btn) return;

      function apply(val) {
        field.value = val || "";
        field.dispatchEvent(new Event("input", { bubbles: true }));
        field.dispatchEvent(new Event("change", { bubbles: true }));
        field.blur();
        setTimeout(function () {
          applyPricesNow();
          if (typeof window.__FORCE_CART_SYNC === "function") window.__FORCE_CART_SYNC();
        }, 180);
      }

      btn.addEventListener("click", function () {
        var v = input.value.trim();
        apply(v);
        toast(v ? "Promo applied: " + v : "Promo cleared.", true);
      });

      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          btn.click();
        }
      });

      if (clr) clr.addEventListener("click", function () {
        input.value = "";
        btn.click();
      });
    }

    function initBillingToggle() {
      var seg = document.getElementById("billingSeg");
      var annualBtn = document.getElementById("annualBtn");
      var monthlyBtn = document.getElementById("monthlyBtn");

      function setPeriod(p) {
        CACHE.period = p === "monthly" ? "monthly" : "yearly";
        if (seg) seg.dataset.active = p === "monthly" ? "monthly" : "annual";
        applyPricesNow();
        if (typeof window.__FORCE_CART_SYNC === "function") window.__FORCE_CART_SYNC();
      }

      if (annualBtn) annualBtn.addEventListener("click", function () { setPeriod("yearly"); });
      if (monthlyBtn) monthlyBtn.addEventListener("click", function () { setPeriod("monthly"); });

      var prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!prefersReduced && "IntersectionObserver" in window) {
        var obs = new IntersectionObserver(function (entries, io) {
          entries.forEach(function (e) {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              io.unobserve(e.target);
            }
          });
        }, { threshold: 0.08 });

        $all(".card.reveal, .card").forEach(function (el) { obs.observe(el); });
      } else {
        $all(".card").forEach(function (el) { el.classList.add("in"); });
      }

      var y = document.getElementById("year");
      if (y) y.textContent = new Date().getFullYear();
    }

    /* ---------- Requested Version (ACHR vs Weekly Chill) ---------- */
    var __RV_HOSTS_CACHE = null;

    function _normRVLabel(s) {
      return (s || "")
        .toLowerCase()
        .replace(/\u00a0/g, " ")
        .replace(/\s+/g, " ")
        .replace(/[.:]+$/g, "")
        .trim();
    }

    function _wantRVLabel(kind) {
      var k = _normRVLabel(kind);
      if (k === "none" || k === "do not want" || k === "donotwant") return "do not want";
      if (k === "print") return "print";
      if (k === "digital") return "digital";
      if (k === "both") return "both";
      if (k === "no preference" || k === "nopreference") return "no preference";
      return k;
    }

    function _pickRequestedVersionHost(hostEl, kind) {
      if (!hostEl) return false;

      var want = _wantRVLabel(kind);

      // Prefer labels (more stable), but fall back to any radios
      var radios = $all("input[type='radio']", hostEl);
      if (!radios.length) return false;

      function labelForRadio(r) {
        if (!r) return null;
        var lbl = null;
        if (r.id) lbl = hostEl.querySelector("label[for='" + r.id + "']");
        if (!lbl) lbl = document.querySelector("label[for='" + r.id + "']");
        return lbl;
      }

      for (var i = 0; i < radios.length; i++) {
        var r = radios[i];
        var lbl = labelForRadio(r);
        var t = _normRVLabel(text(lbl) || "");
        if (!t) continue;

        // Exact match first, then tolerant match
        if (t === want || t.indexOf(want) !== -1) {
          try { r.click(); } catch (e) {}
          r.checked = true;
          r.dispatchEvent(new Event("input", { bubbles: true }));
          r.dispatchEvent(new Event("change", { bubbles: true }));
          return true;
        }
      }

      return false;
    }

    function _inferRequestedVersionHosts() {
      if (__RV_HOSTS_CACHE) return __RV_HOSTS_CACHE;

      var out = { achr: null, wc: null };

      // Your new explicit wrappers (preferred)
      out.achr = document.querySelector(".achr-requested-version") || null;
      out.wc   = document.querySelector(".wc-requested-version") || null;
      if (out.achr && out.wc) return (__RV_HOSTS_CACHE = out);

      // Heuristic fallback (works even if wrappers aren’t present)
      var scopes = $all(
        ".achr-requested-version, .wc-requested-version, .requested-version, span.drg-element-type-requested-version, div.drg-element-type-requested-version"
      );

      // If we didn't find wrappers, try to classify the two RV blocks by what labels they contain
      $all(".requested-version span.drg-element-type-requested-version, .requested-version div.drg-element-type-requested-version").forEach(function (sp) {
        scopes.push(sp);
      });

      var seen = new Set();
      scopes.forEach(function (sp) {
        if (!sp || seen.has(sp)) return;
        seen.add(sp);

        var labels = $all("label", sp).map(function (l) { return _normRVLabel(text(l)); }).filter(Boolean);
        if (!labels.length) return;

        var hasPrint = labels.indexOf("print") >= 0;
        var hasBoth  = labels.indexOf("both") >= 0;
        var hasNoPref = labels.indexOf("no preference") >= 0;
        var hasDigital = labels.indexOf("digital") >= 0;
        var hasDoNot = labels.indexOf("do not want") >= 0;

        // Weekly Chill RV is only: Digital + Do not want
        if (!out.wc && hasDigital && hasDoNot && !hasPrint && !hasBoth && !hasNoPref && labels.length <= 2) {
          out.wc = sp;
          return;
        }

        // ACHR RV has Print/Both/No Preference (full set)
        if (!out.achr && (hasPrint || hasBoth || hasNoPref)) {
          out.achr = sp;
          return;
        }
      });

      return (__RV_HOSTS_CACHE = out);
    }

    function setAchRequestedVersion(kind) {
      var hosts = _inferRequestedVersionHosts();
      var host = document.querySelector(".achr-requested-version") || hosts.achr;
      return _pickRequestedVersionHost(host, kind);
    }

    function setWeeklyRequestedVersion(weeklyYes) {
      var hosts = _inferRequestedVersionHosts();
      var host = document.querySelector(".wc-requested-version") || hosts.wc;
      return _pickRequestedVersionHost(host, weeklyYes ? "digital" : "do not want");
    }

    /* ---------- TILE CLICK selection -> radios/requested version/cart ---------- */
    function decodeRateRow(li) {
      if (!li) return null;
      var cls = li.className || "";
      var input = li.querySelector("input[type='radio']");
      if (!input) return null;

      var labelEl =
        (input.id && (li.closest(".campaign-placeholder,.standard-rates") || document).querySelector("label[for='" + input.id + "']")) ||
        li.querySelector("label") ||
        null;

      var raw = text(labelEl) || text(li);
      var lower = raw.toLowerCase();

      var kind = null;
      if (/\bAprod\b/i.test(cls)) kind = "chill";
      else if (/\bDprod\b/i.test(cls)) kind = "digital";
      else if (/\bPprod\b/i.test(cls)) kind = "print";
      else {
        if (/chill/.test(lower)) kind = "chill";
        else if (/digital/.test(lower) && !/print/.test(lower)) kind = "digital";
        else if (/print/.test(lower)) kind = "print";
      }
      if (!kind) return null;

      var region = "usa";
      if (/\bCANprod\b/i.test(cls) || /canprod/.test(lower)) region = "can";
      else if (/\bINTprod\b/i.test(cls) || /intprod/.test(lower)) region = "int";
      else if (/\bUSAPROD\b/i.test(cls) || /usaprod/.test(lower)) region = "usa";

      var period = null;
      if (/\bterm2\b/i.test(cls) || /\bterm3\b/i.test(cls)) period = "monthly";
      else if (/\bterm26\b/i.test(cls)) period = "yearly";
      else if (/month|monthly|\bmo\b/.test(lower)) period = "monthly";
      else if (/year|annual|\byr\b/.test(lower)) period = "yearly";

      return { kind: kind, region: region, period: period, input: input, labelText: raw };
    }

    function findBestRadioForPlan(planKind, period, region) {
      planKind = planKind === "print" || planKind === "chill" ? planKind : "digital";
      var periodNorm = period === "monthly" ? "monthly" : "yearly";
      var regionNorm = region || "usa";

      function collectRowsFromRoot(root, requireCampaignSuccess) {
        if (!root) return [];
        if (requireCampaignSuccess) {
          var flag = root.querySelector("#campaignPricingSuccess");
          if (!flag || ("" + flag.value).toLowerCase() !== "true") return [];
        }
        var rows = [];
        $all("li", root).forEach(function (li) {
          var row = decodeRateRow(li);
          if (!row) return;
          if (row.kind !== planKind) return;
          if (planKind === "print" && row.region !== regionNorm) return;
          rows.push(row);
        });
        return rows;
      }

      function pickBestFromRoots(roots, requireCampaignSuccess) {
        var allRows = [];
        roots.forEach(function (r) { allRows = allRows.concat(collectRowsFromRoot(r, requireCampaignSuccess)); });
        if (!allRows.length) return null;

        var exact = allRows.filter(function (r) { return r.period === periodNorm; });
        if (exact.length) return exact[0].input;

        var unknown = allRows.filter(function (r) { return !r.period; });
        if (unknown.length) return unknown[0].input;

        return allRows[0].input;
      }

      var campaignRoots = $all(".campaign-placeholder");
      var fromCampaign = pickBestFromRoots(campaignRoots, true);
      if (fromCampaign) return fromCampaign;

      var standardRoots = $all(".standard-rates");
      var fromStandard = pickBestFromRoots(standardRoots, false);
      if (fromStandard) return fromStandard;

      return null;
    }

    function clearMutualRadios(selectedInput) {
      if (!selectedInput) return;
      var isCampaign = !!selectedInput.closest(".campaign-placeholder");
      var targetGroup = isCampaign ? ".standard-rates" : ".campaign-placeholder";

      $all(targetGroup + " input[type='radio']").forEach(function (r) {
        if (r.checked) {
          r.checked = false;
          r.dispatchEvent(new Event("input", { bubbles: true }));
          r.dispatchEvent(new Event("change", { bubbles: true }));
        }
      });
    }

    function selectCampaignRadioAny(planKind, period, region) {
      var input = findBestRadioForPlan(planKind, period, region);
      if (!input) return false;
      clearMutualRadios(input);
      try { input.click(); } catch (e) {}
      input.checked = true;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
      return true;
    }

    function clearAllRateRadios() {
      [".campaign-placeholder", ".standard-rates"].forEach(function (sel) {
        $all(sel + " input[type='radio']").forEach(function (r) {
          if (r.checked) {
            r.checked = false;
            r.dispatchEvent(new Event("input", { bubbles: true }));
            r.dispatchEvent(new Event("change", { bubbles: true }));
          }
        });
      });
    }

    /* --------- PATCH: Yes/No set with ID-first, TEXT-fallback --------- */
    function setYesNoByQuestionText(questionIncludes, yesOrNo) {
      var want = (yesOrNo || "").toLowerCase() === "yes" ? "yes" : "no";
      var qNeed = (questionIncludes || "").toLowerCase().replace(/\s+/g, " ").trim();

      // Find a questionlabel span or p that contains the question; then use the first radio name in that block
      var candidates = $all(".questionlabel, p, div, span").filter(function (n) {
        var t = (text(n) || "").toLowerCase().replace(/\s+/g, " ").trim();
        return t && t.indexOf(qNeed) !== -1;
      });

      var groupName = null;
      for (var i = 0; i < candidates.length; i++) {
        var wrap = candidates[i].closest && candidates[i].closest(".drg-element-type-product, .product-selection, span, p, div");
        wrap = wrap || candidates[i].parentNode || null;
        if (!wrap) continue;
        var anyRadio = wrap.querySelector("input[type='radio']");
        if (anyRadio && anyRadio.name) { groupName = anyRadio.name; break; }
      }
      if (!groupName) return false;

      var group = document.querySelectorAll("input[type='radio'][name='" + groupName.replace(/'/g, "\\'") + "']");
      if (!group || !group.length) return false;

      var chosen = null;
      for (var j = 0; j < group.length; j++) {
        var r = group[j];
        var lbl = r.id ? document.querySelector("label[for='" + r.id + "']") : (r.closest ? r.closest("label") : null);
        var t2 = (text(lbl) || "").toLowerCase().replace(/\s+/g, " ").trim();
        if (t2 === want) { chosen = r; break; }
      }
      if (!chosen) return false;

      try { chosen.click(); } catch (e) {}
      chosen.checked = true;
      chosen.dispatchEvent(new Event("input", { bubbles: true }));
      chosen.dispatchEvent(new Event("change", { bubbles: true }));
      return true;
    }

    function setNewsAndWeekly(newsYes, weeklyYes) {
      // ID-first (when present)
      var newsYesR = document.getElementById("optid3309_1"), newsNoR = document.getElementById("optid3309_2");
      var wcYesR = document.getElementById("optid3934_1"), wcNoR = document.getElementById("optid3934_2");

      function ensure(yes, yR, nR) {
        var tgt = yes ? yR : nR;
        if (tgt && !tgt.checked) {
          try { tgt.click(); } catch (e) {}
          tgt.checked = true;
          tgt.dispatchEvent(new Event("input", { bubbles: true }));
          tgt.dispatchEvent(new Event("change", { bubbles: true }));
          return true;
        }
        return !!tgt;
      }

      var okNews = ensure(newsYes, newsYesR, newsNoR);
      var okWc = ensure(weeklyYes, wcYesR, wcNoR);

      // Text fallback (NO IDs)
      if (!okNews) {
        // just look for "subscription to the achr news"
        setYesNoByQuestionText("subscription to the achr news", newsYes ? "yes" : "no");
      }
      if (!okWc) {
        // just look for "weekly chill"
        setYesNoByQuestionText("weekly chill", weeklyYes ? "yes" : "no");
      }
    }

    function attachTileClickSelection() {
      var root = $("section.plans");
      if (!root) return;
      if (root.dataset.__tileClickBound === "1") return;
      root.dataset.__tileClickBound = "1";

      root.addEventListener("click", function (ev) {
        var card = ev.target && ev.target.closest && ev.target.closest("article.card, article");
        if (!card) return;

        try {
          $all("section.plans article.card.selected, section.plans article.selected").forEach(function (n) { n.classList.remove("selected"); });
          card.classList.add("selected");
        } catch (e) {}

        var title = ((card.querySelector("h2,h3,h4") && card.querySelector("h2,h3,h4").textContent) || "").toLowerCase();
        var kind =
          /fan only/i.test(title) ? "fan" :
          /ac\s*pro\s*\+\s*print|print/i.test(title) ? "print" :
          /chill/i.test(title) ? "chill" :
          "digital";

        var period = currentPeriod();
        var region = CACHE.region || "usa";

        var weeklyYes = (kind === "chill");

        // Yes/No product questions
        if (weeklyYes) setNewsAndWeekly(false, true);
        else setNewsAndWeekly(true, false);

        // Weekly Chill Requested Version:
        // - Weekly Chill = Digital
        // - Anything else = Do not want
        setWeeklyRequestedVersion(weeklyYes);

        // ACHR Requested Version:
        // - If Weekly Chill selected => Do not want
        // - Else Print tile => Print
        // - Else => Digital
        if (weeklyYes) setAchRequestedVersion("do not want");
        else if (kind === "print") setAchRequestedVersion("print");
        else setAchRequestedVersion("digital");

        if (kind === "fan") {
          clearAllRateRadios();

          // Fan-only should force ACHR Requested Version to DIGITAL (per requirement),
          // and Weekly Chill to Do not want.
          setAchRequestedVersion("digital");
          setWeeklyRequestedVersion(false);

          CACHE.product = null;
          if (typeof window.__FORCE_CART_SYNC === "function") window.__FORCE_CART_SYNC();
          return;
        }

        var planMap = (kind === "print") ? "print" : (kind === "chill") ? "chill" : "digital";
        selectCampaignRadioAny(planMap, period, region);

        applyPricesNow();
        if (typeof window.__FORCE_CART_SYNC === "function") window.__FORCE_CART_SYNC();
      }, true);
    }

    /* ---------- FLOW WIZARD (PAYMENT: move ORIGINAL submit into modal bar, centered) ---------- */
    function setupFlowWizard() {
      if (!window.__BNP_FLOW_WIZ_RETRY) window.__BNP_FLOW_WIZ_RETRY = 0;

      var hero = $("section.hero");
      var plans = $("section.plans[aria-label='Plans'], section.plans");
      var compare = $("section.compare[aria-label='Compare features'], section.compare");
      var newsletters = $("section[aria-label='Newsletters']");
      var faq = $(".faq-section");
      var content1 = document.getElementById("content1");
      var content4 = document.getElementById("content4");
      var content6 = document.getElementById("content6");
      var promoBar = document.getElementById("promo-code-ui");
      var promoToggle = document.getElementById("promo-toggle");
      var backdrop = document.getElementById("modal-backdrop");

      if (!plans || !content1 || !content6) {
        if (window.__BNP_FLOW_WIZ_RETRY < 20) {
          window.__BNP_FLOW_WIZ_RETRY++;
          setTimeout(setupFlowWizard, 150);
        }
        return;
      }

      function submitViaNative(stepRoot) {
        var root = stepRoot || document;
        var form =
          (root.closest && root.closest("form")) ||
          document.querySelector("form");
        if (!form) return;

        var btn =
          root.querySelector('button[type="submit"], input[type="submit"]') ||
          form.querySelector('button[type="submit"], input[type="submit"]');

        if (btn) {
          try { btn.click(); } catch (e) {}
          return;
        }

        if (form.requestSubmit) {
          try { form.requestSubmit(); } catch (e) {}
          return;
        }

        try { form.submit(); } catch (e) {}
      }

      // Action bar
      var actions = document.createElement("div");
      actions.className = "nl-actions";
      actions.style.cssText =
        "display:flex;gap:12px;padding:12px;margin-top:24px;background:#fff;border-top:1px solid #e6e8ee;align-items:center";

      // Center slot so Pay Now sits centered
      actions.innerHTML =
        '<button type="button" class="btn btn-back">Back</button>' +
        '<div class="bnp-action-center" style="flex:1;display:flex;justify-content:center;align-items:center;"></div>' +
        '<button type="button" class="btn btn-next">Next</button>';

      var backBtn = actions.querySelector(".btn-back");
      var nextBtn = actions.querySelector(".btn-next");

      var step = "plans",
        chosenKind = null,
        chosenFree = true,
        lastFocus = null;

      function placeActions(stepEl) {
        var target = stepEl ? stepEl.querySelector(".flow-actions") : null;
        if (target) {
          target.innerHTML = "";
          target.appendChild(actions);
        }
      }

      function stylePayNow(el) {
        if (!el) return;
        el.style.padding = "12px 20px";
        el.style.fontSize = "16px";
        el.style.cursor = "pointer";
        el.style.backgroundColor = "rgb(40, 167, 69)";
        el.style.color = "white";
        el.style.border = "none";
        el.style.borderRadius = "5px";
        el.style.textTransform = "uppercase";
        el.style.marginTop = "0";
        el.style.display = "inline-block";
        el.style.fontWeight = "bold";
        el.style.boxShadow = "rgba(0, 0, 0, 0.1) 0px 4px 6px";
        el.style.transition = "background-color 0.3s";
      }

      // Track original submit wrapper location
      var submitDock = { wrap: null, parent: null, nextSibling: null };

      function findOriginalPaymentSubmitWrapper() {
        if (!content6) return null;
        var wrap = content6.querySelector("#submitbtn");
        if (wrap) return wrap;

        var btn =
          content6.querySelector('input[type="submit"]') ||
          content6.querySelector('button[type="submit"]') ||
          null;
        if (!btn) return null;

        return btn.closest("div") || btn.parentNode || null;
      }

      function ensureSubmitDockCaptured(wrap) {
        if (!wrap) return;
        if (submitDock.wrap) return;
        submitDock.wrap = wrap;
        submitDock.parent = wrap.parentNode || null;
        submitDock.nextSibling = wrap.nextSibling || null;
      }

      function restorePaymentSubmitToOriginalSpot() {
        if (!submitDock.wrap || !submitDock.parent) return;
        if (!document.body.contains(submitDock.parent)) return;

        try {
          if (submitDock.nextSibling && submitDock.nextSibling.parentNode === submitDock.parent) {
            submitDock.parent.insertBefore(submitDock.wrap, submitDock.nextSibling);
          } else {
            submitDock.parent.appendChild(submitDock.wrap);
          }
        } catch (e) {}

        try { submitDock.wrap.style.display = "none"; } catch (e) {}
      }

      function moveRealSubmitIntoPaymentBar() {
        if (!content6) return;
        var centerSlot = actions.querySelector(".bnp-action-center");
        if (!centerSlot) return;
        if (actions.dataset.__payInstalled === "1") return;

        var wrap = findOriginalPaymentSubmitWrapper();
        if (!wrap) return;

        ensureSubmitDockCaptured(wrap);

        var realBtn = wrap.querySelector('input[type="submit"], button[type="submit"]');
        if (realBtn) {
          try { realBtn.value = "Pay Now"; } catch (e) {}
          stylePayNow(realBtn);
        }

        try {
          wrap.style.display = "inline-flex";
          wrap.style.alignItems = "center";
          wrap.style.justifyContent = "center";
          wrap.style.margin = "0";
          wrap.style.padding = "0";
          wrap.style.width = "auto";
        } catch (e) {}

        centerSlot.innerHTML = "";
        centerSlot.appendChild(wrap);

        try { nextBtn.style.display = "none"; } catch (e) {}
        actions.dataset.__payInstalled = "1";
      }

      function updateButtons() {
        if (step === "plans") {
          hide(actions);
          return;
        }
        show(actions);

        if (step !== "content6") {
          try { nextBtn.style.display = ""; } catch (e) {}
          actions.dataset.__payInstalled = "";
          var centerSlot = actions.querySelector(".bnp-action-center");
          if (centerSlot) centerSlot.innerHTML = "";
          restorePaymentSubmitToOriginalSpot();
        }

        if (step === "newsletters" || step === "content1") nextBtn.textContent = "Next";
        else if (step === "content4") nextBtn.textContent = chosenFree ? "Subscribe" : "Next";
        else if (step === "content6") nextBtn.textContent = "Complete Payment";
      }

      function preloadPaymentStep() {
        if (!content6) return;
        content6.classList.remove("modal-open");
        content6.classList.add("payment-preload-hidden");
      }

      function openPaymentModal() {
        if (!content6) return;

        lastFocus = document.activeElement;

        content6.classList.remove("payment-preload-hidden");

        content6.setAttribute("role", "dialog");
        content6.setAttribute("aria-modal", "true");
        content6.classList.add("modal-open");

        show(content6);

        if (backdrop) backdrop.style.display = "block";
        document.documentElement.classList.add("payment-open");
        document.body.classList.add("payment-open");

        try { content6.scrollTop = 0; } catch (e) {}
        scrollToHeaderNow();

        setTimeout(function () {
          var f = content6.querySelector("button,[href],input,select,textarea,[tabindex]:not([tabindex='-1'])");
          try { (f || content6).focus && (f || content6).focus({ preventScroll: true }); } catch (e) {}
        }, 0);
      }

      function closePaymentModal() {
        if (!content6) return;

        content6.classList.remove("modal-open");
        if (backdrop) backdrop.style.display = "none";
        document.documentElement.classList.remove("payment-open");
        document.body.classList.remove("payment-open");

        preloadPaymentStep();

        if (lastFocus && document.body.contains(lastFocus)) {
          try { lastFocus.focus({ preventScroll: true }); } catch (e) {}
        }
      }

      function goToNewsletters(kind) {
        chosenKind = kind;

        hide(hero);
        hide(plans);
        hide(compare);
        hide(faq);
        hide(promoBar);
        hide(promoToggle);

        if (newsletters) {
          show(newsletters);
          placeActions(newsletters);
        }

        step = "newsletters";
        updateButtons();
        scrollToHeaderNow();
      }

      function goToContent1() {
        if (newsletters) hide(newsletters);
        show(content1);
        placeActions(content1);
        step = "content1";
        updateButtons();
        scrollToHeaderNow();
      }

      function goToContent4() {
        hide(content1);
        if (content4) show(content4);
        if (content4) placeActions(content4);
        step = "content4";
        updateButtons();
        scrollToHeaderNow();
      }

      function goToPayment() {
        if (content4) hide(content4);
        openPaymentModal();
        placeActions(content6);
        step = "content6";
        updateButtons();
        moveRealSubmitIntoPaymentBar();
      }

      function backToPlans() {
        show(hero);
        show(plans);
        show(compare);
        show(faq);
        show(promoBar);
        show(promoToggle);

        if (newsletters) hide(newsletters);
        hide(content1);
        if (content4) hide(content4);

        closePaymentModal();
        hide(actions);

        updateButtons();
        step = "plans";
        scrollToHeaderNow();
      }

      function backFromContent1() {
        hide(content1);
        if (newsletters) { show(newsletters); placeActions(newsletters); }
        step = "newsletters";
        updateButtons();
        scrollToHeaderNow();
      }

      function backFromContent4() {
        if (content4) hide(content4);
        show(content1);
        placeActions(content1);
        step = "content1";
        updateButtons();
        scrollToHeaderNow();
      }

      function backFromPayment() {
        closePaymentModal();
        if (chosenKind === "print" && content4) {
          show(content4);
          placeActions(content4);
          step = "content4";
        } else {
          show(content1);
          placeActions(content1);
          step = "content1";
        }
        updateButtons();
        scrollToHeaderNow();
      }

      backBtn.addEventListener("click", function () {
        if (step === "newsletters") backToPlans();
        else if (step === "content1") backFromContent1();
        else if (step === "content4") backFromContent4();
        else if (step === "content6") backFromPayment();
      });

      nextBtn.addEventListener("click", function () {
        if (step === "newsletters") { goToContent1(); return; }

        if (step === "content1") {
          var v1 = validateStep("content1");
          if (!v1.ok) {
            alert("Please complete all required Profile fields.");
            try {
              if (v1.focusEl && v1.focusEl.scrollIntoView) v1.focusEl.scrollIntoView({ behavior: "smooth", block: "center" });
              if (v1.focusEl && v1.focusEl.focus) v1.focusEl.focus({ preventScroll: true });
            } catch (e) {}
            return;
          }
          if (chosenFree) { submitViaNative(content1); return; }
          if (chosenKind === "print") goToContent4();
          else goToPayment();
          return;
        }

        if (step === "content4") {
          var v4 = validateStep("content4");
          if (!v4.ok) {
            alert("Please complete all required Shipping fields.");
            try {
              if (v4.focusEl && v4.focusEl.scrollIntoView) v4.focusEl.scrollIntoView({ behavior: "smooth", block: "center" });
              if (v4.focusEl && v4.focusEl.focus) v4.focusEl.focus({ preventScroll: true });
            } catch (e) {}
            return;
          }
          if (chosenFree) submitViaNative(content4);
          else goToPayment();
          return;
        }

        if (step === "content6") {
          submitViaNative(content6);
        }
      });

      (function attachNewslettersInlineNext() {
        if (!newsletters) return;
        var NEXT_SEL =
          '[data-step-next],[data-action="next"],.btn-next,.next,.wizard-next,a[href="#next"],button[type="submit"],[type="submit"]';

        newsletters.addEventListener("click", function (e) {
          var btn = e.target && e.target.closest && e.target.closest(NEXT_SEL);
          if (!btn || step !== "newsletters") return;
          e.preventDefault();
          e.stopPropagation();
          goToContent1();
        });

        newsletters.addEventListener("keydown", function (e) {
          if (step === "newsletters" && e.key === "Enter") {
            e.preventDefault();
            goToContent1();
          }
        }, true);
      })();

      $all("section.plans article.card, section.plans article").forEach(function (card) {
        if (card.dataset.__flowTileBound === "1") return;
        card.dataset.__flowTileBound = "1";

        card.addEventListener("click", function () {
          $all("section.plans article.card.selected, section.plans article.selected").forEach(function (n) {
            n.classList.remove("selected");
          });
          card.classList.add("selected");

          var title = ((card.querySelector("h2,h3,h4") && card.querySelector("h2,h3,h4").textContent) || "").toLowerCase();
          chosenFree = /free/.test(title);

          if (/ac\s*pro\s*\+\s*print|print/.test(title)) goToNewsletters("print");
          else if (/pro|digital|chill/.test(title)) goToNewsletters("digital");
          else goToNewsletters("none");
        }, true);
      });

      show(hero);
      show(plans);
      show(compare);
      show(faq);
      show(promoBar);
      show(promoToggle);

      if (newsletters) hide(newsletters);
      hide(content1);
      if (content4) hide(content4);

      preloadPaymentStep();
      hide(actions);

      // Hide original submit while content6 preloaded/hidden
      try {
        var w = findOriginalPaymentSubmitWrapper();
        if (w) w.style.display = "none";
      } catch (e) {}

      step = "plans";
      updateButtons();
    }

    function initAll() {
      ensureStylesAndBackdrop();
      initPromoUI();
      initBillingToggle();
      initCountryListener();
      attachTileClickSelection();

      applyPricesNow();
      setupFlowWizard();

      document.addEventListener("click", function (e) {
        var btn = e.target && e.target.closest && e.target.closest("button.btn-next[type='button'], button.btn-next");
        if (!btn) return;

        requestAnimationFrame(function () {
          requestAnimationFrame(scrollToHeaderNow);
        });
      }, true);
    }

    onReady(initAll);
  })();

  /* ============================================================
     SECTION N — GEO IP LOCATOR (ORIGINAL)
     ============================================================ */
  (function () {
    if (BNP.__GEO2__) return;
    BNP.__GEO2__ = true;

    var GEO_TIMEOUT_MS = 2000;

    function fetchJSON(url) {
      return fetch(url, { mode: "cors", credentials: "omit" }).then(function (r) {
        if (!r.ok) throw new Error("Bad status " + r.status);
        return r.json();
      });
    }

    function setCountryDropdown(code) {
      var sel = document.querySelector("#id7");
      if (!sel) return;

      var opts = Array.from(sel.options || []);
      var target = null;

      if (code === "US" || code === "USA") {
        target =
          opts.find(function (o) { return /united\s*states/i.test(o.textContent); }) ||
          opts.find(function (o) { return (o.value || "").toUpperCase() === "US"; });
      } else if (code === "CA" || code === "CAN") {
        target =
          opts.find(function (o) { return /canada/i.test(o.textContent); }) ||
          opts.find(function (o) { return (o.value || "").toUpperCase() === "CA"; });
      } else {
        return;
      }

      if (target) {
        sel.value = target.value;
        sel.dispatchEvent(new Event("input", { bubbles: true }));
        sel.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }

    function detectCountryFast() {
      return new Promise(function (resolve) {
        var done = false;

        function finish(cc) {
          if (done) return;
          done = true;
          resolve(cc || null);
        }

        fetchJSON("https://api.country.is/")
          .then(function (d) {
            if (d && d.country) finish(d.country);
            else throw 0;
          })
          .catch(function () {
            return fetchJSON("https://get.geojs.io/v1/ip/geo.json");
          })
          .then(function (d) {
            if (!done && d && d.country_code) finish(d.country_code);
          })
          .catch(function () {
            return fetchJSON("https://ipwho.is/?fields=country_code");
          })
          .then(function (d) {
            if (!done) finish(d && d.country_code);
          })
          .catch(function () {
            try {
              var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
              finish(/America\//.test(tz) ? "US" : null);
            } catch (e) { finish(null); }
          });

        setTimeout(function () { finish(null); }, GEO_TIMEOUT_MS);
      });
    }

    function run() {
      detectCountryFast().then(function (cc) {
        if (!cc) return;
        var code = ("" + cc).toUpperCase();
        setCountryDropdown(code);
      });
    }

    onReady(run);
  })();

  /* ============================================================
     SECTION O — CART FORCE-SYNC (price ALWAYS from selected radio first)
     ============================================================ */
  (function () {
    if (BNP.__CART3__) return;
    BNP.__CART3__ = true;

    if (!window.__FORCE_CART_SYNC) window.__FORCE_CART_SYNC = function () {};

    var Q = function (s, r) { return (r || document).querySelector(s); };
    var QA = function (s, r) { return Array.from((r || document).querySelectorAll(s)); };
    var T = function (el) { return ((el && (el.innerText || el.textContent)) || "").trim(); };

    function _moneyFromString(str) {
      if (!str) return null;
      var m =
        /([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{1,2})|[0-9]+(?:\.[0-9]{1,2})?)/.exec(String(str));
      return m ? parseFloat(m[1].replace(/,/g, "")) : null;
    }
    var fmt = function (n) { return typeof n === "number" && !isNaN(n) ? "$" + n.toFixed(2) : null; };

    function labelForInput(input) {
      if (!input) return null;
      if (input.id) {
        var l = document.querySelector("label[for='" + input.id + "']");
        if (l) return l;
      }
      var parentLabel = input.closest && input.closest("label");
      return parentLabel || null;
    }

    function isLikelyProductRadio(input) {
      if (!input || input.type !== "radio") return false;

      var li = input.closest && input.closest("li");
      var cls = ((li && li.className) || "") + " " + (input.className || "");
      if (/\b(Aprod|Dprod|Pprod|USAPROD|CANprod|INTprod|term2|term3|term26)\b/i.test(cls)) return true;

      var lbl = labelForInput(input);
      var t = (T(lbl) || (li ? T(li) : "") || "").toLowerCase();
      if (!t) return false;

      if (/\$/.test(t)) return true;
      if (/\b(annual|year|yr|monthly|month|mo|print|digital|chill)\b/.test(t)) return true;

      return false;
    }

    function findCheckedProductRadio() {
      var roots = [Q(".campaign-placeholder"), Q(".standard-rates"), Q(".promo-key")].filter(Boolean);

      for (var i = 0; i < roots.length; i++) {
        var checked = Q("input[type='radio']:checked", roots[i]);
        if (checked && isLikelyProductRadio(checked)) return checked;
      }

      var allChecked = QA("input[type='radio']:checked");
      for (var j = 0; j < allChecked.length; j++) {
        if (isLikelyProductRadio(allChecked[j])) return allChecked[j];
      }

      return null;
    }

    function decodeSelectedRadio() {
      var input = findCheckedProductRadio();
      if (!input) return null;

      var li = input.closest && input.closest("li");
      var labelEl = labelForInput(input) || (li ? Q("label", li) : null);
      var raw = T(labelEl) || (li ? T(li) : "") || "";
      var priceNum = _moneyFromString(raw);

      var cls = ((li && li.className) || "") + " " + (input.className || "");
      var kind = /\bPprod\b/i.test(cls) ? "print" : /\bDprod\b/i.test(cls) ? "digital" : /\bAprod\b/i.test(cls) ? "chill" : null;
      var per = /\bterm2\b/i.test(cls) || /\bterm3\b/i.test(cls) ? "monthly" : /\bterm26\b/i.test(cls) ? "yearly" : null;

      if (!kind) {
        var low = raw.toLowerCase();
        if (/print/.test(low)) kind = "print";
        else if (/chill/.test(low)) kind = "chill";
        else if (/digital/.test(low)) kind = "digital";
      }
      if (!per) {
        var low2 = raw.toLowerCase();
        if (/month|monthly|\bmo\b/.test(low2)) per = "monthly";
        else if (/year|annual|\byr\b/.test(low2)) per = "yearly";
      }

      return {
        input: input,
        li: li,
        rawLabel: raw,
        kind: kind,
        per: per,
        price: (typeof priceNum === "number" && !isNaN(priceNum)) ? fmt(priceNum) : null
      };
    }

    function tilePriceFallback(kind) {
      var cards = QA("section.plans .card, section.plans article");
      for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        var title = ((card.querySelector("h2,h3,h4") && card.querySelector("h2,h3,h4").textContent) || "").toLowerCase();

        if (kind === "print" && !/(print|pro\s*\+\s*print)/i.test(title)) continue;
        if (kind === "chill" && !/chill/.test(title)) continue;
        if (kind === "digital" && /(print|chill)/.test(title)) continue;

        var amt = card.querySelector(".price .amount") && card.querySelector(".price .amount").textContent;
        if (amt) return amt;
      }
      return null;
    }

    function currentKindFromTile() {
      var selCard = Q("section.plans .card.selected, section.plans article.selected") || null;
      if (selCard) {
        var title = ((selCard.querySelector("h2,h3,h4") && selCard.querySelector("h2,h3,h4").textContent) || "").toLowerCase();
        if (/fan only/.test(title)) return "fan";
        if (/ac\s*pro\s*\+\s*print|print/.test(title)) return "print";
        if (/chill/.test(title)) return "chill";
        return "digital";
      }
      return null;
    }

    var CART = { kind: null, price: null, term: null, format: null, img: null };

    function computeCartSnapshot() {
      var radio = decodeSelectedRadio();

      if (radio && radio.kind) {
        var term = (radio.per === "monthly") ? "Monthly" : "Annual";
        var format = radio.kind === "print" ? "Print" : "Digital";
        var img =
          radio.kind === "print"
            ? "https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/NEWS_Cover_Widget.png"
            : "https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/NEWS_Mobile_Mockup_Widget.png";

        var price = radio.price || tilePriceFallback(radio.kind);
        return { kind: radio.kind, price: price, term: term, format: format, img: img };
      }

      var kind = currentKindFromTile();
      if (!kind) return { kind: null, price: null, term: null, format: null, img: null };
      if (kind === "fan") return { kind: "fan", price: null, term: null, format: null, img: null };

      var price2 = tilePriceFallback(kind);
      var term2 = "Annual";
      var format2 = kind === "print" ? "Print" : "Digital";
      var img2 =
        kind === "print"
          ? "https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/NEWS_Cover_Widget.png"
          : "https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/NEWS_Mobile_Mockup_Widget.png";

      return { kind: kind, price: price2, term: term2, format: format2, img: img2 };
    }

    function renderCart(snapshot) {
      var items = QA(".cartItems");
      var totals = QA(".cartTotal");

      if (!items.length && !totals.length) return;

      items.forEach(function (el) { el.innerHTML = ""; });

      var total = 0;

      if (snapshot.kind && snapshot.kind !== "fan" && snapshot.price) {
        var div = document.createElement("div");
        div.innerHTML =
          '<img src="' + snapshot.img + '" style="width:60px;height:60px;margin-right:10px;border-radius:4px;float:left;" />' +
          '<p style="margin:0;font-size:14px;color:#555;">Price: ' + snapshot.price +
          "<br>" + snapshot.term + ", " + snapshot.format + " Subscription</p>";

        div.style.display = "flex";
        div.style.alignItems = "center";
        div.style.gap = "12px";
        div.style.borderBottom = "1px solid #ccc";
        div.style.paddingBottom = "10px";

        items.forEach(function (el) { el.appendChild(div.cloneNode(true)); });

        var parsed = _moneyFromString(snapshot.price);
        total += typeof parsed === "number" && !isNaN(parsed) ? parsed : 0;
      } else {
        items.forEach(function (el) { el.innerHTML = "<p>No selections made.</p>"; });
      }

      var autoRenew = Q("#id104_996");

      totals.forEach(function (el) {
        el.innerHTML = "<h3>Total: $" + total.toFixed(2) + "</h3>";

        if (autoRenew && autoRenew.checked) {
          var d = document.createElement("p");
          d.className = "disclaimer";
          d.style.fontSize = "12px";
          d.style.color = "#888";
          d.textContent = "Automatically renews at our standard rate.";
          el.appendChild(d);
        }
      });
    }

    function syncCartNow() {
      var snap = computeCartSnapshot();
      var changed =
        !CART.kind ||
        snap.kind !== CART.kind ||
        snap.price !== CART.price ||
        snap.term !== CART.term ||
        snap.format !== CART.format;

      CART.kind = snap.kind;
      CART.price = snap.price;
      CART.term = snap.term;
      CART.format = snap.format;
      CART.img = snap.img;

      if (changed) renderCart(snap);
    }

    function burstSync() {
      var steps = [0, 40, 120, 220, 360, 520, 700, 900, 1200, 1600];
      steps.forEach(function (ms) { setTimeout(syncCartNow, ms); });
    }

    function watchInputs() {
      document.addEventListener("change", function (e) {
        var t = e.target;
        if (t && t.matches && t.matches("input[type='radio']")) burstSync();
      }, true);

      var annual = Q("#annualBtn");
      var monthly = Q("#monthlyBtn");
      if (annual) annual.addEventListener("click", burstSync, { passive: true });
      if (monthly) monthly.addEventListener("click", burstSync, { passive: true });

      var country = Q("#id7");
      if (country) country.addEventListener("change", burstSync, { passive: true });

      var plans = Q("section.plans");
      if (plans) {
        plans.addEventListener("click", function (e) {
          var card = e.target.closest && e.target.closest(".card, article");
          if (!card) return;

          QA("section.plans .card.selected, section.plans article.selected").forEach(function (n) { n.classList.remove("selected"); });
          card.classList.add("selected");
          burstSync();
        }, true);
      }
    }

    function watchPricingBlocks() {
      if (!window.MutationObserver) return;
      var mo = new MutationObserver(function () { burstSync(); });
      [".campaign-placeholder", ".standard-rates", ".promo-key"].forEach(function (sel) {
        var el = Q(sel);
        if (el) mo.observe(el, { childList: true, subtree: true, attributes: true, characterData: true });
      });
    }

    function onceWhenShownScroll() {
      if (!window.MutationObserver) return;

      var targets = ["#content1", "#content4"].map(function (s) { return Q(s); }).filter(Boolean);
      if (!targets.length) return;

      var was = new WeakMap();

      function isShown(el) {
        return !!el && el.offsetParent !== null && getComputedStyle(el).display !== "none" && getComputedStyle(el).visibility !== "hidden";
      }

      function findScrollParent(n) {
        for (var cur = n && n.parentElement; cur; cur = cur.parentElement) {
          var s = getComputedStyle(cur);
          if ((s.overflowY === "auto" || s.overflowY === "scroll") && cur.scrollHeight > cur.clientHeight) return cur;
        }
        return null;
      }

      function snap(el) {
        try { window.scrollTo({ top: 0, behavior: "auto" }); } catch (e) {}
        var scp = findScrollParent(el);
        if (scp) try { scp.scrollTop = 0; } catch (e) {}

        setTimeout(function () {
          try { window.scrollTo({ top: 0, behavior: "auto" }); } catch (e) {}
          if (scp) try { scp.scrollTop = 0; } catch (e) {}
        }, 60);
      }

      var mo = new MutationObserver(function () {
        targets.forEach(function (t) {
          var vis = isShown(t);
          var prev = was.get(t) || false;
          if (vis && !prev) snap(t);
          was.set(t, vis);
        });
      });

      mo.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["style", "class"] });
    }

    function init() {
      watchInputs();
      watchPricingBlocks();
      onceWhenShownScroll();

      window.__FORCE_CART_SYNC = burstSync;
      burstSync();
    }

    onReady(init);
  })();

  /* ============================================================
     SECTION P — ACHR CHILL MONTHLY HIDE PATCH (ORIGINAL)
     ============================================================ */
  (function () {
    if (BNP.__CHILL_HIDE__) return;
    BNP.__CHILL_HIDE__ = true;

    function getPeriod() {
      var seg = document.querySelector("#billingSeg");
      var a = seg && seg.dataset && seg.dataset.active;

      if (a === "monthly") return "monthly";
      if (a === "annual") return "yearly";

      var perText = ((document.querySelector("#chillPer") && document.querySelector("#chillPer").textContent) || "").toLowerCase();
      return /\bmo\b/.test(perText) ? "monthly" : "yearly";
    }

    function isChillCard(card) {
      var title = (((card.querySelector("h2,h3,h4") && card.querySelector("h2,h3,h4").textContent) || "")).trim().toLowerCase();
      return title === "achr chill" || /^\s*chill\s*$/.test(title) || /\bachr\s+chill\b/.test(title);
    }

    function updateChillVisibility() {
      var period = getPeriod();
      document.querySelectorAll("section.plans .card, section.plans article").forEach(function (card) {
        if (!isChillCard(card)) return;
        if (period === "monthly") card.style.display = "none";
        else card.style.removeProperty("display");
      });
    }

    function init() {
      updateChillVisibility();

      document.addEventListener("click", function (e) {
        if (e.target.closest && e.target.closest("#monthlyBtn, [data-billing='monthly'], #annualBtn, [data-billing='yearly']")) {
          setTimeout(updateChillVisibility, 80);
        }
      }, true);

      if (window.MutationObserver) {
        var mo = new MutationObserver(function () { setTimeout(updateChillVisibility, 80); });
        mo.observe(document.documentElement, { attributes: true, subtree: true, childList: true, attributeFilter: ["data-active", "style", "class"] });
      }

      if (typeof window.__FORCE_CART_SYNC === "function" && !window.__CHILL_HIDE_WRAPPED) {
        window.__CHILL_HIDE_WRAPPED = true;
        var orig = window.__FORCE_CART_SYNC;
        window.__FORCE_CART_SYNC = function () {
          try { return orig.apply(this, arguments); }
          finally { setTimeout(updateChillVisibility, 60); }
        };
      }
    }

    onReady(init);
  })();

  /* ============================================================
     SECTION Q — CAMPAIGN QUOTED TEXT -> TILE FINE PRINT (ORIGINAL)
     ============================================================ */
  (function () {
    if (BNP.__FINE_PRINT__) return;
    BNP.__FINE_PRINT__ = true;

    function qs(sel, root) { return (root || document).querySelector(sel); }
    function qsa(sel, root) { return Array.from((root || document).querySelectorAll(sel) || []); }
    function getText(el) { return el ? el.textContent.trim() : ""; }

    function detectCurrentPeriodSafe() {
      var seg = qs("#billingSeg");
      var a = seg && seg.dataset && seg.dataset.active;
      if (a === "monthly") return "monthly";
      if (a === "annual") return "yearly";
      var per = (qs("#proPer") && qs("#proPer").textContent) || (qs("#plusPer") && qs("#plusPer").textContent) || (qs("#chillPer") && qs("#chillPer").textContent) || "";
      per = (per || "").toLowerCase();
      return /\bmo\b/.test(per) ? "monthly" : "yearly";
    }

    function injectFinePrintCSS() {
      if (document.getElementById("tileFinePrintStyle")) return;
      var style = document.createElement("style");
      style.id = "tileFinePrintStyle";
      style.textContent = `
        .tile-fine-print {
          font-size: 11px !important;
          line-height: 1.3 !important;
          margin-top: 8px !important;
          color: #555 !important;
          opacity: 0.9 !important;
          text-align: center !important;
          font-style: italic !important;
          display: block !important;
          width: 100% !important;
        }
      `;
      document.head.appendChild(style);
    }

    function decodeCampaignRow(li) {
      if (!li) return null;

      var input = qs("input[type='radio']", li);
      if (!input) return null;

      var label = (input.id && qs("label[for='" + input.id + "']", li.closest(".campaign-placeholder") || document)) || qs("label", li);
      var raw = getText(label) || getText(li);
      if (!raw) return null;

      var quotes = [];
      var m, re = /"([^"]+)"/g;
      while ((m = re.exec(raw)) !== null) {
        if (m[1] && m[1].trim()) quotes.push(m[1].trim());
      }
      if (!quotes.length) return null;

      var finePrint = quotes.join(" ");
      var lower = raw.toLowerCase();
      var cls = (li.className || "") + " " + (input.className || "");

      var kind = null;
      if (/\bAprod\b/i.test(cls)) kind = "chill";
      else if (/\bDprod\b/i.test(cls)) kind = "digital";
      else if (/\bPprod\b/i.test(cls)) kind = "print";
      else {
        if (/chill/.test(lower)) kind = "chill";
        else if (/digital/.test(lower) && !/print/.test(lower)) kind = "digital";
        else if (/print/.test(lower)) kind = "print";
      }
      if (!kind) return null;

      var period = null;
      if (/\bterm2\b/i.test(cls) || /\bterm3\b/i.test(cls)) period = "monthly";
      else if (/\bterm26\b/i.test(cls)) period = "yearly";
      else if (/month|monthly|\bmo\b/.test(lower)) period = "monthly";
      else if (/year|annual|\byr\b/.test(lower)) period = "yearly";

      return { kind: kind, period: period, finePrint: finePrint };
    }

    function collectCampaignFinePrint() {
      var map = {};
      qsa(".campaign-placeholder").forEach(function (root) {
        qsa("li", root).forEach(function (li) {
          var row = decodeCampaignRow(li);
          if (!row) return;

          var keySpecific = row.kind + "|" + (row.period || "any");
          if (!map[keySpecific] || map[keySpecific].length < row.finePrint.length) map[keySpecific] = row.finePrint;

          var keyAny = row.kind + "|any";
          if (!map[keyAny] || map[keyAny].length < row.finePrint.length) map[keyAny] = row.finePrint;
        });
      });
      return map;
    }

    function getCardKind(card) {
      var title = getText(qs("h2, h3, h4", card)).toLowerCase();
      if (/fan only/.test(title)) return "fan";
      if (/chill/.test(title)) return "chill";
      if (/print/.test(title)) return "print";
      return "digital";
    }

    function applyFinePrintToTiles() {
      var fineMap = collectCampaignFinePrint();
      if (!Object.keys(fineMap).length) return;

      var root = qs("section.plans") || document;
      var cards = qsa("article.card, article", root);
      var period = detectCurrentPeriodSafe();

      cards.forEach(function (card) {
        var kind = getCardKind(card);
        if (kind === "fan") return;

        var key = kind + "|" + period;
        var keyAny = kind + "|any";
        var fine = fineMap[key] || fineMap[keyAny];
        if (!fine) return;

        var existing = qs(".tile-fine-print", card);
        if (!existing) {
          existing = document.createElement("p");
          existing.className = "tile-fine-print";
        }
        existing.textContent = fine;

        var featuresList = card.querySelector("ul.features");
        if (featuresList && featuresList.parentNode) featuresList.insertAdjacentElement("afterend", existing);
        else card.appendChild(existing);
      });
    }

    function initCampaignFinePrint() {
      injectFinePrintCSS();
      applyFinePrintToTiles();

      if (window.MutationObserver) {
        qsa(".campaign-placeholder").forEach(function (root) {
          var mo = new MutationObserver(function () { applyFinePrintToTiles(); });
          mo.observe(root, { childList: true, subtree: true, characterData: true });
        });
      }

      document.addEventListener("click", function (e) {
        if (e.target.closest && e.target.closest("#monthlyBtn, #annualBtn, [data-billing]")) {
          setTimeout(applyFinePrintToTiles, 150);
        }
      }, true);
    }

    onReady(initCampaignFinePrint);
  })();

})();
