(function () {
  const cssId = "modal-background";
  if (!document.getElementById(cssId)) {
    const link = document.createElement("link");
    link.id = cssId;
    link.rel = "stylesheet";
    link.href = "/components/organisms/add-product-modal/add-product-modal.css";
    document.head.appendChild(link);
  }
});
