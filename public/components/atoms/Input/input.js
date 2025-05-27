(function () {
  const cssId = "input";
  if (!document.getElementById(cssId)) {
    const link = document.createElement("link");
    link.id = cssId;
    link.rel = "stylesheet";
    link.href = "/components/atoms/Input/input.css";
    document.head.appendChild(link);
  }
})();
