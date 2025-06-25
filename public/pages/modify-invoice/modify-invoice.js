$(function () {
  const basePath = window.location.pathname.split("/")[1];
  $.when(
    $.ajax({
      //url needs to be changed
      url: `/eElqYd63Ty0K/api/product`,
      method: "GET",
      contentType: "json",
    }),
    $.ajax({
      url: `/eElqYd63Ty0K/api/company`,
      method: "GET",
      contentType: "json",
    }),
  ).done(function (resFirst, resSecond) {
    // resFirst, resSecond는 [데이터, 상태, jqXHR] 형태의 배열

    const product_infos = resFirst[0];
    const company_infos = resSecond[0];
    const invoiceID = window.location.pathname.split("/").pop();
    $.ajax({
      url: `/${basePath}/api/invoice/${invoiceID}`,
      method: "GET",
      contentType: "json",
      success: function (res) {
        const invoiceData = res.invoiceData;

        var companyIndex = 0;
        for (i = 0; i < company_infos.length; i++) {
          if (company_infos[i].id == invoiceData.company_id) {
            companyIndex = i;
          }
        }

        const $companyDropdown = $("#placeholder-choice-company .dropdown");
        $companyDropdown
          .find("#company-id")
          .text(company_infos[companyIndex].id);
        $companyDropdown
          .find(".dropdown-label")
          .text(company_infos[companyIndex].name);

        $("#invoice-number .input").val(invoiceData.number);
        $("#customer-name .input").val(invoiceData.name);
        $("#customer-phone .input").val(invoiceData.phone);

        try {
          if (invoiceData.invoiceImg !== null) {
            ``;
            $("#invoice-photo .image").attr(
              "src",
              "data:image/jpeg;base64," + invoiceData.invoiceImg,
            );
          }
        } catch {}

        try {
          if (invoiceData.productImg !== null) {
            $("#product-photo .image").attr(
              "src",
              "data:image/jpeg;base64," + invoiceData.productImg,
            );
          }
        } catch {}

        for (i = 0; i < invoiceData.products.length; i++) {
          const product = invoiceData.products[i];
          var info = {};
          for (j = 0; j < product_infos.length; j++) {
            if (product_infos[j].id == product.product_id) {
              info.product_id = product.product_id;
              info.product_name = product_infos[j].name;
              info.company_id = product_infos[j].company_id;
              info.company_name = product_infos[j].company_name;
              info.returned_quantity = product.returned_quantity;
              info.resalable_quantity = product.resalable_quantity;
              info.note = product.note;
            }
          }
          addAllProductsAndThenNextStep(info, i);
        }
      },
      error: function (xhr, status, err) {
        console.log(err);
      },
    });
  });
});

async function addAllProductsAndThenNextStep(product, index) {
  await addComponentWithPromise();
  const $container = $(".returned-product-wrapper .product-edit-container").eq(
    index,
  );

  const $dropdown = $container.find(".dropdown .dropdown-button");
  $dropdown.find("#company-id").text(product.company_id);
  $dropdown.find("#product-id").text(product.product_id);
  $dropdown.find(".dropdown-label").text(product.product_name);

  $container.find("#spinner-1 .spinner-input").val(product.returned_quantity);
  $container.find("#spinner-2 .spinner-input").val(product.resalable_quantity);

  $container.find("#placeholder-note .textarea").val(product.note || "");
}

function addComponentWithPromise() {
  return new Promise((resolve, reject) => {
    const $component = $(
      '<div class="component-container flex-container margin-container"></div>',
    );
    $component.load(
      "/components/organisms/edit-returned-product/edit-returned-product.html",
      function () {
        $(".returned-product-wrapper").append($component);
        autoLoadComponents($component).then(resolve).catch(reject);
      },
    );
  });
}

$(document).on("click", "#add-product-button", function () {
  addComponentWithPromise();
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

    // 2) 이미지 base64 데이터
    const invoiceImgSrc = $("#invoice-photo .image").attr("src") || null;
    const productImgSrc = $("#product-photo .image").attr("src") || null;

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
        note: $el.find("#placeholder-note .textarea").val().trim() || null,
      });
    });

    const invoiceID = parseInt(window.location.pathname.split("/").pop(), 10);
    // 4) FormData 조립 (JSON 부분은 Blob으로 감싸서 append)
    const formData = {
      invoiceData: {
        id: invoiceID,
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
      method: "PATCH",
      contentType: "application/json",
      data: JSON.stringify(formData),
      success: function (res) {
        sessionStorage.clear();
        alert("저장에 성공했습니다.");
        window.location.href = `/${basePath}/search`;
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

$(document).on("click", ".delete-invoice-btn", async function () {
  try {
    const invoiceID = window.location.pathname.split("/").pop();
    const basePath = window.location.pathname.split("/")[1];
    $.ajax({
      url: `/${basePath}/api/invoice/${invoiceID}`,
      method: "DELETE",
      contentType: "application/json",
      success: function (res) {
        sessionStorage.clear();
        alert("삭제에 성공했습니다.");
        window.location.href = `/${basePath}/search`;
      },
      error: function (xhr, status, err) {
        console.error("삭제 실패:", err);
        alert("삭제에 실패했습니다. 다시 시도해주세요.");
      },
    });
  } catch (e) {
    console.error("오류 발생:", e);
    alert("삭제에 실패했습니다.");
  }
});
