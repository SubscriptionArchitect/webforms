window.addEventListener("message", function(e){
  if (!e.data || typeof e.data !== "object") return;
  if (e.data.type !== "DF_IFRAME_RESIZE") return;

  var ifr = document.querySelector('iframe[src*="omedasite=enr_welcome"]');
  if (!ifr) return;

  ifr.style.height = parseInt(e.data.height, 10) + "px";
});

