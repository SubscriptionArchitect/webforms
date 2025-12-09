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
   1 ▸ PLACEHOLDER REPLACER   {{BRAND}} + {{TAGLINE}}
----------------------------------------------*/
document.addEventListener("DOMContentLoaded", () => {
  const code = (document.getElementById("id8929")?.value || "BNP")
    .trim()
    .toUpperCase();

  // always use Section 2 BrandsData
  const brandInfo = window.BrandLogo?.getBrandInfo?.(code) || {};

  const longName = brandInfo.name    || "BNP Media";
  const tagline  = brandInfo.tagline || "";

  document.querySelectorAll("*").forEach(el => {
    if (!el.children.length) {
      if (el.textContent.includes("{{BRAND}}")) {
        el.textContent = el.textContent.replace(/{{BRAND}}/g, longName);
      }
      if (el.textContent.includes("{{TAGLINE}}")) {
        el.textContent = el.textContent.replace(/{{TAGLINE}}/g, tagline);
      }
    }
  });

  // expose globally
  window.currentBrand   = longName;
  window.currentTagline = tagline;

  console.log("Brand placeholder →", longName);
  console.log("Tagline placeholder →", tagline);
});

/* ---------------------------------------------
   2 ▸ GLOBAL BRANDS DATA LOOKUP + LOGO + TAGLINE
----------------------------------------------*/
const BrandsData = {
  getBrandInfo: rawCode => {
    const code = rawCode?.trim().toUpperCase();
    if (!code) return null;

    // Core website + social URLs
    const d = {
      AR: {
        website: "https://www.architecturalrecord.com",
        facebook: "https://www.facebook.com/ArchitecturalRecord",
        linkedin: "https://www.linkedin.com/company/architectural-record",
        instagram: "https://www.instagram.com/archrecordmag",
        youtube: "https://www.youtube.com/channel/UCLm5tl0U5QchVPQHh3qe4lg",
        twitter: "https://twitter.com/ArchRecord"
      },
      ASI: {
        website: "https://www.adhesivesmag.com",
        facebook: "https://www.facebook.com/Adhesives-Sealants-Industry-ASI-Magazine-162255710459126",
        linkedin: "https://www.linkedin.com/company/adhesives-sealants-industry",
        instagram: null,
        youtube: "https://www.youtube.com/user/ASIMag",
        twitter: "https://twitter.com/AdhesivesMag"
      },
      ASM: {
        website: "https://www.assemblymag.com",
        facebook: "https://www.facebook.com/AssemblyMagazine",
        linkedin: "https://www.linkedin.com/company/assembly-magazine",
        instagram: null,
        youtube: "https://www.youtube.com/user/AssemblyMagazine",
        twitter: "https://twitter.com/AssemblyMag"
      },
      BE: {
        website: "https://www.buildingenclosureonline.com",
        facebook: "https://www.facebook.com/BldngEnclosure/",
        linkedin: "https://www.linkedin.com/company/building-enclosure-magazine",
        instagram: "https://www.instagram.com/buildingenclosuremag",
        youtube: "https://www.youtube.com/@buildingenclosure7306",
        twitter: "https://x.com/BldngEnclosure"
      },
      BI: {
        website: "https://www.bevindustry.com",
        facebook: "https://www.facebook.com/BeverageIndustry",
        linkedin: "https://www.linkedin.com/company/beverage-industry-magazine",
        instagram: null,
        youtube: "https://www.youtube.com/user/BeverageIndustry",
        twitter: "https://twitter.com/BeverageInd"
      },
      BNP: {
        website: "https://www.bnpmedia.com",
        facebook: "https://www.facebook.com/BNPMediaInc",
        linkedin: "https://www.linkedin.com/company/bnp-media",
        instagram: null,
        youtube: null,
        twitter: "https://twitter.com/BNPMedia"
      },
      BNPE: {
        website: "https://www.bnpengage.com",
        facebook: "https://www.facebook.com/bnpengagenew",
        linkedin: "https://www.linkedin.com/company/bnpengage",
        instagram: "https://www.instagram.com/bnpengage",
        youtube: "https://www.youtube.com/@bnpengage",
        twitter: null
      },
      CSTD: {
        website: "https://www.floortrendsmag.com",
        facebook: null,
        linkedin: null,
        instagram: null,
        youtube: null,
        twitter: null
      },
      CP: {
        website: "https://www.snackandbakery.com/candy-industry",
        facebook: "https://www.facebook.com/CandyIndustry",
        linkedin: "https://www.linkedin.com/company/candy-industry",
        instagram: null,
        youtube: "https://www.youtube.com/user/CandyIndustry",
        twitter: "https://twitter.com/CandyIndustry"
      },
      DF: {
        website: "https://www.dairyfoods.com",
        facebook: "https://www.facebook.com/DairyFoods",
        linkedin: "https://www.linkedin.com/company/dairy-foods",
        instagram: null,
        youtube: "https://www.youtube.com/@Dairyfoods",
        twitter: "https://twitter.com/DairyFoods"
      },
      DT: {
        website: "https://www.achrnews.com/publications/7-distribution-trends-magazine",
        facebook: "https://www.facebook.com/DistributionTrends",
        linkedin: "https://www.linkedin.com/company/distribution-trends",
        instagram: null,
        youtube: null,
        twitter: "https://twitter.com/DistTrends"
      },
      ENR: {
        website: "https://www.enr.com",
        facebook: "https://www.facebook.com/EngineeringNewsRecord",
        linkedin: "https://www.linkedin.com/company/engineering-news-record",
        instagram: null,
        youtube: "https://www.youtube.com/channel/UCMoDRPALIiRzvn0PUxpe5_g",
        twitter: "https://twitter.com/ENRnews"
      },
      ES: {
        website: "https://www.achrnews.com/engineered-systems-news",
        facebook: "https://www.facebook.com/EngineeredSystems",
        linkedin: "https://www.linkedin.com/company/engineered-systems-magazine",
        instagram: "https://www.instagram.com/achrnews",
        youtube: null,
        twitter: "https://twitter.com/EngineeredSys"
      },
      ESNEWS: {
        website: "https://www.achrnews.com/engineered-systems-news",
        facebook: "https://www.facebook.com/EngineeredSystems",
        linkedin: "https://www.linkedin.com/company/engineered-systems-magazine",
        instagram: "https://www.instagram.com/achrnews",
        youtube: null,
        twitter: "https://twitter.com/EngineeredSys"
      },
      FCI: {
        website: "https://www.floortrendsmag.com",
        facebook: null,
        linkedin: null,
        instagram: null,
        youtube: null,
        twitter: null
      },
      FE: {
        website: "https://www.foodengineeringmag.com",
        facebook: "https://www.facebook.com/FoodEngineering",
        linkedin: "https://www.linkedin.com/company/food-engineering-magazine",
        instagram: null,
        youtube: "https://www.youtube.com/user/FoodEngineeringMag",
        twitter: "https://x.com/FoodEng"
      },
      FM: {
        website: "https://www.floortrendsmag.com",
        facebook: "https://www.facebook.com/FloorTrends",
        linkedin: "https://www.linkedin.com/company/floor-trends-magazine",
        instagram: null,
        youtube: "https://www.youtube.com/user/FloorTrendsMag",
        twitter: "https://twitter.com/FloorTrendsMag"
      },
      FP: {
        website: "https://www.packagingstrategies.com/flexible-packaging",
        facebook: "https://www.facebook.com/FlexiblePackaging",
        linkedin: "https://www.linkedin.com/company/flexible-packaging-magazine",
        instagram: null,
        youtube: "https://www.youtube.com/user/FlexiblePackagingMag",
        twitter: "https://twitter.com/FlexPackMag"
      },
      FSM: {
        website: "https://www.food-safety.com",
        facebook: "https://www.facebook.com/FoodSafetyMagazine",
        linkedin: "https://www.linkedin.com/company/food-safety-magazine",
        youtube: null,
        instagram: "https://www.instagram.com/foodsafetymag/",
        twitter: "https://twitter.com/FoodSafetyMag"
      },
      FT: {
        website: "https://www.floortrendsmag.com",
        facebook: "https://www.facebook.com/FloorTrends",
        linkedin: "https://www.linkedin.com/company/floor-trends-magazine",
        instagram: null,
        youtube: "https://www.youtube.com/user/FloorTrendsMag",
        twitter: "https://twitter.com/FloorTrendsMag"
      },
      IH: {
        website: "https://www.industrialheating.com",
        facebook: null,
        linkedin: null,
        instagram: null,
        youtube: null,
        twitter: null
      },
      IP: {
        website: "https://www.provisioneronline.com/publications/5",
        facebook: "https://www.facebook.com/NationalProvisioner",
        linkedin: "https://www.linkedin.com/company/the-national-provisioner",
        instagram: null,
        youtube: "https://www.youtube.com/user/NationalProvisioner",
        twitter: "https://twitter.com/NatlProvisioner"
      },
      ISHN: {
        website: "https://www.ishn.com",
        facebook: "https://www.facebook.com/ISHNMagazine",
        linkedin: "https://www.linkedin.com/company/ishn-magazine",
        instagram: null,
        youtube: "https://www.youtube.com/user/ISHNMagazine",
        twitter: "https://twitter.com/ISHNMagazine"
      },
      MC: {
        website: "https://www.missioncriticalmagazine.com",
        facebook: null,
        linkedin: null,
        instagram: null,
        youtube: null,
        twitter: null
      },
      NEWS: {
        website: "https://www.achrnews.com",
        facebook: "https://www.facebook.com/achrnews",
        linkedin: "https://www.linkedin.com/company/achr-news-magazine",
        instagram: "https://www.instagram.com/achrnews",
        youtube: "https://www.youtube.com/user/achrnews",
        twitter: "https://twitter.com/achrnews"
      },
      NP: {
        website: "https://www.provisioneronline.com",
        facebook: "https://www.facebook.com/NationalProvisioner",
        linkedin: "https://www.linkedin.com/company/the-national-provisioner",
        instagram: null,
        youtube: "https://www.youtube.com/user/NationalProvisioner",
        twitter: "https://twitter.com/NatlProvisioner"
      },
      PC: {
        website: "https://www.process-cooling.com",
        facebook: null,
        linkedin: null,
        instagram: null,
        youtube: null,
        twitter: null
      },
      PCI: {
        website: "https://www.pcimag.com",
        facebook: "https://www.facebook.com/PCIfan",
        linkedin: "https://www.linkedin.com/company/pci-magazine",
        instagram: null,
        youtube: "https://www.youtube.com/user/PCIMagazine",
        twitter: "https://twitter.com/pcimag"
      },
      PF: {
        website: "https://www.preparedfoods.com",
        facebook: "https://www.facebook.com/PreparedFoods",
        linkedin: "https://www.linkedin.com/company/prepared-foods-magazine",
        instagram: "https://www.instagram.com/prprdfoods/",
        youtube: "https://www.youtube.com/user/PreparedFoodsMag",
        twitter: "https://twitter.com/preparedfoods"
      },
      PH: {
        website: "https://www.phcppros.com/taxonomies/2224-phc-news",
        facebook: null,
        linkedin: null,
        instagram: null,
        youtube: null,
        twitter: null
      },
      PM: {
        website: "https://www.pmmag.com",
        facebook: "https://www.facebook.com/PMmagazine",
        linkedin: "https://www.linkedin.com/company/pm-magazine",
        instagram: "https://www.instagram.com/bnp_plumbinggroup/",
        youtube: "https://www.youtube.com/user/PlumbingMechanical",
        twitter: "https://twitter.com/PnMmag"
      },
      PME: {
        website: "https://www.pmmag.com/topics/6653-plumbing-mechanical-engineer",
        facebook: "https://www.facebook.com/PMmagazine",
        linkedin: "https://www.linkedin.com/company/pm-magazine",
        instagram: "https://www.instagram.com/bnp_plumbinggroup/",
        youtube: "https://www.youtube.com/user/PlumbingMechanical",
        twitter: "https://twitter.com/PnMmag"
      },
      PS: {
        website: "https://www.packagingstrategies.com",
        facebook: "https://www.facebook.com/PackStrat",
        linkedin: "https://www.linkedin.com/company/packaging-strategies-magazine",
        instagram: null,
        youtube: "https://www.youtube.com/user/PackagingStrategies",
        twitter: "https://twitter.com/PackStrat"
      },
      QM: {
        website: "https://www.qualitymag.com",
        facebook: "https://www.facebook.com/QualityMagazine",
        linkedin: "https://www.linkedin.com/company/quality-magazine",
        instagram: null,
        youtube: "https://www.youtube.com/user/QualityMagazine",
        twitter: "https://twitter.com/QualityMagazine"
      },
      QTY: {
        website: "https://www.qualitymag.com",
        facebook: "https://www.facebook.com/QualityMagazine",
        linkedin: "https://www.linkedin.com/company/quality-mag/",
        instagram: null,
        youtube: "https://www.youtube.com/user/QualityMagazine",
        twitter: "https://twitter.com/QualityMagazine"
      },
      RC: {
        website: "https://www.roofingcontractor.com",
        facebook: "https://www.facebook.com/RoofingContractorMag",
        linkedin: "https://www.linkedin.com/company/roofing-contractor-magazine",
        instagram: "https://www.instagram.com/roofingcontractormedia/",
        youtube: "https://www.youtube.com/user/RoofingContractorMag",
        twitter: "https://twitter.com/RoofContr"
      },
      RFF: {
        website: "https://www.refrigeratedfrozenfood.com",
        facebook: "https://www.facebook.com/RandFF",
        linkedin: "https://www.linkedin.com/company/refrigerated-frozen-foods-magazine",
        instagram: null,
        youtube: "https://www.youtube.com/user/RandFFMagazine",
        twitter: "https://twitter.com/RandFF"
      },
      RR: {
        website: "https://www.randrmagonline.com",
        facebook: "https://www.facebook.com/RandRMag",
        linkedin: "https://www.linkedin.com/company/restoration-remediation/",
        instagram: null,
        youtube: "https://www.youtube.com/user/RandRMagazine",
        twitter: "https://x.com/RnRMag"
      },
      RSP: {
        website: "https://www.roofingcontractor.com",
        facebook: null,
        linkedin: null,
        instagram: null,
        youtube: null,
        twitter: null
      },
      SDM: {
        website: "https://www.sdmmag.com",
        facebook: null,
        linkedin: null,
        instagram: null,
        youtube: null,
        twitter: null
      },
      SEC: {
        website: "https://www.securitymagazine.com",
        facebook: "https://www.facebook.com/SECmagazine",
        linkedin: "https://www.linkedin.com/company/security-magazine",
        instagram: null,
        youtube: "https://www.youtube.com/user/SecurityMag",
        twitter: "https://www.twitter.com/SecurityMag"
      },
      SFWB: {
        website: "https://www.snackandbakery.com",
        facebook: "https://www.facebook.com/SnackandBakery",
        linkedin: "https://www.linkedin.com/company/snack-food-wholesale-bakery/",
        instagram: null,
        youtube: "https://www.youtube.com/user/SnackFoodandBakery",
        twitter: "https://x.com/SFWB"
      },
      SHT: {
        website: "https://www.supplyht.com",
        facebook: "https://www.facebook.com/SupplyHouseTimes",
        linkedin: "https://www.linkedin.com/company/supply-house-times",
        instagram: null,
        youtube: null,
        twitter: "https://twitter.com/SupplyHT"
      },
SN: {
  website: "https://www.achrnews.com/snips-news",
  facebook: "https://www.facebook.com/ACHRNews",
  linkedin: "https://www.linkedin.com/company/achr-news-magazine",
  instagram: "https://www.instagram.com/achrnews",
  youtube: "https://www.youtube.com/user/ACHRNews",
  twitter: "https://x.com/ACHRNews"
},

      SW: {
        website: "https://www.stoneworld.com",
        facebook: "https://www.facebook.com/stoneworldmag/",
        linkedin: "https://www.linkedin.com/company/stone-world-magazine",
        instagram: null,
        youtube: "https://www.youtube.com/user/StoneWorldMag",
        twitter: "https://twitter.com/StoneWrld"
      },
      TB: {
        website: "https://www.tile-magazine.com",
        facebook: null,
        linkedin: null,
        instagram: null,
        youtube: null,
        twitter: null
      },
      TD: {
        website: "https://www.thedriller.com",
        facebook: "https://www.facebook.com/theDrillerMag",
        linkedin: "https://www.linkedin.com/company/thedriller",
        instagram: null,
        youtube: "https://www.youtube.com/c/TheDriller",
        twitter: "https://twitter.com/theDrillerMag"
      },
      TILE: {
        website: "https://www.tile-magazine.com",
        facebook: null,
        linkedin: null,
        instagram: null,
        youtube: null,
        twitter: null
      },
      WC: {
        website: "https://www.wconline.com",
        facebook: "https://www.facebook.com/WallsnCeilings",
        linkedin: "https://www.linkedin.com/company/walls-ceilings-magazine",
        instagram: "https://www.instagram.com/wallsnceilings/",
        youtube: "https://www.youtube.com/user/WallsCeilingsMag",
        twitter: "https://x.com/WallsnCeilings"
      }
    };

    // Human-readable names
    const nameMap = {
      AR:"Architectural Record", ASI:"Adhesives & Sealants Industry", ASM:"Assembly Magazine",
      BE:"Building Enclosure", BI:"Beverage Industry", BNP:"BNP Media", BNPE:"BNP Engage",
      CSTD:"Floor Covering Installer", CP:"Candy Industry", DF:"Dairy Foods", DT:"Distribution Trends",
      ENR:"Engineering News-Record", ES:"Engineered Systems NEWS", ESNEWS:"Engineered Systems NEWS",
      FCI:"Floor Covering Installer", FE:"FOOD ENGINEERING", FM:"Floor Trends & Installation",
      FP:"Flexible Packaging", FSM:"Food Safety Magazine", FT:"Floor Trends & Installation",
      IH:"Industrial Heating", IP:"Independent Processor", ISHN:"Industrial Safety & Hygiene News",
      MC:"Mission Critical", NEWS:"The ACHR NEWS", NP:"The National Provisioner",
      PC:"Process Cooling", PCI:"Paint & Coatings Industry", PF:"Prepared Foods",
      PH:"PHC News", PM:"Plumbing & Mechanical", PME:"Plumbing & Mechanical Engineer",
      PS:"Packaging Strategies", QM:"Quality Magazine", QTY:"Quality Magazine",
      RC:"Roofing Contractor", RFF:"Refrigerated & Frozen Foods", RR:"Restoration & Remediation",
      RSP:"Roofing State Publication", SDM:"SDM", SEC:"Security Magazine",
      SFWB:"Snack Food & Wholesale Bakery", SHT:"Supply House Times", SN:"SNIPS NEWS",
      SW:"Stone World", TB:"Tile Magazine", TD:"THE DRILLER", TILE:"Tile Magazine", WC:"Walls & Ceilings"
    };

    // Logo URLs
    const logoMap = {
      AR:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/AR-FB.png",
      ASI:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/ASI-FB.png",
      ASM:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/ASM-FB.png",
      BE:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/BE-FB.png",
      BI:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/BI-FB.png",
      BNP:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/BNP-FB.png",
      BNPE:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/BNPE-FB.png",
      CSTD:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/CSTD-FB.png",
      CP:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/CP-FB.png",
      DF:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/DF-FB.png",
      DT:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/DT-FB.png",
      ENR:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/ENR-FB.png",
      ES:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/ES-FB.png",
      ESNEWS:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/ES-FB.png",
      FCI:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/FCI-FB.png",
      FE:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/FE-FB.png",
      FM:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/FM-FB.png",
      FP:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/FP-FB.png",
      FSM:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/FSM-FB.png",
      FT:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/FT-FB.png",
      IH:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/IH-FB.png",
      IP:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/IP-FB.png",
      ISHN:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/ISHN-FB.png",
      MC:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/MC-FB.png",
      NEWS:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/NEWS_black_250.png",
      NP:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/NP-FB.png",
      PC:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/PC-FB.png",
      PCI:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/PCI-FB.png",
      PF:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/PF-FB.png",
      PH:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/PH-FB.png",
      PM:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/PMCE-FB.jpg",
      PME:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/PMCE-FB.jpg",
      PS:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/PS-FB.png",
      QM:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/QM-FB.png",
      QTY:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/QTY-FB.png",
      RC:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/RC-FB.png",
      RFF:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/RFF-FB.png",
      RR:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/RR-FB.png",
      RSP:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/RSP-FB.png",
      SDM:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/SDM-FB.png",
      SEC:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/SEC-FB.png",
      SFWB:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/SFWB-FB.png",
      SHT:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/SHT-FB.png",
      SN:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/SN-FB.png",
      SW:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/SW-FB.png",
      TB:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/TB-FB.png",
      TD:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/TD-FB.png",
      TILE:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/TILE-FB.png",
      WC:"https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/WC-FB.png"
    };

// Taglines
const taglineMap = {
  AR: "Architecture's Most Trusted Source",
  ASI: "Solutions for Adhesives & Sealants",
  ASM: "Driving Manufacturing Productivity",
  BE: "Your Building Envelope Authority",
  BI: "Insights for Beverage Leaders",
  BNP: "Serving the Business-to-Business Community",
  BNPE: "Marketing. Data. Growth.",
  CSTD: "Floor Covering News & Trends",
  CP: "The Voice of Candy Manufacturing",
  DF: "Dairy Industry Intelligence",
  DT: "Distribution & Supply Insights",
  ENR: "The #1 Source for Construction News, Data, Rankings, Analysis & Commentary",
  ESNEWS: "Written for Engineers by Engineers",
  ES: "HVAC Engineering News That Matters",
  FCI: "The Professional's Flooring Resource",
  FE: "Serving Food & Beverage Manufacturing",
  FM: "Trends in Flooring Design & Installation",
  FP: "Flexible Packaging Solutions",
  FSM: "Trusted By Experts. Powered by Science.",
  FT: "Covering Flooring Trends & Installation",
  IH: "Heat Processing Intelligence",
  IP: "Meat Processing Industry Source",
  ISHN: "Workplace Safety & Health Authority",
  MC: "Data Center & Mission Critical Insights",
  NEWS: "HVAC Contractors' Most Trusted Source",
  NP: "For Meat & Poultry Processors",
  PC: "Cooling Processes Efficiently",
  PCI: "Paint & Coatings Industry Insights",
  PF: "Food Innovation for Today & Tomorrow",
  PH: "Plumbing, Heating & Cooling Authority",
  PM: "The Plumbing & Mechanical Resource",
  PME: "Design & Engineer Better Buildings",
  PS: "Packaging Insights & Trends",
  QM: "Quality Professionals' Guide",
  QTY: "Quality Professionals' Guide",
  RC: "For Roofing Contractors Everywhere",
  RFF: "Refrigerated & Frozen Food Insights",
  RR: "Restoration & Remediation Industry Source",
  RSP: "Roofing Industry State Publications",
  SDM: "Security Distribution & Monitoring News",
  SEC: "Security Industry Authority",
  SFWB: "Bakery Industry Trends & Insights",
  SHT: "Supply House News & Insights",
  SN: "Sheet Metal & HVAC Contractors' Source",
  SW: "Stone Fabrication Industry Authority",
  TB: "The Voice of Tile Contractors",
  TD: "Your Community. Your Work. Your DRILLER.",
  TILE: "The Voice of Tile Contractors",
  WC: "Walls & Ceilings Trade Authority"
};


    const base = d[code];
    if (!base) return null;

    return {
      ...base,
      name: nameMap[code] || "",
      logo: logoMap[code] || null,
      tagline: taglineMap[code] || ""
    };
  }
};

// Expose alias for header/logo/tagline
window.BrandLogo = BrandsData;
/* ---------------------------------------------
   3 ▸ ACCOUNT-LINK UPDATER  (register / login / pref / subscribe + site links)
   - Builds pretty paths on account.brandsite.com when brand code is known
   - NEW: _account|_hello|_upgrade → /{brandcode}-account|hello|upgrade  (hyphen, not underscore)
   - NEW: If a link targets bnp.dragonforms.com for account/hello/upgrade, rewrite to account host pretty path
   - ESNEWS + SN/SNIPSNEWS continue to use ACHR infra overrides
   - Ensures #help-support (Customer Service) gets proper href
   - UPDATE: AR/NEWS/ENR join-link → https://subscribe.{brandDomain}/{BRAND}_subscribe
   - UPDATE: ENR hides Account UI; NEWS/AR Account → https://account.{brandDomain}/{BRAND}_myaccount
----------------------------------------------*/
(function () {
  // ---------- Helpers ----------
  const url = code => "https://bnp.dragonforms.com/loading.do?omedasite=" + code;
  const $   = id   => document.getElementById(id);

  function brandCode() {
    return ($("id8929")?.value || "BNP").trim().toUpperCase();
  }

  const KNOWN_DOMAIN_MAP = {
    AR:    "architecturalrecord.com",
    ENR:   "enr.com",
    NEWS:  "achrnews.com",
    RC:    "roofingcontractor.com",
    BI:    "beverageindustry.com",
    ES:    "esmagazine.com",
    SNIPS: "snipsmag.com",
    SN:    "snipsmag.com",
    PF:    "preparedfoods.com"
  };

  function helloOmedaCode(b) {
    if (b === "NEWS") return "ACHR_hello";
    if (b === "ASM")  return "Assembly_Hello";
    return b + "_hello";
  }
  function accountOmedaCode(b) {
    if (b === "NEWS") return "news_account";
    if (b === "ASM")  return "Assembly_Account";
    if (b === "PF")   return "PF_account";
    return b + "_account";
  }

  function normalizeToRootDomain(s) {
    if (!s) return "";
    var d = String(s).trim();
    d = d.replace(/^https?:\/\//i, "").replace(/\/.*$/, "");
    d = d.replace(/^www\./i, "");
    d = d.replace(/^account\./i, "");
    return d;
  }

  function resolveBrandDomain(code) {
    const mapped = KNOWN_DOMAIN_MAP[code];
    if (mapped) return mapped;

    const meta = n => document.querySelector('meta[name="' + n + '"]')?.getAttribute("content");
    const candidates = [
      window.BRAND_DOMAIN, window.brandDomain,
      window.BRAND_WEBSITE, window.brandWebsite,
      (window.__BNP && (window.__BNP.brandDomain || window.__BNP.domain || window.__BNP.website)),
      document.documentElement.dataset?.brandDomain,
      document.documentElement.dataset?.brandWebsite,
      meta("brand-domain"), meta("brand-website")
    ].filter(Boolean);

    for (const c of candidates) {
      const norm = normalizeToRootDomain(c);
      if (/\./.test(norm)) return norm;
    }

    const host = location.hostname || "";
    if (host && /\./.test(host)) {
      if (/^account\./i.test(host)) return host.replace(/^account\./i, "");
      if (!/dragonforms|omeda/i.test(host)) return normalizeToRootDomain(host);
    }
    return code.toLowerCase() + ".com";
  }

  function resolveAccountHost(brand, brandDomain) {
    if (brand === "ESNEWS") return "es-account.achrnews.com";
    if (brand === "SN" || brand === "SNIPSNEWS") return "sn-account.achrnews.com";
    return "account." + brandDomain;
  }

  function pathToken(brand) {
    if (brand === "NEWS")   return "news";
    if (brand === "ESNEWS") return "esnews";
    if (brand === "SN" || brand === "SNIPSNEWS") return "snipsnews";
    return brand.toLowerCase();
  }

  function prettyPath(base, token, kind) {
    return base + "/" + token + "-" + kind;
  }

  function setHref(href, selectors) {
    if (!href) return;
    for (const sel of selectors) {
      let els = [];
      if (sel.startsWith("#") || sel.startsWith(".")) {
        els = document.querySelectorAll(sel);
      } else {
        const el = document.getElementById(sel);
        if (el) els = [el];
      }
      els.forEach(el => { if (el && el.tagName === "A") el.href = href; });
    }
  }
  function lockHref(el, href) {
    if (!el) return;
    const apply = () => { if (el.href !== href) el.href = href; };
    apply();
    const mo = new MutationObserver(() => apply());
    mo.observe(el, { attributes: true, attributeFilter: ["href"] });
    setTimeout(apply, 1000);
    setTimeout(apply, 3000);
  }
  function replaceSpanWithAnchor(opts) {
    const selector = opts.selector, href = opts.href, text = opts.text, id = opts.id, className = opts.className;
    if (!href) return;
    document.querySelectorAll(selector).forEach((node) => {
      if (node.tagName === "A") {
        if (id && !node.id) node.id = id;
        if (className) node.classList.add(...className.split(/\s+/));
        node.textContent = node.textContent || text || "Forgot password?";
        lockHref(node, href);
        return;
      }
      const a = document.createElement("a");
      a.href = href;
      a.textContent = text || node.dataset.text || "Forgot password?";
      if (id) a.id = id;
      a.className = className || (node.className ? node.className.replace(/-placeholder\b/, "-link") : "forgot-password-link");
      if (node.dataset.target) a.target = node.dataset.target;
      if (node.dataset.rel) a.rel = node.dataset.rel;
      if (node.getAttribute("aria-label")) a.setAttribute("aria-label", node.getAttribute("aria-label"));
      node.replaceWith(a);
      lockHref(a, href);
    });
  }

  // New: hide Account UI for ENR
  function hideAccountUIForENR() {
    document.querySelectorAll("a,button,[role='button']").forEach(function(el){
      const href = (el.getAttribute("href") || "").toLowerCase();
      const id   = (el.id || "").toLowerCase();
      const cls  = (el.className || "").toLowerCase();
      const role = (el.getAttribute("data-role") || "").toLowerCase();
      const looksAccount =
        /account/.test(href) || /account/.test(id) || /account/.test(cls) || /account/.test(role) ||
        el === document.getElementById("account-link") || el.matches?.(".account-link,[data-role='account-link']");
      if (looksAccount) {
        el.style.display = "none";
        el.setAttribute("aria-hidden", "true");
        el.setAttribute("data-hidden-by", "account-link-updater");
      }
    });
  }

  function applyLinks() {
    const brand       = brandCode();
    const brandDomain = resolveBrandDomain(brand);
    const accountHost = resolveAccountHost(brand, brandDomain);
    const token       = pathToken(brand);
    const acctBase    = "https://" + accountHost;

    const prettyAccountURLDefault = prettyPath(acctBase, token, "account");
    const prettyUpgradeURL = prettyPath(acctBase, token, "upgrade");
    const prettyHelloURL   = prettyPath(acctBase, token, "hello");

    // NEW: join target for AR/NEWS/ENR goes to subscribe subdomain
    const joinTarget = (brand === "AR" || brand === "NEWS" || brand === "ENR")
      ? "https://subscribe." + brandDomain + "/" + brand + "_subscribe"
      : prettyHelloURL;

    // NEW: account URL override for NEWS/AR; hide for ENR
    const accountURL = (brand === "NEWS" || brand === "AR")
      ? "https://account." + brandDomain + "/" + brand + "_myaccount"
      : prettyAccountURLDefault;

    let forgotPasswordLink = "";
    let createAccountLink  = "";
    let loginLink          = "";
    let subscribeLink      = "";
    let prefLink           = "";
    let changePasswordLink = "";

    if (brand === "ASM") {
      forgotPasswordLink = url("ASM_forgotpassword");
      createAccountLink  = url("Assembly_Create");
      loginLink          = url("Assembly_Login");
      prefLink           = url("ASM_pref1");
      changePasswordLink = acctBase + "/" + token + "_changepassword";
    } else if (["AR", "NEWS", "ENR"].includes(brand)) {
      forgotPasswordLink = url(brand + "_reset");
      createAccountLink  = url(brand + "_register");
      loginLink          = url(brand + "_login");
      // keep subscribe-link in sync for these brands too
      subscribeLink      = "https://subscribe." + brandDomain + "/" + brand + "_subscribe";
      prefLink           = (brand === "NEWS") ? url("ACHR_pref1") : url(brand + "_pref1");

      if (brand === "NEWS") {
        changePasswordLink = "https://account.achrnews.com/loading.do?omedasite=news_pwupdate";
      } else if (brand === "AR" || brand === "ENR") {
        changePasswordLink = acctBase + "/loading.do?omedasite=" + brand + "_pwupdate";
      } else {
        changePasswordLink = acctBase + "/" + token + "_changepassword";
      }
    } else if (brand === "ESNEWS") {
      forgotPasswordLink = "https://es-account.achrnews.com/loading.do?omedasite=news_reset";
      createAccountLink  = "https://es-account.achrnews.com/loading.do?omedasite=esnews_register";
      loginLink          = "https://es-account.achrnews.com/loading.do?omedasite=esnews_login";
      subscribeLink      = "";
      prefLink           = "https://es-account.achrnews.com/loading.do?omedasite=achr_pref1";
      changePasswordLink = "https://account.achrnews.com/loading.do?omedasite=news_pwupdate";
    } else if (brand === "FE") {
      forgotPasswordLink = url("FE_forgotpassword");
      createAccountLink  = url("FE_Create");
      loginLink          = "https://bnp.dragonforms.com/FoodEngineering_Login";
      subscribeLink      = url("FE_subscribe");
      prefLink           = url("FE_pref1");
      changePasswordLink = acctBase + "/" + token + "_changepassword";
    } else if (brand === "SN" || brand === "SNIPSNEWS") {
      forgotPasswordLink = "https://sn-account.achrnews.com/loading.do?omedasite=news_reset";
      createAccountLink  = "https://sn-account.achrnews.com/loading.do?omedasite=snipsnews_register";
      loginLink          = "https://sn-account.achrnews.com/loading.do?omedasite=snipsnews_login";
      subscribeLink      = "";
      prefLink           = "https://sn-account.achrnews.com/loading.do?omedasite=achr_pref1";
      changePasswordLink = "https://account.achrnews.com/loading.do?omedasite=news_pwupdate";
    } else {
      forgotPasswordLink = url(brand + "_forgotpassword");
      createAccountLink  = url(brand + "_Create");
      loginLink          = url(brand + "_Login");
      prefLink           = url(brand + "_pref1");
      changePasswordLink = acctBase + "/" + token + "_changepassword";
      subscribeLink      = url(brand + "_subscribe");
    }

    // Upgrade (unchanged)
    setHref(prettyUpgradeURL, ["upgrade-link", "#upgrade-link", ".upgrade-link", "[data-role='upgrade-link']"]);
    lockHref(document.getElementById("upgrade-link") || document.querySelector(".upgrade-link,[data-role='upgrade-link']"), prettyUpgradeURL);

    // Account behavior per brand
    if (brand === "ENR") {
      hideAccountUIForENR();
    } else {
      setHref(accountURL, ["account-link", "#account-link", ".account-link", "[data-role='account-link']"]);
      lockHref(document.getElementById("account-link") || document.querySelector(".account-link,[data-role='account-link']"), accountURL);
    }

    // Join → subscribe subdomain for AR/NEWS/ENR
    setHref(joinTarget, ["join-link", "#join-link", ".join-link", "[data-role='join-link']"]);
    lockHref(document.getElementById("join-link") || document.querySelector(".join-link,[data-role='join-link']"), joinTarget);

    // Site links (as before)
    if (!["ESNEWS", "SN", "SNIPSNEWS"].includes(brand) && /\./.test(brandDomain)) {
      const topicsURL  = "https://" + brandDomain + "/topics";
      const homeURL    = "https://" + brandDomain + "/";
      const csURL      = "https://" + brandDomain + "/customerservice";
      const eMagURL    = "https://" + brandDomain + "/emagazine";

      setHref(topicsURL,  ["topic-link", "#topic-link", ".topic-link", "topics-link", "#topics-link", ".topics-link"]);
      setHref(homeURL,    ["home-link", "#home-link", ".home-link", "homepage-link", "#homepage-link", ".homepage-link"]);
      setHref(eMagURL,    ["digital-magazine", "#digital-magazine", ".digital-magazine", "[data-role='digital-magazine']"]);

      const csSelectors = [
        "customer-service-link", "#customer-service-link", ".customer-service-link",
        "customerservice-link", "#customerservice-link", ".customerservice-link",
        "help-support", "#help-support"
      ];
      setHref(csURL, csSelectors);
      const csEl = document.getElementById("help-support") || document.querySelector(".customer-service-link, .customerservice-link");
      if (csEl) lockHref(csEl, csURL);
    }

    setHref(createAccountLink,   ["register-link", "#register-link"]);
    setHref(loginLink,           ["login-link", "#login-link"]);
    setHref(prefLink,            ["pref-link", "#pref-link", ".pref-link", "[data-role='pref-link']"]);
    lockHref(document.getElementById("faq-newsletters") || document.querySelector(".pref-link,[data-role='pref-link']"), prefLink);

    if (subscribeLink) setHref(subscribeLink, ["subscribe-link", "#subscribe-link"]);
    setHref(forgotPasswordLink,  ["forgot-password-link", "#forgot-password-link"]);
    setHref(changePasswordLink, [
      "change-password-link", "#change-password-link", ".change-password-link", "[data-role='change-password-link']"
    ]);

    replaceSpanWithAnchor({
      selector: ".forgot-password-placeholder, #forgot-password-placeholder",
      href: forgotPasswordLink,
      text: "Forgot password",
      id: "forgot-password-link",
      className: "forgot-password-link"
    });
    replaceSpanWithAnchor({
      selector: ".change-password-placeholder, #change-password-placeholder",
      href: changePasswordLink,
      text: "Change password",
      id: "change-password-link",
      className: "change-password-link"
    });

    console.debug("✅ Link setup (pretty paths + join/account overrides) complete:", {
      brand: brand, brandDomain: brandDomain, accountHost: accountHost,
      prettyAccountURLDefault: prettyAccountURLDefault, accountURL: accountURL,
      prettyUpgradeURL: prettyUpgradeURL, prettyHelloURL: prettyHelloURL, joinTarget: joinTarget
    });
  }

  function computePrettyURLs() {
    const b = brandCode();
    const d = resolveBrandDomain(b);
    const host = resolveAccountHost(b, d);
    const t = pathToken(b);
    const base = "https://" + host;
    return {
      base: base,
      token: t,
      upgrade: base + "/" + t + "-upgrade",
      accountDefault: base + "/" + t + "-account",
      hello:   base + "/" + t + "-hello",
      brand: b,
      domain: d
    };
  }

  function rewriteDFToPrettyIfApplicable(a, targets) {
    try {
      const href = a.getAttribute("href") || "";
      const u = new URL(href, location.origin);
      const hostL = u.hostname.toLowerCase();
      if (!/bnp\.dragonforms\.com$/i.test(hostL)) return;

      const om = (u.searchParams.get("omedasite") || "").toLowerCase();
      if (!om) return;

      if (/hello\b/.test(om)) {
        // For hello, if AR/NEWS/ENR, force subscribe subdomain
        const joinOverride = (targets.brand === "AR" || targets.brand === "NEWS" || targets.brand === "ENR")
          ? "https://subscribe." + targets.domain + "/" + targets.brand + "_subscribe"
          : targets.hello;
        if (a.href !== joinOverride) a.href = joinOverride;
      } else if (/account\b/.test(om)) {
        // For account, ENR hides; NEWS/AR go to _myaccount; others pretty default
        if (targets.brand === "ENR") {
          a.style.display = "none";
          a.setAttribute("aria-hidden", "true");
          a.setAttribute("data-hidden-by", "account-link-updater");
        } else {
          const acctTarget = (targets.brand === "NEWS" || targets.brand === "AR")
            ? "https://account." + targets.domain + "/" + targets.brand + "_myaccount"
            : targets.accountDefault;
          if (a.href !== acctTarget) a.href = acctTarget;
        }
      } else if (/upgrade\b/.test(om)) {
        if (a.href !== targets.upgrade) a.href = targets.upgrade;
      }
    } catch {}
  }

  function enforcePrettyPaths() {
    const targets = computePrettyURLs();

    const looksLikeUpgrade = (path) =>
      /(^|\/)[a-z0-9-]*_upgrade$/.test(path) || /(^|\/)[a-z0-9-]*-upgrade$/.test(path) || /(^|\/)upgrade$/.test(path);

    const looksLikeAccount = (path) =>
      /(^|\/)[a-z0-9-]*_account$/.test(path) || /(^|\/)[a-z0-9-]*-account$/.test(path) || /(^|\/)account$/.test(path);

    const looksLikeHello = (path) =>
      /(^|\/)[a-z0-9-]*_hello$/.test(path) || /(^|\/)[a-z0-9-]*-hello$/.test(path) || /(^|\/)hello$/.test(path);

    document.querySelectorAll("a[href]").forEach(function(a){
      const raw = a.getAttribute("href") || "";
      let u;
      try { u = new URL(raw, location.origin); } catch { u = null; }

      if (u) {
        const path = u.pathname.toLowerCase();
        rewriteDFToPrettyIfApplicable(a, targets);

        if (looksLikeUpgrade(path)) {
          if (a.href !== targets.upgrade) a.href = targets.upgrade;
          return;
        }
        if (looksLikeAccount(path)) {
          if (targets.brand === "ENR") {
            a.style.display = "none";
            a.setAttribute("aria-hidden", "true");
            a.setAttribute("data-hidden-by", "account-link-updater");
          } else {
            const acctTarget = (targets.brand === "NEWS" || targets.brand === "AR")
              ? "https://account." + targets.domain + "/" + targets.brand + "_myaccount"
              : targets.accountDefault;
            if (a.href !== acctTarget) a.href = acctTarget;
          }
          return;
        }
        if (looksLikeHello(path)) {
          const joinOverride = (targets.brand === "AR" || targets.brand === "NEWS" || targets.brand === "ENR")
            ? "https://subscribe." + targets.domain + "/" + targets.brand + "_subscribe"
            : targets.hello;
          if (a.href !== joinOverride) a.href = joinOverride;
          return;
        }
      }
    });

    // Also enforce the explicit id/class hooks
    const upEl = document.getElementById("upgrade-link") || document.querySelector(".upgrade-link,[data-role='upgrade-link']");
    if (upEl && upEl.href !== targets.upgrade) upEl.href = targets.upgrade;

    const acEl = document.getElementById("account-link") || document.querySelector(".account-link,[data-role='account-link']");
    if (targets.brand === "ENR") {
      hideAccountUIForENR();
    } else if (acEl) {
      const acctTarget = (targets.brand === "NEWS" || targets.brand === "AR")
        ? "https://account." + targets.domain + "/" + targets.brand + "_myaccount"
        : targets.accountDefault;
      if (acEl.href !== acctTarget) acEl.href = acctTarget;
    }

    const joinEl = document.getElementById("join-link") || document.querySelector(".join-link,[data-role='join-link']");
    const joinTarget = (targets.brand === "AR" || targets.brand === "NEWS" || targets.brand === "ENR")
      ? "https://subscribe." + targets.domain + "/" + targets.brand + "_subscribe"
      : targets.hello;
    if (joinEl && joinEl.href !== joinTarget) joinEl.href = joinTarget;
  }

  function ready(fn){ (document.readyState === "loading") ? document.addEventListener("DOMContentLoaded", fn) : fn(); }
  function boot(){
    applyLinks();
    enforcePrettyPaths();

    const mo = new MutationObserver(() => enforcePrettyPaths());
    mo.observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ["href"] });

    setTimeout(enforcePrettyPaths, 500);
    setTimeout(enforcePrettyPaths, 2000);
    setTimeout(enforcePrettyPaths, 4000);
  }
  ready(boot);
})();



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
      },
      DT: {
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
        '--background-image': "url('https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/ES_Website_Background.png')",
        '--text-color': '#333333',
        '--headline-font': "'Arial, Helvetica, sans-serif'",
        '--body-font': "'PT Serif', serif",
        '--brand-font-style': 'normal',
        '--brand-text-transform': 'uppercase'
      },
      ESNEWS: {
        '--primary-color': '#004B85',
        '--secondary-color': '#636467',
        '--background-color': '#FFFFFF',
        '--background-image': "url('https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/ES_Website_Background.png')",
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
        '--headline-font': "'Open Sans', 'PT Serif Pro'",
        '--body-font': "'Arial', sans-serif",
        '--brand-font-style': 'italic'
      },
      FE: {
        '--primary-color': '#F1592A',
        '--secondary-color': '#207BBC',
        '--background-color': '#FFFFFF',
        '--background-image': "url('https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/FE-Website-Background.jpg')",
        '--text-color': '#333333',
        '--headline-font': "'Open Sans', 'PT Serif'",
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
        '--headline-font': "'Barlow', 'PT Serif'",
        '--body-font': "'Arial', sans-serif",
        '--brand-font-style': 'italic'
      },
      FSM: {
        '--primary-color': '#297FA5',
        '--secondary-color': '#582E56',
        '--background-color': '#FFFFFF',
        '--background-image': 'url("https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/FSM-Hero-Even.jpg")',
        '--text-color': '#333333',
        '--headline-font': "'Open Sans Condensed', 'PT Serif'",
        '--body-font': "'Arial', sans-serif",
        '--brand-font-style': 'italic'
      },
      FT: {
        '--primary-color': '#215384',
        '--secondary-color': '#6461A6',
        '--background-color': '#FFFFFF',
        '--background-image': 'none',
        '--text-color': '#333333',
        '--headline-font': "'Open Sans', 'PT Serif Pro'",
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
  '--background-image': 'url("https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/ISNH_Website_Background.jpg")',
  '--text-color': '#333333',
  '--headline-font': "'Helvetica Neue', 'Univers'",
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
        '--secondary-color': '#636467',
        '--background-color': '#FFFFFF',
        '--background-image': "url('https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/SNIPS_NEWS_Page_Background_v2.png')",
        '--text-color': '#333333',
        '--headline-font': "'Helvetica Neue LT Std 75 Bold', sans-serif",
        '--body-font': "'Arial', sans-serif",
        '--brand-font-style': 'normal',
        '--text-transform': 'uppercase'
      },
      SW: {
        '--primary-color': '#e71d13',
        '--secondary-color': '#073653',
        '--background-color': '#FFFFFF',
        '--background-image': "url('https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/SW-Website-Background.jpg')",
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
        '--primary-color': '#2375B2',
        '--secondary-color': '#E31936',
        '--background-color': '#FFFFFF',
        '--background-image': "url('https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/TD_FB_Background.png')",
        '--text-color': '#333333',
        '--headline-font': "'Arial', 'Helvetica Neue', Helvetica, sans-serif",
        '--body-font': "'Arial', 'Helvetica Neue', Helvetica, sans-serif",
        '--brand-font-style': 'normal',
        '--text-transform': 'uppercase'
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
    ESNEWS:"https://www.achrnews.com/images/favicon/favicons.ico",
    ES:"https://www.achrnews.com/images/favicon/favicons.ico",
    SNIPSNEWS:"https://www.achrnews.com/images/favicon/favicons.ico",
    SN:"https://www.achrnews.com/images/favicon/favicons.ico",
    FSM:"https://www.food-safety.com/favicon/favicon-32x32.png",
    RFF:"https://www.refrigeratedfrozenfood.com/images/favicon/favicon-32x32.png"
  };

  const domain = {
    AR:"architecturalrecord.com", ASI:"adhesivesmag.com", ASM:"assemblymag.com", BE:"buildingenclosureonline.com",
    BI:"bevindustry.com", BNP:"bnpmedia.com", BNPE:"bnpengage.com", CSTD:"floortrendsmag.com",
    CP:"snackandbakery.com", DF:"dairyfoods.com", DT:"achrnews.com", ENR:"enr.com", ES:"achrnews.com", ESNEWS:"achrnews.com",
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
   8 ▸ TITLE-CASE ALL <OPTION> TEXT
----------------------------------------------*/

document.addEventListener("DOMContentLoaded", () => {
  const SMALL = new Set([
    "a","an","the","and","but","or","for","nor",
    "as","at","by","in","of","on","per","to","via",
    "vs","vs.","with","without","over","under","into","onto","from","up","down"
  ]);

  function smartTitleCase(str) {
    const tokens = str.match(/([A-Za-z0-9]+|[^A-Za-z0-9]+)/g) || [str];
    let insideParens = false;

    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i];

      if (t === "(") { insideParens = true; continue; }
      if (t === ")") { insideParens = false; continue; }

      if (!/^[A-Za-z0-9]+$/.test(t)) continue;

      const isFirstWord = i === 0;
      const isLastWord  = i === tokens.length - 1;

      const isAcronymShort = /^[A-Z0-9]{2,3}$/.test(t); // short acronyms only
      const isMixedCase    = /[A-Z].*[a-z]|[a-z].*[A-Z]/.test(t);

      if (isAcronymShort || isMixedCase) continue; // keep as-is

      if (insideParens) {
        tokens[i] = t.toLowerCase();
        continue;
      }

      const lower = t.toLowerCase();
      if (!isFirstWord && !isLastWord && SMALL.has(lower)) {
        tokens[i] = lower;
      } else {
        tokens[i] = lower.charAt(0).toUpperCase() + lower.slice(1);
      }
    }

    let result = tokens.join("");

    // --- Custom replacements for country-style names ---
    result = result
      .replace(/\bIslands?\b/g, m => m.charAt(0).toUpperCase() + m.slice(1).toLowerCase()) // normalize if already Islands
      .replace(/\bIs\b(?=\s|$)/g, "Island")       // IS → Island
      .replace(/\bIs\b(?=lands?\b)/g, "Is")       // allow "Islands" to stay correct
      .replace(/\bSt\b/g, "St.")                  // ST → St.
      .replace(/\bRep\b/g, "Republic")            // REP → Republic
      .replace(/\bAnd\b/g, "&")                   // AND → &
      .replace(/\bVirgin Island\b/g, "Virgin Islands") // pluralize Virgin Islands correctly
      .replace(/\bIsle Of\b/g, "Isle of");        // special case: Isle of

    return result;
  }

  document.querySelectorAll("select option").forEach(o => {
    const txt = o.textContent.trim();

    const looksLikePrompt = /\?|^\s*(please\s*)?select\b|\(.*\bselect\b.*\)/i.test(txt);
    if (looksLikePrompt) return;

    o.textContent = smartTitleCase(txt);
  });
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
/* ---------------------------------------------
   12 ▸ GTM CORRECTOR / LOADER (by Brand Code)
   - Verifies the correct container for the brand
   - Injects if missing
   - Strips mismatched containers (enabled)
----------------------------------------------*/
(function(){
  // ===== 1) MAP: Brand Code → GTM Container =====
  var brandToGtm = {
    NEWS:  "GTM-M6RNBMC",
    ESNEWS:"GTM-M6RNBMC",
    SN:    "GTM-M6RNBMC",
    ASI:   "GTM-T53TMNP",
    AR:    "GTM-58X5SVH",
    ASM:   "GTM-KQPSDPG",
    BI:    "GTM-TRCVL9M",
    BE:    "GTM-TRS6ZDV",
    DF:    "GTM-W3KWLQ4",
    ENR:   "GTM-TBRF74H",
    FP:    "GTM-NRGM8BQ",
    FE:    "GTM-5JQSX8P",
    FSM:   "GTM-WQ7W9D2",
    ISHN:  "GTM-PFWVLJ7",
    PCI:   "GTM-W453CNT",
    PM:    "GTM-MSDV3PZ",
    PF:    "GTM-MP7VLQ9",
    NP:    "GTM-PRZMVCV",
    QTY:   "GTM-5NQ8CXJ",
    RFF:   "GTM-W2TJRJH",
    RT:    "GTM-PKKBBQS",
    RC:    "GTM-M3BV3FR",
    SDM:   "GTM-N462DLW",
    SEC:   "GTM-KNK327G",
    SFWB:  "GTM-P68H2W9",
    SW:    "GTM-W292HQK",
    SHT:   "GTM-5NC99JT",
    TD:    "GTM-WHRNPWR",
    WC:    "GTM-KFMFHHJ"
  };

  // Optional default if brand is unknown; set to a GTM id or keep null to skip
  var DEFAULT_CONTAINER = null;

  // Strip mismatched <script>/<noscript>/<iframe> (best-effort)
  var KILL_WRONG = true;

  // ===== 2) UTILITIES =====
  function upper(s){ return (s||"").toString().trim().toUpperCase(); }
  function getQP(n){ try{ return new URL(location.href).searchParams.get(n); }catch(e){ return null; } }

  function detectBrandCode(){
    // 1) URL overrides
    var u = getQP("brand") || getQP("bc") || getQP("brand_code");
    if (u) return upper(u);
    // 2) data attributes
    var da = (document.documentElement && document.documentElement.getAttribute("data-brand-code"))
          || (document.body && document.body.getAttribute("data-brand-code"));
    if (da) return upper(da);
    // 3) known field (Omeda)
    var el = document.getElementById("id8929") || document.querySelector('input[name="demo1120901"]');
    if (el && el.value) return upper(el.value);
    // 4) placeholder fallback
    var ph = document.querySelector('input[placeholder*="Brand Code" i]');
    if (ph && ph.value) return upper(ph.value);
    return "";
  }

  function mapToGtmId(code){
    if (!code) return DEFAULT_CONTAINER;
    return brandToGtm[code] || DEFAULT_CONTAINER;
  }

  function extractGtmIdFromUrl(u){
    var m = (u||"").match(/[?&]id=(GTM-[A-Z0-9]+)/i);
    return m ? m[1].toUpperCase() : null;
  }

  function presentGtmIds(){
    var found = {};
    // From GTM runtime
    if (window.google_tag_manager){
      for (var k in window.google_tag_manager){
        if (/^GTM-[A-Z0-9]+$/i.test(k)) found[k.toUpperCase()] = 1;
      }
    }
    // From script loaders
    var scripts = document.querySelectorAll('script[src*="googletagmanager.com/gtm"]');
    for (var i=0;i<scripts.length;i++){
      var id = extractGtmIdFromUrl(scripts[i].src);
      if (id) found[id] = 1;
    }
    // From noscript iframes
    var ifr = document.querySelectorAll('noscript iframe[src*="googletagmanager.com/ns.html"]');
    for (var j=0;j<ifr.length;j++){
      var id2 = extractGtmIdFromUrl(ifr[j].src);
      if (id2) found[id2] = 1;
    }
    return Object.keys(found);
  }

  function pushDL(obj){
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(obj);
  }

  function injectGtm(id, brand){
    if (!id) return;
    window.__BNP_GTM_LOADED = window.__BNP_GTM_LOADED || {};
    if (window.__BNP_GTM_LOADED[id]) return; // idempotent

    pushDL({ event:"brand_gtm_init", brandCode:brand||null, gtmContainer:id, pagePath:location.pathname+location.search });

    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtm.js?id="+encodeURIComponent(id)+"&l=dataLayer";
    if (window.__GTM_NONCE) s.setAttribute("nonce", window.__GTM_NONCE);

    var ref = document.getElementsByTagName("script")[0] || (document.head && document.head.firstChild);
    if (ref && ref.parentNode) ref.parentNode.insertBefore(s, ref);
    else (document.head || document.documentElement).appendChild(s);

    function addNoscript(){
      var ns = document.createElement("noscript");
      ns.innerHTML = '<iframe src="https://www.googletagmanager.com/ns.html?id='+id+'" height="0" width="0" style="display:none;visibility:hidden"></iframe>';
      if (document.body && document.body.firstChild) document.body.insertBefore(ns, document.body.firstChild);
      else if (document.body) document.body.appendChild(ns);
    }
    if (document.body) addNoscript(); else window.addEventListener("load", addNoscript, { once:true });

    window.__BNP_GTM_LOADED[id] = true;
  }

  function removeWrongTags(expectedId){
    if (!expectedId) return;

    // Remove mismatched <script> loaders
    var scripts = document.querySelectorAll('script[src*="googletagmanager.com/gtm"]');
    for (var i=0;i<scripts.length;i++){
      var sid = extractGtmIdFromUrl(scripts[i].src);
      if (sid && sid !== expectedId.toUpperCase()) scripts[i].remove();
    }
    // Remove mismatched noscript/iframe
    var ifr = document.querySelectorAll('noscript iframe[src*="googletagmanager.com/ns.html"]');
    for (var j=0;j<ifr.length;j++){
      var nid = extractGtmIdFromUrl(ifr[j].src);
      if (nid && nid !== expectedId.toUpperCase()){
        var p = ifr[j].parentNode;
        if (p && p.tagName === "NOSCRIPT") p.remove(); else ifr[j].remove();
      }
    }

    // Guard against future wrong inserts
    if (window.__BNP_GTM_MO) return; // only one observer
    window.__BNP_GTM_MO = new MutationObserver(function(muts){
      for (var k=0;k<muts.length;k++){
        var nodes = muts[k].addedNodes;
        if (!nodes) continue;
        for (var n=0;n<nodes.length;n++){
          var node = nodes[n];
          if (!node || !node.tagName) continue;
          var tag = node.tagName.toUpperCase();
          if (tag === "SCRIPT" && node.src && /googletagmanager\.com\/gtm/i.test(node.src)) {
            var id = extractGtmIdFromUrl(node.src);
            if (id && id !== expectedId.toUpperCase()) node.remove();
          } else if (tag === "IFRAME" && node.src && /googletagmanager\.com\/ns\.html/i.test(node.src)) {
            var id2 = extractGtmIdFromUrl(node.src);
            if (id2 && id2 !== expectedId.toUpperCase()) node.remove();
          } else if (tag === "NOSCRIPT") {
            var f = node.querySelector && node.querySelector('iframe[src*="googletagmanager.com/ns.html"]');
            if (f){
              var id3 = extractGtmIdFromUrl(f.src);
              if (id3 && id3 !== expectedId.toUpperCase()) node.remove();
            }
          }
        }
      }
    });
    window.__BNP_GTM_MO.observe(document.documentElement, { childList:true, subtree:true });
  }

  // ===== 3) QA OVERRIDE: ?gtm=GTM-XXXX =====
  var override = upper(getQP("gtm"));
  if (/^GTM-[A-Z0-9]+$/.test(override||"")){
    injectGtm(override, "OVERRIDE");
    if (KILL_WRONG) removeWrongTags(override);
    pushDL({ event:"brand_gtm_override", gtmContainer:override });
    console.log("GTM override injected (mismatch stripping on):", override);
    return;
  }

  // ===== 4) MAIN FLOW (brief poll for late brand fill) =====
  var start = Date.now();
  var MAX_MS = 2000, STEP = 120;

  (function resolveAndApply(){
    var brand = detectBrandCode();
    var expected = mapToGtmId(brand);

    if (!brand && Date.now() - start < MAX_MS) {
      return setTimeout(resolveAndApply, STEP);
    }

    if (!expected) {
      console.warn("No GTM mapping found for brand:", brand || "(unknown)");
      return;
    }

    var present = presentGtmIds();
    var hasExpected = false;
    for (var i=0;i<present.length;i++){
      if (present[i].toUpperCase() === expected.toUpperCase()) { hasExpected = true; break; }
    }

    if (!hasExpected) {
      injectGtm(expected, brand);
      console.log("Injected GTM:", expected, "brand:", brand, "previously found:", present);
    } else {
      pushDL({ event:"brand_gtm_verified", brandCode:brand||null, gtmContainer:expected });
      console.log("Correct GTM already present:", expected, "brand:", brand);
    }

    if (KILL_WRONG) removeWrongTags(expected);
  })();
})();


/* ---------------------------------------------
   13 ▸ NUKE SCRIM (#id + .class)
   - Removes #scrim and any .scrim element
   - Observes DOM forever and re-kills if re-added
----------------------------------------------*/
(function () {
  // Helper: remove node
  function removeNode(node) {
    if (node && node.parentNode) node.parentNode.removeChild(node);
  }

  // Kill scrims
  function killScrim() {
    // id based
    removeNode(document.getElementById("scrim"));
    // class based
    document.querySelectorAll(".scrim").forEach(removeNode);
  }

  function killAll() {
    killScrim();
  }

  // Initial sweep
  killAll();

  // Observer
  const observer = new MutationObserver(() => killAll());
  observer.observe(document.documentElement || document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["style", "class", "id", "src"]
  });

  // Safety sweep every 2s in case of sneaky injections
  setInterval(killAll, 2000);
})();


/* ---------------------------------------------
   14 ▸ TOTAL ONETRUST NUKE (brutal + persistent)
----------------------------------------------*/
(function () {
  if (window.__BNP_REMOVE_ONETRUST_FULL) return;
  window.__BNP_REMOVE_ONETRUST_FULL = true;

  // CSS override: permanently block visual artifacts or overlays
  const style = document.createElement("style");
  style.textContent = `
    #onetrust-banner-sdk,
    #onetrust-consent-sdk,
    #ot-sdk-btn,
    #ot-sdk-cookie-policy,
    #ot-sdk-cookie-setting,
    #ot-pc-content,
    #ot-pc-footer,
    .onetrust-pc-dark-filter,
    .onetrust-overlay,
    .ot-sdk-show-settings,
    [id*="onetrust"],
    [class*="onetrust"] {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
      position: absolute !important;
      z-index: -999999 !important;
    }
    html, body {
      overflow: visible !important;
    }
  `;
  document.head.appendChild(style);

  // Kill existing scripts and elements
  function nukeOneTrust() {
    const killSelectors = [
      '#onetrust-banner-sdk',
      '#onetrust-consent-sdk',
      '#ot-sdk-btn',
      '#ot-sdk-cookie-policy',
      '#ot-sdk-cookie-setting',
      '.onetrust-pc-dark-filter',
      '.onetrust-overlay',
      '[id*="onetrust"]',
      '[class*="onetrust"]',
      'script[src*="onetrust"]',
      'script[src*="cookieconsent"]',
      'iframe[src*="onetrust"]'
    ];
    document.querySelectorAll(killSelectors.join(",")).forEach(el => {
      try { el.remove(); } catch {}
    });

    // Nuke shadow DOM banners too
    document.querySelectorAll("*").forEach(el => {
      if (el.shadowRoot) {
        el.shadowRoot.querySelectorAll(killSelectors.join(",")).forEach(node => {
          try { node.remove(); } catch {}
        });
      }
    });

    // Remove JS globals if injected
    for (const k in window) {
      if (/onetru|onetrust|optanon/i.test(k)) {
        try { delete window[k]; } catch {}
      }
    }

    // Disable mutation observer re-injection from their script
    if (window.MutationObserver) {
      const observer = new MutationObserver(() => {
        document.querySelectorAll(killSelectors.join(",")).forEach(el => {
          try { el.remove(); } catch {}
        });
      });
      observer.observe(document.body || document.documentElement, { childList: true, subtree: true });
      setTimeout(() => observer.disconnect(), 30000);
    }

    console.log("✅ OneTrust completely neutralized.");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", nukeOneTrust, { once: true });
  } else {
    nukeOneTrust();
  }

  // Retry a few times in case delayed load happens
  for (let i = 1; i <= 10; i++) {
    setTimeout(nukeOneTrust, i * 1000);
  }
})();


/* =============================  DEMO LABEL UPDATE ============================= */
(function () {
  // Map of old text → new text
  const replacements = {
    "What is your primary business / industry? (select ONE only)": "Business Category",
    "What is your primary job function? (select ONE only)": "Job Category"
  };

  // Run after DOM ready
  document.addEventListener("DOMContentLoaded", () => {
    Object.keys(replacements).forEach(oldText => {
      const newText = replacements[oldText];

      // Look through all labels and headings
      document.querySelectorAll("label, legend, span, p, div").forEach(el => {
        if (el.textContent.trim() === oldText) {
          el.textContent = newText;
        }
      });
    });
  });
})();



/* =============================  END OF FILE  ============================= */
