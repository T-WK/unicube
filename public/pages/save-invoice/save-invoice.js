$(document).on("click", "#add-product-button", function () {
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

$(document).on("click", "#save-button", async function () {
  try {
    // 1) 기본 데이터 수집
    const companyId = parseInt(
      $("#placeholder-choice-company .dropdown #company-id").text(),
      10,
    );
    const invoiceNumber = $("#invoice-number .input").val();
    const clientName = $("#customer-name .input").val();
    const clientPhone = $("#customer-phone .input").val();

    // 2) 이미지 src → Blob 변환
    const invoiceImgSrc = sessionStorage.getItem("invoice_base64Image") || null;
    const productImgSrc = sessionStorage.getItem("product_base64Image") || null;

    // 3) 상품 리스트 수집
    const productInfos = [];
    $(".returned-product-wrapper .product-edit-container").each(function () {
      const $el = $(this);
      productInfos.push({
        product_id: parseInt($el.find(".dropdown #product-id").text(), 10),
        returned_quantity:
          parseInt($el.find("#spinner-1 .spinner-input").val(), 10) || 0,
        resalable_quantity:
          parseInt($el.find("#spinner-2 .spinner-input").val(), 10) || 0,
        note: $el.find("#placeholder-note .textarea").text().trim() || null,
      });
    });

    // 4) FormData 조립 (JSON 부분은 Blob으로 감싸서 append)
    const formData = {
      invoiceData: {
        company_id: companyId,
        name: clientName,
        phone: clientPhone,
        number: invoiceNumber,
        invoice_image: invoiceImgSrc,
        product_image: productImgSrc,
      },
      invoiceProduct: productInfos,
    };

    // 5) AJAX 전송
    const basePath = window.location.pathname.split("/")[1];
    $.ajax({
      url: `/${basePath}/api/invoice`,
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(formData),
      success: function (res) {
        sessionStorage.clear();
        alert("저장에 성공했습니다.");
        window.location.href = `/${basePath}/`;
      },
      error: function (xhr, status, err) {
        console.error("저장 실패:", err);
        alert("저장에 실패했습니다. 다시 시도해주세요.");
      },
    });
  } catch (e) {
    console.error("오류 발생:", e);
    alert("데이터 처리 중 오류가 발생했습니다.");
  }
});
