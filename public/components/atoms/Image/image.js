(function () {
  const cssId = "image";
  if (!document.getElementById(cssId)) {
    const link = document.createElement("link");
    link.id = cssId;
    link.rel = "stylesheet";
    link.href = "/components/atoms/Image/image.css";
    document.head.appendChild(link);
  }
})();
