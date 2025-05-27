(function () {
  const cssId = "button";
  if (!document.getElementById(cssId)) {
    const link = document.createElement("link");
    link.id = cssId;
    link.rel = "stylesheet";
    link.href = "/components/atoms/Button/button.css";
    document.head.appendChild(link);
  }
})();
