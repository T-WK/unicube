$(document).on(
  "click",
  "#get-invoice-page-access-button >.button",
  function () {
    const basePath = window.location.pathname.split("/")[1];

    window.location.href = `/${basePath}/ocr`;
  },
);
$(document).on("click", "#chart-page-access-button >.button", function () {
  const basePath = window.location.pathname.split("/")[1];

  window.location.href = `/${basePath}/search`;
});
$(document).on("click", "#product-page-access-button >.button", function () {
  const basePath = window.location.pathname.split("/")[1];

  window.location.href = `/${basePath}/product`;
});
$(document).on("click", "#company-page-access-button >.button", function () {
  const basePath = window.location.pathname.split("/")[1];

  window.location.href = `/${basePath}/company`;
});
