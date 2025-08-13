/* =====================================================================
   BNP MEDIA – MASTER BRAND UTILITY SCRIPT  (alphabetical, full list)
   ===================================================================*/

/* ---------------------------------------------
   0 ▸ CACHE‑BUST “your‑script.js” (once only)
----------------------------------------------*/
(function () {
  if (!window.jsUpdated) {
    const s = document.createElement("script");
    s.src   = `your-script.js?v=${Date.now()}`;
    s.type  = "text/javascript";
    s.onload = () => console.log("✅ cache‑busted external JS loaded");
    document.head.appendChild(s);
    window.jsUpdated = true;
  }
})();

/* ---------------------------------------------
   1 ▸ BRAND PLACEHOLDER REPLACER   {{BRAND}}
----------------------------------------------*/
document.addEventListener("DOMContentLoaded", () => {
  const brandMap = {
    AR: "Architectural Record", ASI: "Adhesives & Sealants Industry", ASM: "Assembly Magazine",
    BE: "Building Enclosure", BI: "Beverage Industry", BNP: "BNP Media", BNPE: "BNP Engage",
    CSTD: "Floor Covering Installer", CP: "Candy Industry", DF: "Dairy Foods",
    DT: "Distribution Trends", ENR: "Engineering News‑Record", ES: "Engineered Systems NEWS",
    FCI: "Floor Covering Installer", FE: "FOOD ENGINEERING", FM: "Floor Trends & Installation",
    FP: "Flexible Packaging", FSM: "Food Safety Magazine", FT: "Floor Trends & Installation",
    IH: "Industrial Heating", IP: "Independent Processor", ISHN: "Industrial Safety & Hygiene News",
    MC: "Mission Critical", NEWS: "The ACHR NEWS", NP: "The National Provisioner",
    PC: "Process Cooling", PCI: "Paint & Coatings Industry", PF: "Prepared Foods",
    PH: "PHC News", PM: "Plumbing & Mechanical", PME: "Plumbing & Mechanical Engineer",
    PS: "Packaging Strategies", QM: "Quality Magazine", QTY: "Quality Magazine",
    RC: "Roofing Contractor", RFF: "Refrigerated & Frozen Foods", RR: "Restoration & Remediation",
    RSP: "Roofing State Publication", SDM: "SDM", SEC: "Security Magazine",
    SFWB: "Snack Food & Wholesale Bakery", SHT: "Supply House Times", SN: "Snips NEWS",
    SW: "Stone World", TB: "Tile Magazine", TD: "The Driller", TILE: "Tile Magazine",
    WC: "Walls & Ceilings"
  };

  const code = (document.getElementById("id8929")?.value || "BNP")
    .trim().toUpperCase();
  const longName = brandMap[code] || "BNP Media";

  document.querySelectorAll("*").forEach(el => {
    if (!el.children.length && el.textContent.includes("{{BRAND}}")) {
      el.textContent = el.textContent.replace(/{{BRAND}}/g, longName);
    }
  });

  window.currentBrand = longName;
  console.log("Brand placeholder →", longName);
});

/* ---------------------------------------------
   2 ▸ GLOBAL BRANDS DATA LOOKUP + LOGO (alphabetical)
----------------------------------------------*/
const BrandsData = {
  getBrandInfo: rawCode => {
    const code = rawCode?.trim().toUpperCase();
    if (!code) return null;

    // Core website + social URLs
    const d = {
      AR:  { website:"https://www.architecturalrecord.com", facebook:"https://www.facebook.com/ArchitecturalRecord", linkedin:"https://www.linkedin.com/company/architectural-record", instagram:"https://www.instagram.com/archrecordmag", youtube:"https://www.youtube.com/channel/UCLm5tl0U5QchVPQHh3qe4lg", twitter:"https://twitter.com/ArchRecord" },
      ASI: { website:"https://www.adhesivesmag.com", facebook:"https://www.facebook.com/Adhesives-Sealants-Industry-ASI-Magazine-162255710459126", linkedin:"https://www.linkedin.com/company/adhesives-sealants-industry", instagram:null, youtube:"https://www.youtube.com/user/ASIMag", twitter:"https://twitter.com/AdhesivesMag" },
      ASM: { website:"https://www.assemblymag.com", facebook:"https://www.facebook.com/AssemblyMagazine", linkedin:"https://www.linkedin.com/company/assembly-magazine", instagram:null, youtube:"https://www.youtube.com/user/AssemblyMagazine", twitter:"https://twitter.com/AssemblyMag" },
      BE:  { website:"https://www.buildingenclosureonline.com", facebook:"https://www.facebook.com/BldngEnclosure/", linkedin:"https://www.linkedin.com/company/building-enclosure-magazine", instagram:"https://www.instagram.com/buildingenclosuremag", youtube:"https://www.youtube.com/@buildingenclosure7306", twitter:"https://x.com/BldngEnclosure" },
      BI:  { website:"https://www.bevindustry.com", facebook:"https://www.facebook.com/BeverageIndustry", linkedin:"https://www.linkedin.com/company/beverage-industry-magazine", instagram:null, youtube:"https://www.youtube.com/user/BeverageIndustry", twitter:"https://twitter.com/BeverageInd" },
      BNP: { website:"https://www.bnpmedia.com", facebook:"https://www.facebook.com/BNPMediaInc", linkedin:"https://www.linkedin.com/company/bnp-media", instagram:null, youtube:null, twitter:"https://twitter.com/BNPMedia" },
      BNPE:{ website:"https://www.bnpengage.com", facebook:"https://www.facebook.com/bnpengagenew", linkedin:"https://www.linkedin.com/company/bnpengage", instagram:"https://www.instagram.com/bnpengage", youtube:"https://www.youtube.com/@bnpengage", twitter:null },
      CSTD:{ website:"https://www.floortrendsmag.com", facebook:null, linkedin:null, instagram:null, youtube:null, twitter:null },
      CP:  { website:"https://www.snackandbakery.com/candy-industry", facebook:"https://www.facebook.com/CandyIndustry", linkedin:"https://www.linkedin.com/company/candy-industry", instagram:null, youtube:"https://www.youtube.com/user/CandyIndustry", twitter:"https://twitter.com/CandyIndustry" },
      DF:  { website:"https://www.dairyfoods.com", facebook:"https://www.facebook.com/DairyFoods", linkedin:"https://www.linkedin.com/company/dairy-foods", instagram:null, youtube:"https://www.youtube.com/user/DairyFoods", twitter:"https://twitter.com/DairyFoods" },
      DT:  { website:"https://www.achrnews.com/publications/7-distribution-trends-magazine", facebook:"https://www.facebook.com/DistributionTrends", linkedin:"https://www.linkedin.com/company/distribution-trends", instagram:null, youtube:null, twitter:"https://twitter.com/DistTrends" },
      ENR: { website:"https://www.enr.com", facebook:"https://www.facebook.com/EngineeringNewsRecord", linkedin:"https://www.linkedin.com/company/engineering-news-record", instagram:null, youtube:"https://www.youtube.com/channel/UCMoDRPALIiRzvn0PUxpe5_g", twitter:"https://twitter.com/ENRnews" },
      ES:  { website:"https://www.achrnews.com/engineered-systems-news", facebook:"https://www.facebook.com/EngineeredSystems", linkedin:"https://www.linkedin.com/company/engineered-systems-magazine", instagram:"https://www.instagram.com/achrnews", youtube:null, twitter:"https://twitter.com/EngineeredSys" },
      FCI: { website:"https://www.floortrendsmag.com", facebook:null, linkedin:null, instagram:null, youtube:null, twitter:null },
      FE:  { website:"https://www.foodengineeringmag.com", facebook:"https://www.facebook.com/FoodEngineering", linkedin:"https://www.linkedin.com/company/food-engineering-magazine", instagram:null, youtube:"https://www.youtube.com/user/FoodEngineeringMag", twitter:"https://x.com/FoodEng" },
      FM:  { website:"https://www.floortrendsmag.com", facebook:"https://www.facebook.com/FloorTrends", linkedin:"https://www.linkedin.com/company/floor-trends-magazine", instagram:null, youtube:"https://www.youtube.com/user/FloorTrendsMag", twitter:"https://twitter.com/FloorTrendsMag" },
      FP:  { website:"https://www.packagingstrategies.com/flexible-packaging", facebook:"https://www.facebook.com/FlexiblePackaging", linkedin:"https://www.linkedin.com/company/flexible-packaging-magazine", instagram:null, youtube:"https://www.youtube.com/user/FlexiblePackagingMag", twitter:"https://twitter.com/FlexPackMag" },
      FSM: { website:"https://www.food-safety.com", facebook:"https://www.facebook.com/FoodSafetyMagazine", linkedin:"https://www.linkedin.com/company/food-safety-magazine", instagram:null, youtube:"https://www.youtube.com/user/FoodSafetyMagazine", twitter:"https://twitter.com/FoodSafetyMag" },
      FT:  { website:"https://www.floortrendsmag.com", facebook:"https://www.facebook.com/FloorTrends", linkedin:"https://www.linkedin.com/company/floor-trends-magazine", instagram:null, youtube:"https://www.youtube.com/user/FloorTrendsMag", twitter:"https://twitter.com/FloorTrendsMag" },
      IH:  { website:"https://www.industrialheating.com", facebook:null, linkedin:null, instagram:null, youtube:null, twitter:null },
      IP:  { website:"https://www.provisioneronline.com/publications/5", facebook:"https://www.facebook.com/NationalProvisioner", linkedin:"https://www.linkedin.com/company/the-national-provisioner", instagram:null, youtube:"https://www.youtube.com/user/NationalProvisioner", twitter:"https://twitter.com/NatlProvisioner" },
      ISHN:{ website:"https://www.ishn.com", facebook:"https://www.facebook.com/ISHNMagazine", linkedin:"https://www.linkedin.com/company/ishn-magazine", instagram:null, youtube:"https://www.youtube.com/user/ISHNMagazine", twitter:"https://twitter.com/ISHNMagazine" },
      MC:  { website:"https://www.missioncriticalmagazine.com", facebook:null, linkedin:null, instagram:null, youtube:null, twitter:null },
      NEWS:{ website:"https://www.achrnews.com", facebook:"https://www.facebook.com/achrnews", linkedin:"https://www.linkedin.com/company/achr-news-magazine", instagram:"https://www.instagram.com/achrnews", youtube:"https://www.youtube.com/user/achrnews", twitter:"https://twitter.com/achrnews" },
      NP:  { website:"https://www.provisioneronline.com", facebook:"https://www.facebook.com/NationalProvisioner", linkedin:"https://www.linkedin.com/company/the-national-provisioner", instagram:null, youtube:"https://www.youtube.com/user/NationalProvisioner", twitter:"https://twitter.com/NatlProvisioner" },
      PC:  { website:"https://www.process-cooling.com", facebook:null, linkedin:null, instagram:null, youtube:null, twitter:null },
      PCI: { website:"https://www.pcimag.com", facebook:"https://www.facebook.com/pcimag", linkedin:"https://www.linkedin.com/company/pci-magazine", instagram:null, youtube:"https://www.youtube.com/user/PCIMagazine", twitter:"https://twitter.com/pcimag" },
      PF:  { website:"https://www.preparedfoods.com", facebook:"https://www.facebook.com/PreparedFoods", linkedin:"https://www.linkedin.com/company/prepared-foods-magazine", instagram:"https://www.instagram.com/prprdfoods/", youtube:"https://www.youtube.com/user/PreparedFoodsMag", twitter:"https://twitter.com/preparedfoods" },
      PH:  { website:"https://www.phcppros.com/taxonomies/2224-phc-news", facebook:null, linkedin:null, instagram:null, youtube:null, twitter:null },
      PM:  { website:"https://www.pmmag.com", facebook:"https://www.facebook.com/PlumbingandMechanical", linkedin:"https://www.linkedin.com/company/plumbing-&-mechanical", instagram:null, youtube:"https://www.youtube.com/user/PMMag", twitter:"https://twitter.com/plumbingmag" },
      PME: { website:"https://www.pmmag.com/topics/6653-plumbing-mechanical-engineer", facebook:"https://www.facebook.com/PlumbingandMechanical", linkedin:"https://www.linkedin.com/company/plumbing-&-mechanical", instagram:null, youtube:"https://www.youtube.com/user/PMEMag", twitter:"https://twitter.com/plumbingmag" },
      PS:  { website:"https://www.packagingstrategies.com", facebook:null, linkedin:null, instagram:null, youtube:null, twitter:null },
      QM:  { website:"https://www.qualitymag.com", facebook:"https://www.facebook.com/QualityMagazine", linkedin:"https://www.linkedin.com/company/quality-magazine", instagram:null, youtube:"https://www.youtube.com/user/QualityMagazine", twitter:"https://twitter.com/QualityMagazine" },
      QTY: { website:"https://www.qualitymag.com", facebook:"https://www.facebook.com/QualityMagazine", linkedin:"https://www.linkedin.com/company/quality-magazine", instagram:null, youtube:"https://www.youtube.com/user/QualityMagazine", twitter:"https://twitter.com/QualityMagazine" },
      RC:  { website:"https://www.roofingcontractor.com", facebook:"https://www.facebook.com/RoofingContractorMag", linkedin:"https://www.linkedin.com/company/roofing-contractor-magazine", instagram:"https://www.instagram.com/roofingcontractormedia/", youtube:"https://www.youtube.com/user/RoofingContractorMag", twitter:"https://twitter.com/RoofContr" },
      RFF: { website:"https://www.refrigeratedfrozenfood.com", facebook:"https://www.facebook.com/RandFF", linkedin:"https://www.linkedin.com/company/refrigerated-frozen-foods-magazine", instagram:null, youtube:"https://www.youtube.com/user/RandFFMagazine", twitter:"https://twitter.com/RandFF" },
      RR:  { website:"https://www.randrmagonline.com", facebook:"https://www.facebook.com/RandRMag", linkedin:"https://www.linkedin.com/company/restoration-remediation-magazine", instagram:null, youtube:"https://www.youtube.com/user/RandRMag", twitter:"https://twitter.com/RandRMag" },
      RSP: { website:"https://www.roofingcontractor.com", facebook:null, linkedin:null, instagram:null, youtube:null, twitter:null },
      SDM: { website:"https://www.sdmmag.com", facebook:null, linkedin:null, instagram:null, youtube:null, twitter:null },
      SEC: { website:"https://www.securitymagazine.com", facebook:null, linkedin:null, instagram:null, youtube:null, twitter:null },
      SFWB:{ website:"https://www.snackandbakery.com", facebook:"https://www.facebook.com/SnackandBakery", linkedin:"https://www.linkedin.com/company/snack-food-wholesale-bakery/", instagram:null, youtube:"https://www.youtube.com/user/SnackFoodandBakery", twitter:"https://x.com/SFWB" },
      SHT: { website:"https://www.supplyht.com", facebook:"https://www.facebook.com/SupplyHouseTimes", linkedin:"https://www.linkedin.com/company/supply-house-times", instagram:null, youtube:null, twitter:"https://twitter.com/SupplyHT" },
      SN:  { website:"https://www.snipsmag.com", facebook:null, linkedin:null, instagram:null, youtube:null, twitter:null },
      SW:  { website:"https://www.stoneworld.com", facebook:"https://www.facebook.com/StoneWorldMagazine", linkedin:"https://www.linkedin.com/company/stone-world-magazine", instagram:null, youtube:"https://www.youtube.com/user/StoneWorldMagazine", twitter:"https://twitter.com/StoneWorldMag" },
      TB:  { website:"https://www.tile-magazine.com", facebook:null, linkedin:null, instagram:null, youtube:null, twitter:null },
      TD:  { website:"https://www.thedriller.com", facebook:"https://www.facebook.com/TheDrillerMagazine", linkedin:"https://www.linkedin.com/company/the-driller-magazine", instagram:null, youtube:"https://www.youtube.com/user/TheDrillerMag", twitter:"https://twitter.com/TheDrillerMag" },
      TILE:{ website:"https://www.tile-magazine.com", facebook:null, linkedin:null, instagram:null, youtube:null, twitter:null },
      WC:  { website:"https://www.wconline.com", facebook:"https://www.facebook.com/WallsnCeilings", linkedin:"https://www.linkedin.com/company/walls-ceilings-magazine", instagram:"https://www.instagram.com/wallsnceilings/", youtube:"https://www.youtube.com/user/WallsCeilingsMag", twitter:"https://x.com/WallsnCeilings" }
    };

    const base = d[code];
    if (!base) return null;

    // Human-readable names
    const nameMap = {
      AR:"Architectural Record",     ASI:"Adhesives & Sealants Industry", ASM:"Assembly Magazine",
      BE:"Building Enclosure",      BI:"Beverage Industry",                BNP:"BNP Media",
      BNPE:"BNP Engage",            CSTD:"Floor Covering Installer",      CP:"Candy Industry",
      DF:"Dairy Foods",             DT:"Distribution Trends",             ENR:"Engineering News‑Record",
      ES:"Engineered Systems NEWS", FCI:"Floor Covering Installer",       FE:"FOOD ENGINEERING",
      FM:"Floor Trends & Installation", FP:"Flexible Packaging",          FSM:"Food Safety Magazine",
      FT:"Floor Trends & Installation", IH:"Industrial Heating",          IP:"Independent Processor",
      ISHN:"Industrial Safety & Hygiene News", MC:"Mission Critical",      NEWS:"The ACHR NEWS",
      NP:"The National Provisioner", PC:"Process Cooling",               PCI:"Paint & Coatings Industry",
      PF:"Prepared Foods",          PH:"PHC News",                       PM:"Plumbing & Mechanical",
      PME:"Plumbing & Mechanical Engineer", PS:"Packaging Strategies",      QM:"Quality Magazine",
      QTY:"Quality Magazine",       RC:"Roofing Contractor",             RFF:"Refrigerated & Frozen Foods",
      RR:"Restoration & Remediation", RSP:"Roofing State Publication",   SDM:"SDM",
      SEC:"Security Magazine",      SFWB:"Snack Food & Wholesale Bakery", SHT:"Supply House Times",
      SN:"Snips NEWS",              SW:"Stone World",                    TB:"Tile Magazine",
      TD:"The Driller",             TILE:"Tile Magazine",                WC:"Walls & Ceilings"
    };

    // Logo URLs
    const logoMap = {
      AR:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/AR-FB.png",      ASI:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/ASI-FB.png",
      ASM:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/ASM-FB.png",    BE:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/BE-FB.png",
      BI:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/BI-FB.png",      BNP:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/BNP-FB.png",
      BNPE:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/BNPE-FB.png",   CSTD:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/CSTD-FB.png",
      CP:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/CP-FB.png",      DF:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/DF-FB.png",
      DT:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/DT-FB.png",      ENR:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/ENR-FB.png",
      ES:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/ES-FB.png",      FCI:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/FCI-FB.png",
      FE:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/FE-FB.png",      FM:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/FM-FB.png",
      FP:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/FP-FB.png",      FSM:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/FSM-FB.png",
      FT:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/FT-FB.png",      IH:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/IH-FB.png",
      IP:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/IP-FB.png",      ISHN:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/ISHN-FB.png",
      MC:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/MC-FB.png",      NEWS:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/NEWS_black_250.png",
      NP:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/NP-FB.png",      PC:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/PC-FB.png",
      PCI:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/PCI-FB.png",    PF:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/PF-FB.png",
      PH:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/PH-FB.png",      PM:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/PMCE-FB.jpg",
      PME:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/PMCE-FB.jpg",    PS:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/PS-FB.png",
      QM:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/QM-FB.png",      QTY:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/QM-FB.png",
      RC:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/RC-FB.png",      RFF:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/RFF-FB.png",
      RR:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/RR-FB.png",      RSP:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/RSP-FB.png",
      SDM:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/SDM-FB.png",    SEC:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/SEC-FB.png",
      SFWB:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/SFWB-FB.png",  SHT:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/SHT-FB.png",
      SN:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/SN-FB.png",      SW:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/SW-FB.png",
      TB:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/TB-FB.png",      TD:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/TD-FB.png",
      TILE:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/TILE-FB.png",  WC:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/WC-FB.png"
    };

    // Merge social data (base) with human name & logo
    return {
      ...base,
      name: nameMap[code] || "",
      logo: logoMap[code]   || null
    };
  }
};

// Expose alias for header/logo script if needed
window.BrandLogo = BrandsData;

/* ---------------------------------------------
   3 ▸ ACCOUNT‑LINK UPDATER  (register / login / pref / subscribe)
----------------------------------------------*/
document.addEventListener("DOMContentLoaded", () => {
  const url   = code => `https://bnp.dragonforms.com/loading.do?omedasite=${code}`;
  const $     = id   => document.getElementById(id);
  const brand = ($("id8929")?.value || "BNP")
                  .trim()
                  .toUpperCase();

  let forgotPasswordLink = "";
  let createAccountLink  = "";
  let loginLink          = "";
  let subscribeLink      = "";

  // Define dynamic links based on brand
  if (brand === "ASM") {
    forgotPasswordLink = url("ASM_forgotpassword");
    createAccountLink  = url("Assembly_Create");
    loginLink          = url("Assembly_Login");
  } else if (["AR", "NEWS", "ENR"].includes(brand)) {
    forgotPasswordLink = url(`${brand}_reset`);
    createAccountLink  = url(`${brand}_register`);
    loginLink          = url(`${brand}_login`);
    subscribeLink      = url(`${brand}_subscribe`);
  } else {
    // Generic brands: use lowercase 'forgotpassword'
    forgotPasswordLink = url(`${brand}_forgotpassword`);
    createAccountLink  = url(`${brand}_Create`);
    loginLink          = url(`${brand}_Login`);
  }

  // Build the preferences URL—use ACHR_pref1 for NEWS, otherwise <BRAND>_pref1
  const prefLink =
    brand === "NEWS"
      ? url("ACHR_pref1")
      : url(`${brand}_pref1`);

  // Update the links
  const registerLinkElement = $("register-link");
  if (registerLinkElement) registerLinkElement.href = createAccountLink;

  const loginLinkElement = $("login-link");
  if (loginLinkElement) loginLinkElement.href = loginLink;

  const prefLinkElement = $("pref-link");
  if (prefLinkElement) prefLinkElement.href = prefLink;

  const subscribeLinkElement = $("subscribe-link");
  if (subscribeLink && subscribeLinkElement) subscribeLinkElement.href = subscribeLink;

  // Forgot‑password link injection
  const passwordLabelContainer = $("password-label-container");
  if (passwordLabelContainer) {
    const placeholder = passwordLabelContainer.querySelector(".forgot-password-placeholder");
    if (placeholder && !passwordLabelContainer.querySelector(".forgot-password-text")) {
      const a = document.createElement("a");
      a.className   = "forgot-password-text";
      a.href        = forgotPasswordLink;
      a.textContent = "Forgot Password";
      placeholder.replaceWith(a);
    }
  }
});


/* ---------------------------------------------
   4 ▸ BRAND STYLE  (alphabetical list)
----------------------------------------------*/
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const code = (document.getElementById("id8929")?.value || "BNP")
      .trim()
      .toUpperCase();

    const S = {
      /* ===== A ===== */
      AR: {
        '--primary-color': '#114B8C',
        '--secondary-color': '#8898A9',
        '--background-color': '#FFFFFF',
        '--background-image': "url('https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/AR_Background.png')",
        '--text-color': '#333333',
        '--headline-font': "'Helvetica Neue Condensed Bold', sans-serif",
        '--body-font': "'Arial', sans-serif",
        '--brand-font-style': 'italic'
      },
      ASI: {
        '--primary-color': '#BE1E2D',
        '--secondary-color': '#0080A3',
        '--background-color': '#FFFFFF',
        '--background-image': 'none',
        '--text-color': '#333333',
        '--headline-font': "'Open Sans Condensed', sans-serif",
        '--body-font': "'PT Serif', serif",
        '--brand-font-style': 'bold'
      },
      ASM: {
        '--primary-color': '#008FD5',
        '--secondary-color': '#004276',
        '--background-color': '#FFFFFF',
        '--background-image': 'none',
        '--text-color': '#333333',
        '--headline-font': "'Open Sans', sans-serif",
        '--body-font': "'Open Sans', sans-serif",
        '--brand-text-transform': 'uppercase'
      },

      /* ===== B ===== */
      BE: {
        '--primary-color': '#F58220',
        '--secondary-color': '#0977BC',
        '--background-color': '#FFFFFF',
        '--background-image': 'none',
        '--text-color': '#333333',
        '--headline-font': "'Helvetica Neue Condensed Bold', sans-serif",
        '--body-font': "'Arial', sans-serif",
        '--brand-font-style': 'italic'
      },
      BI: {
        '--primary-color': '#177DBB',
        '--secondary-color': '#4D8341',
        '--background-color': '#FFFFFF',
        '--background-image': 'none',
        '--text-color': '#333333',
        '--headline-font': "'Open Sans Condensed', sans-serif",
        '--body-font': "'PT Serif', serif",
        '--brand-font-style': 'italic'
      },
      BNP: {
        '--primary-color': '#00365A',
        '--secondary-color': '#177DBB',
        '--background-color': '#FFFFFF',
        '--background-image': 'none',
        '--text-color': '#333333',
        '--headline-font': "'Open Sans Condensed', sans-serif",
        '--body-font': "'PT Serif', sans-serif",
        '--brand-font-style': 'italic'
      },
      BNPE: {
        '--primary-color': '#008FD5',
        '--secondary-color': '#F653A8',
        '--background-color': '#FFFFFF',
        '--background-image': 'none',
        '--text-color': '#333333',
        '--headline-font': "'Quicksand', sans-serif",
        '--body-font': "'Arial', sans-serif",
        '--brand-font-style': 'italic'
      },

      /* ===== C ===== */
      CSTD: {
        '--primary-color': '#AB373A',
        '--secondary-color': '#6D6E71',
        '--background-color': '#FFFFFF',
        '--background-image': 'none',
        '--text-color': '#333333',
        '--headline-font': "'Univers', sans-serif",
        '--body-font': "'PT Serif', serif",
        '--brand-font-style': 'italic'
      },
      CP: {
        '--primary-color': '#26BEB2',
        '--secondary-color': '#61CAE0',
        '--background-color': '#FFFFFF',
        '--background-image': 'none',
        '--text-color': '#333333',
        '--headline-font': "'Futura Medium', sans-serif",
        '--body-font': "'Arial', sans-serif",
        '--brand-font-style': 'italic'
      },

      /* ===== D ===== */
      DF: {
        '--primary-color': '#008FD5',
        '--secondary-color': '#F653A8',
        '--background-color': '#FFFFFF',
        '--background-image': 'none',
        '--text-color': '#333333',
        '--headline-font': "'Quicksand', sans-serif",
        '--body-font': "'Arial', sans-serif",
        '--brand-font-style': 'italic'
      },      DT: {
        '--primary-color': '#004B85',
        '--secondary-color': '#636467',
        '--background-color': '#FFFFFF',
        '--background-image': 'none',
        '--text-color': '#333333',
        '--headline-font': "'Arial, Helvetica, sans-serif'",
        '--body-font': "'Arial', sans-serif",
        '--brand-font-style': 'italic'
      },

      /* ===== E ===== */
      ENR: {
        '--primary-color': '#D71920',
        '--secondary-color': '#586B81',
        '--background-color': '#FFFFFF',
        '--background-image': "url('https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/ENR_Page_Background.png')",
        '--text-color': '#333333',
        '--headline-font': "'Helvetica Neue Condensed Bold', sans-serif",
        '--body-font': "'Arial', sans-serif",
        '--brand-font-style': 'normal'
      },
      ES: {
        '--primary-color': '#004B85',
        '--secondary-color': '#636467',
        '--background-color': '#FFFFFF',
        '--background-image': 'none',
        '--text-color': '#333333',
        '--headline-font': "'Arial, Helvetica, sans-serif'",
        '--body-font': "'PT Serif', serif",
        '--brand-font-style': 'normal',
        '--brand-text-transform': 'uppercase'
      },

      /* ===== F ===== */
      FCI: {
        '--primary-color': '#B91319',
        '--secondary-color': '#A02A26',
        '--background-color': '#FFFFFF',
        '--background-image': 'none',
        '--text-color': '#333333',
        '--headline-font': "'Open Sans, PT Serif Pro'",
        '--body-font': "'Arial', sans-serif",
        '--brand-font-style': 'italic'
      },
      FE: {
        '--primary-color': '#F1592A',
        '--secondary-color': '#942B32',
        '--background-color': '#FFFFFF',
        '--background-image': 'none',
        '--text-color': '#333333',
        '--headline-font': "'Open Sans, PT Serif'",
        '--body-font': "'Arial', sans-serif",
        '--brand-font-style': 'normal',
        '--text-transform': 'uppercase'
      },
      FM: {
        '--primary-color': '#773F8C',
        '--secondary-color': '#254857',
        '--background-color': '#FFFFFF',
        '--background-image': 'none',
        '--text-color': '#333333',
        '--headline-font': "'AZO Sans', sans-serif",
        '--body-font': "'PT Serif', serif",
        '--brand-font-style': 'normal',
        '--text-transform': 'uppercase'
      },
      FP: {
        '--primary-color': '#005298',
        '--secondary-color': '#8B2A4F',
        '--background-color': '#FFFFFF',
        '--background-image': 'none',
        '--text-color': '#333333',
        '--headline-font': "'Barlow, PT Serif'",
        '--body-font': "'Arial', sans-serif",
        '--brand-font-style': 'italic'
      },
      FSM: {
        '--primary-color': '#297FA5',
        '--secondary-color': '#582E56',
        '--background-color': '#FFFFFF',
        '--background-image': 'none',
        '--text-color': '#333333',
        '--headline-font': "'Open Sans Condensed, PT Serif'",
        '--body-font': "'Arial', sans-serif",
        '--brand-font-style': 'italic'
      },
      FT: {
        '--primary-color': '#215384',
        '--secondary-color': '#6461A6',
        '--background-color': '#FFFFFF',
        '--background-image': 'none',
        '--text-color': '#333333',
        '--headline-font': "'Open Sans, PT Serif Pro'",
        '--body-font': "'Arial', sans-serif",
        '--brand-font-style': 'normal'
      },

      /* ===== I ===== */
      IH: {
        '--primary-color': '#EC1B24',
        '--secondary-color': '#943C2B',
        '--background-color': '#FFFFFF',
        '--background-image': 'none',
        '--text-color': '#333333',
        '--headline-font': "'Eurostile Bold', sans-serif",
        '--body-font': "'Arial', sans-serif",
        '--brand-font-style': 'italic'
      },
      IP: {
        '--primary-color': '#EC1B24',
        '--secondary-color': '#943C2B',
        '--background-color': '#FFFFFF',
        '--background-image': 'none',
        '--text-color': '#333333',
        '--headline-font': "'Eurostile Bold', sans-serif",
        '--body-font': "'Arial', sans-serif",
        '--brand-font-style': 'italic'
      },
      ISHN: {
        '--primary-color': '#00396D',
        '--secondary-color': '#AF361F',
        '--background-color': '#FFFFFF',
        '--background-image': 'none',
        '--text-color': '#333333',
        '--headline-font': "'Helvetica Neue, Univers'",
        '--body-font': "'Arial', sans-serif",
        '--brand-font-style': 'italic'
      },

      /* ===== M ===== */
      MC: {
        '--primary-color': '#DA3834',
        '--secondary-color': '#6F6286',
        '--background-color': '#FFFFFF',
        '--background-image': 'none',
        '--text-color': '#333333',
        '--headline-font': "'PT Serif', serif",
        '--body-font': "'Arial', sans-serif",
        '--brand-font-style': 'italic'
      },

      /* ===== N ===== */
      NEWS: {
        '--primary-color': '#C52A21',
        '--secondary-color': '#717C83',
        '--background-color': '#FFFFFF',
        '--background-image': "url('https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/NEWS_Page_Background_V2.png')",
        '--text-color': '#333333',
        '--headline-font': "'Nimbus Sans Bold', sans-serif",
        '--body-font': "'Arial', sans-serif",
        '--brand-font-style': 'italic'
      },
      NP: {
        '--primary-color': '#B42333',
        '--secondary-color': '#32A8D6',
        '--background-color': '#FFFFFF',
        '--background-image': 'none',
        '--text-color': '#333333',
        '--headline-font': "'MetaPlus Lining Normal', sans-serif",
        '--body-font': "'Arial', sans-serif",
        '--brand-font-style': 'italic'
      },

      /* ===== P ===== */
      PC: {
        '--primary-color': '#00AEEF',
        '--secondary-color': '#231F20',
        '--background-color': '#FFFFFF',
        '--background-image': 'none',
        '--text-color': '#333333',
        '--headline-font': "'Open Sans', sans-serif",
        '--body-font': "'Arial', sans-serif",
        '--brand-font-style': 'italic'
      },
      PCI: {
        '--primary-color': '#C52B21',
        '--secondary-color': '#1D4386',
        '--background-color': '#FFFFFF',
        '--background-image': 'none',
        '--text-color': '#333333',
        '--headline-font': "'Open Sans Regular', sans-serif",
        '--body-font': "'Arial', sans-serif",
        '--brand-font-style': 'normal'
      },
      PF: {
        '--primary-color': '#D83D35',
        '--secondary-color': '#458398',
        '--background-color': '#FFFFFF',
        '--background-image': "url('https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/PF_Website_Background.png')",
        '--text-color': '#333333',
        '--headline-font': "'Open Sans Condensed Bold', sans-serif",
        '--body-font': "'Arial', sans-serif",
        '--brand-font-style': 'italic'
      },
      PH: {
        '--primary-color': '#D75626',
        '--secondary-color': '#333333',
        '--background-color': '#FFFFFF',
        '--background-image': 'none',
        '--text-color': '#333333',
        '--headline-font': "'Eurostile Bold Extended', sans-serif",
        '--body-font': "'Arial', sans-serif",
        '--brand-font-style': 'italic'
      },
      PM: {
        '--primary-color': '#0070B6',
        '--secondary-color': '#F28019',
        '--background-color': '#FFFFFF',
        '--background-image': 'none',
        '--text-color': '#333333',
        '--headline-font': "'Montserrat Bold', sans-serif",
        '--body-font': "'Arial', sans-serif",
        '--brand-font-style': 'italic'
      },
      PME: {
        '--primary-color': '#009933',
        '--secondary-color': '#336699',
        '--background-color': '#FFFFFF',
        '--background-image': 'none',
        '--text-color': '#333333',
        '--headline-font': "'Proxima Nova Bold', sans-serif",
        '--body-font': "'Arial', sans-serif",
        '--brand-font-style': 'italic'
      },
      PS: {
        '--primary-color': '#144069',
        '--secondary-color': '#0072BC',
        '--background-color': '#FFFFFF',
        '--background-image': 'none',
        '--text-color': '#333333',
        '--headline-font': "'Nunito Sans Bold', sans-serif",
        '--body-font': "'Arial', sans-serif",
        '--brand-font-style': 'italic'
      },

      /* ===== Q ===== */
      QM: {
        '--primary-color': '#b5111a',
        '--secondary-color': '#557391',
        '--background-color': '#FFFFFF',
        '--background-image': 'none',
        '--text-color': '#333333',
        '--headline-font': "'Merriweather Bold', serif",
        '--body-font': "'Arial', sans-serif",
        '--brand-font-style': 'italic'
      },
      QTY: {
        '--primary-color': '#b5111a',
        '--secondary-color': '#557391',
        '--background-color': '#FFFFFF',
        '--background-image': 'none',
        '--text-color': '#333333',
        '--headline-font': "'Merriweather Bold', serif",
        '--body-font': "'Arial', sans-serif",
        '--brand-font-style': 'italic'
      },

      /* ===== R ===== */
      RC: {
        '--primary-color': '#BA2234',
        '--secondary-color': '#00AEEF',
        '--background-color': '#FFFFFF',
        '--background-image': 'none',
        '--text-color': '#333333',
        '--headline-font': "'Calvert MT Bold', sans-serif",
        '--body-font': "'Arial', sans-serif",
        '--brand-font-style': 'italic'
      },
      RFF: {
        '--primary-color': '#135783',
        '--secondary-color': '#41B6E6',
        '--background-color': '#FFFFFF',
        '--background-image': "url('https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/RFF_Website_Background.png')",
        '--text-color': '#333333',
        '--headline-font': "'Archivo Bold', sans-serif",
        '--body-font': "'Arial', sans-serif",
        '--brand-font-style': 'italic'
      },
      RR: {
        '--primary-color': '#2E3192',
        '--secondary-color': '#00AEEF',
        '--background-color': '#FFFFFF',
        '--background-image': 'none',
        '--text-color': '#333333',
        '--headline-font': "'Clearface Gothic LH Black', sans-serif",
        '--body-font': "'Arial', sans-serif",
        '--brand-font-style': 'italic'
      },
      RSP: {
        '--primary-color': '#21414F',
        '--secondary-color': '#CE5B45',
        '--background-color': '#FFFFFF',
        '--background-image': 'none',
        '--text-color': '#333333',
        '--headline-font': "'Roc Grotesk Condensed Extra Bold', sans-serif",
        '--body-font': "'Arial', sans-serif",
        '--brand-font-style': 'italic'
      },

      /* ===== S ===== */
      SDM: {
        '--primary-color': '#BA890B',
        '--secondary-color': '#2D4F9E',
        '--background-color': '#FFFFFF',
        '--background-image': 'none',
        '--text-color': '#333333',
        '--headline-font': "'Montserrat Bold', sans-serif",
        '--body-font': "'Arial', sans-serif",
        '--brand-font-style': 'italic'
      },
      SEC: {
        '--primary-color': '#E30613',
        '--secondary-color': '#231F20',
        '--background-color': '#FFFFFF',
        '--background-image': 'none',
        '--text-color': '#333333',
        '--headline-font': "'Helvetica Neue Condensed Bold', sans-serif",
        '--body-font': "'Arial', sans-serif",
        '--brand-font-style': 'normal'
      },
      SFWB: {
        '--primary-color': '#f25c4d',
        '--secondary-color': '#215357',
        '--background-color': '#FFFFFF',
        '--background-image': 'none',
        '--text-color': '#333333',
        '--headline-font': "'Raleway Bold', sans-serif",
        '--body-font': "'Arial', sans-serif",
        '--brand-font-style': 'italic'
      },
      SHT: {
        '--primary-color': '#1F4C8B',
        '--secondary-color': '#FBAF3F',
        '--background-color': '#FFFFFF',
        '--background-image': 'none',
        '--text-color': '#333333',
        '--headline-font': "'ITC Avant Garde Gothic Bold', sans-serif",
        '--body-font': "'Arial', sans-serif",
        '--brand-font-style': 'italic'
      },
      SN: {
        '--primary-color': '#C52A21',
        '--secondary-color': '#BAB035',
        '--background-color': '#FFFFFF',
        '--background-image': 'none',
        '--text-color': '#333333',
        '--headline-font': "'Helvetica Neue LT Std 75 Bold', sans-serif",
        '--body-font': "'Arial', sans-serif",
        '--brand-font-style': 'normal',
        '--text-transform': 'uppercase'
      },
      SW: {
        '--primary-color': '#690A12',
        '--secondary-color': '#E15624',
        '--background-color': '#FFFFFF',
        '--background-image': 'none',
        '--text-color': '#333333',
        '--headline-font': "'Acumin Pro Condensed', sans-serif",
        '--body-font': "'Arial', sans-serif",
        '--brand-font-style': 'italic'
      },

      /* ===== T ===== */
      TB: {
        '--primary-color': '#0054A6',
        '--secondary-color': '#8D3088',
        '--background-color': '#FFFFFF',
        '--background-image': 'none',
        '--text-color': '#333333',
        '--headline-font': "'PT Serif', serif",
        '--body-font': "'Arial', sans-serif",
        '--brand-font-style': 'italic'
      },
      TD: {
        '--primary-color': '#0071BB',
        '--secondary-color': '#ED1A34',
        '--background-color': '#FFFFFF',
        '--background-image': 'none',
        '--text-color': '#333333',
        '--headline-font': "'Roboto Slab', sans-serif",
        '--body-font': "'Arial', sans-serif",
        '--brand-font-style': 'italic'
      },
      TILE: {
        '--primary-color': '#00344C',
        '--secondary-color': '#EFC779',
        '--background-color': '#FFFFFF',
        '--background-image': 'none',
        '--text-color': '#333333',
        '--headline-font': "'Avenir Next Condensed Bold', sans-serif",
        '--body-font': "'Arial', sans-serif",
        '--brand-font-style': 'italic'
      },

      /* ===== W ===== */
      WC: {
        '--primary-color': '#2F72B6',
        '--secondary-color': '#FF8A00',
        '--background-color': '#FFFFFF',
        '--background-image': 'none',
        '--text-color': '#333333',
        '--headline-font': "'Roboto Condensed', sans-serif",
        '--body-font': "'Arial', sans-serif",
        '--brand-font-style': 'italic'
      }
    };

    if (S[code]) {
      Object.entries(S[code]).forEach(([k, v]) =>
        document.documentElement.style.setProperty(k, v)
      );
      console.log("Brand styles applied:", code);
    } else {
      console.warn("No style block for", code);
    }
  }, 300);
});

/* ---------------------------------------------
   5 ▸ BRAND‑SPECIFIC FAVICON
----------------------------------------------*/
(() => {
  const setIcon = u => {
    ["icon", "apple-touch-icon-precomposed"].forEach(rel => {
      document.querySelectorAll(`link[rel='${rel}']`).forEach(l => l.remove());
    });
    const l = document.createElement("link");
    l.rel = "icon";
    l.type = "image/x-icon";
    l.href = u;
    document.head.appendChild(l);
  };

  const custom = {
    AR:"https://www.architecturalrecord.com/favicon.ico",
    BNP:"https://www.bnpmedia.com/wp-content/uploads/2025/01/bnp-site-icon-100x100.png",
    ENR:"https://www.enr.com/favicon.ico",
    FE:"https://www.foodengineeringmag.com/images/favicon/favicon-32x32.png",
    SN:"https://www.achrnews.com/images/favicon/favicons.ico",
    RFF:"https://www.refrigeratedfrozenfood.com/images/favicon/favicon-32x32.png"
  };

  const domain = {
    AR:"architecturalrecord.com", ASI:"adhesivesmag.com", ASM:"assemblymag.com", BE:"buildingenclosureonline.com",
    BI:"bevindustry.com", BNP:"bnpmedia.com", BNPE:"bnpengage.com", CSTD:"floortrendsmag.com",
    CP:"snackandbakery.com", DF:"dairyfoods.com", DT:"achrnews.com", ENR:"enr.com", ES:"achrnews.com",
    FCI:"floortrendsmag.com", FE:"foodengineeringmag.com", FM:"floortrendsmag.com", FP:"packagingstrategies.com",
    FSM:"food-safety.com", FT:"floortrendsmag.com", IH:"industrialheating.com", IP:"provisioneronline.com",
    ISHN:"ishn.com", MC:"missioncriticalmagazine.com", NEWS:"achrnews.com", NP:"provisioneronline.com",
    PC:"process-cooling.com", PCI:"pcimag.com", PF:"preparedfoods.com", PH:"phcppros.com",
    PM:"pmmag.com", PME:"pmmag.com", PS:"packagingstrategies.com", QM:"qualitymag.com",
    QTY:"qualitymag.com", RC:"roofingcontractor.com", RFF:"refrigeratedfrozenfood.com",
    RR:"randrmagonline.com", RSP:"roofingcontractor.com", SDM:"sdmmag.com", SEC:"securitymagazine.com",
    SFWB:"snackandbakery.com", SHT:"supplyht.com", SN:"achrnews.com", SW:"stoneworld.com",
    TB:"tile-magazine.com", TD:"thedriller.com", TILE:"tile-magazine.com", WC:"wconline.com"
  };

  document.addEventListener("DOMContentLoaded", () => {
    const code = (document.getElementById("id8929")?.value || "BNP")
                 .trim().toUpperCase();
    if (custom[code]) setIcon(custom[code]);
    else if (domain[code]) setIcon(`https://www.${domain[code]}/images/favicon/favicons.ico`);
  });
})();

/* ---------------------------------------------
   6 ▸ LABEL TEXT REWRITER
----------------------------------------------*/
document.addEventListener("DOMContentLoaded", () => {
  const rewrite = () => {
    document.querySelectorAll("label").forEach(l => {
      if (l.textContent.includes("Which of the following best describes your job title?"))
        l.textContent = "Select Primary Job Function";
      else if (l.textContent.includes("Which of the following best describes the primary product produced"))
        l.textContent = "Select Business Category";
    });
  };
  rewrite();
  new MutationObserver(rewrite).observe(document.body, { childList: true, subtree: true });
});

/* ---------------------------------------------
   7 ▸ FORCE‑REMOVE BACKGROUND IMAGE IF TAG MISSING
----------------------------------------------*/
document.addEventListener("DOMContentLoaded", () =>
  setTimeout(() => {
    if (!document.querySelector("industry-background-image")) {
      document.documentElement.style.setProperty("--background-image", "none", "important");
      console.log("No industry-background-image tag → bg disabled");
    }
  }, 300)
);

/* ---------------------------------------------
   8 ▸ TITLE‑CASE ALL <OPTION> TEXT
----------------------------------------------*/
document.addEventListener("DOMContentLoaded", () => {
  const title = s =>
    s
      .toLowerCase()
      .split(" ")
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  document.querySelectorAll("select option").forEach(o => (o.textContent = title(o.textContent)));
});

/* ---------------------------------------------
   9 ▸ MATCH SELECT FONT SIZE TO INPUT PLACEHOLDER
----------------------------------------------*/
document.addEventListener("DOMContentLoaded", () => {
  const ref = document.querySelector("input[placeholder]");
  if (!ref) return;
  let size = getComputedStyle(ref, "::placeholder").fontSize;
  if (!size || size === "0px") size = getComputedStyle(ref).fontSize;
  document.querySelectorAll("select").forEach(sel => {
    sel.style.setProperty("font-size", size, "important");
    sel.style.setProperty("color", "var(--placeholder-color)", "important");
  });
});

/* ---------------------------------------------
   10 ▸ FORCE 16px FONT ON MOBILE INPUTS
----------------------------------------------*/
(() => {
  const set16 = () =>
    document
      .querySelectorAll("input,textarea,select,button")
      .forEach(el => el.style.setProperty("font-size", "16px", "important"));
  document.addEventListener("DOMContentLoaded", set16);
  window.addEventListener("load", set16);
})();

/* ---------------------------------------------
   11 ▸ BLOCK SPECIFIC EXTERNAL STYLESHEET
----------------------------------------------*/
document.addEventListener("DOMContentLoaded", () => {
  const block = "https://cdn.omedastaging.com/hosted/images/dragon/generic/240.css";
  document.querySelectorAll('link[rel="stylesheet"]').forEach(l => {
    if (l.href === block) {
      l.remove();
      console.log("Blocked stylesheet:", block);
    }
  });
});


/* =============================  END OF FILE  ============================= */

