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
    const invoiceImgSrc =
      dataURLtoBlob(sessionStorage.getItem("invoice_base64Image")) || null;
    const productImgSrc =
      dataURLtoBlob(sessionStorage.getItem("product_base64Image")) || null;

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

    console.log(formData);
    // 5) AJAX 전송
    const basePath = window.location.pathname.split("/")[1];
    $.ajax({
      url: `/${basePath}/api/invoice`,
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(formData),
      success: function (res) {
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

/**
 * Base64 Data URL → Blob
 * @param {string} dataURL — 'data:[<mediatype>][;base64],<data>' 형태 문자열
 * @returns {Blob}
 */
function dataURLtoBlob(dataURL) {
  // 1) Data URL을 헤더와 순수 Base64 데이터로 분리
  const [header, base64] = dataURL.split(",");
  // 2) 헤더에서 MIME 타입 추출
  const mimeMatch = header.match(/data:([^;]+);base64/);
  const contentType = mimeMatch ? mimeMatch[1] : "";
  // 3) atob로 디코딩 후 binary string 생성
  const binaryString = atob(base64);
  const len = binaryString.length;
  // 4) Uint8Array로 변환
  const u8arr = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    u8arr[i] = binaryString.charCodeAt(i);
  }
  // 5) Blob 생성
  return new Blob([u8arr], { type: contentType });
}
