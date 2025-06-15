$(document).on("click", "#add-button", function () {
  const $component = $(
    '<div class="component-container flex-container margin-container"></div>',
  );
  // 1. HTML을 불러온다
  $component.load(
    "/components/organisms/edit-returned-product/edit-returned-product.html",
    function () {
      // 2. DOM에 추가한다
      $(".returned-product-wrapper").append($component);

      // 3. 내부 component-container들도 자동 초기화되게 한다
      window.autoLoadComponents($component);
    },
  );
});

$(document).on("click", "#save-button", function () {
  const invoiceNumber = $(document).find("#invoice-number").find(".input");
  const clientName = $(document).find("#customer-name").find(".input");
  const clientPhone = $(document).find("#customer-phone").find(".input");
});
