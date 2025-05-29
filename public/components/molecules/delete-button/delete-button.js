(function () {
  const cssId = "delete-button-container";
  if (!document.getElementById(cssId)) {
    const link = document.createElement("link");
    link.id = cssId;
    link.rel = "stylesheet";
    link.href = "/components/molecules/delete-button/delete-button.css";
    document.head.appendChild(link);
  }
})();
