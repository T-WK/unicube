(function () {
  const cssId = "label";
  if (!document.getElementById(cssId)) {
    const link = document.createElement("link");
    link.id = cssId;
    link.rel = "stylesheet";
    link.href = "/components/atoms/Label/label.css";
    document.head.appendChild(link);
  }
})();