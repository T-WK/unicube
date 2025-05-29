(function () {
  const cssId = "dropdown";
  if (!document.getElementById(cssId)) {
    const link = document.createElement("link");
    link.id = cssId;
    link.rel = "stylesheet";
    link.href = "/components/molecules/dropdown/dropdown.css";
    document.head.appendChild(link);
  }
})();
