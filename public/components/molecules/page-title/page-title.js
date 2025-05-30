(function () {
  const cssId = "page-title-container";
  if (!document.getElementById(cssId)) {
    const link = document.createElement("link");
    link.id = cssId;
    link.rel = "stylesheet";
    link.href = "/components/molecules/page-title/page-title.css";
    document.head.appendChild(link);
  }
})();
