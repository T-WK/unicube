(function () {
  // css 링크
  const cssId = "labeled-image";
  if (!document.getElementById(cssId)) {
    const link = document.createElement("link");
    link.id = cssId;
    link.rel = "stylesheet";
    link.href = "/components/molecules/labeled-image/labeled-image.css";
    document.head.appendChild(link);
  }
})();
