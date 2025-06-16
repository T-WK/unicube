$(document).ready(function () {
  const $tbody = $("#productTableBody");
  const bashPath = window.location.pathname.split("/")[1];

  // 검색창에 데이터 불러오기
  $.ajax({
    url: `/${bashPath}/api/product`, // ← 필요 시 주소 수정
    method: "GET",
    dataType: "json",
    success: function (data) {
      data.forEach(function (product_info) {
        const $tr = $(`
          <tr>
            <td class="px-4 py-2 text-sm text-gray-700">${product_info.id}</td>
            <td class="px-4 py-2 text-sm text-gray-700">${product_info.name}</td>
            <td class="px-4 py-2 text-sm text-gray-700">${product_info.company_name}</td>
            <td class="px-4 py-2 text-sm text-gray-700">
              <button class="text-blue-500 hover:underline view-detail-btn" data-id="${product_info.id}">보기</button>
            </td>
          </tr>
        `);
        $tbody.append($tr);
      });
      $tbody.on("click", ".view-detail-btn", function () {
        const id = $(this).data("id");

        // 특정 상품의 상세 정보
        $.ajax({
          url: `/${bashPath}/api/product/${id}`,
          method: "GET",
          dataType: "json",
          success: function (product) {
            // 값 채우기
            $('[id~="modify-modal"]')
              .find("#placeholder-product-name input")
              .val(product.name);

            $('[id~="modify-modal"]').find("#product-id").text(id);

            // 모달 보여주기modify-modal
            $('[id~="modify-modal"]').removeClass("hidden").show();
          },
          error: function () {
            alert("상품 정보를 불러오지 못했습니다.");
          },
        });
      });
    },
    error: function (err) {
      console.error("데이터 로딩 오류:", err);
      $tbody.html(`
        <tr>
          <td colspan="5" class="px-4 py-2 text-center text-red-500">데이터 로딩 실패</td>
        </tr>
      `);
    },
  });

  // 검색 버튼 눌렀을 때.
  $("#searchBtn").on("click", function () {
    $.ajax({
      url: `/${bashPath}/api/product/search`, // ← 필요 시 주소 수정
      method: "GET",
      dataType: "json",
      data: { name: $("#keyword").val() },
      success: function (data) {
        $tbody.empty(); // 기존 테이블 내용 제거 (이거 꼭 있어야 해!)
        data.forEach(function (product_info) {
          const $tr = $(`
            <tr>
              <td class="px-4 py-2 text-sm text-gray-700">${product_info.id}</td>
              <td class="px-4 py-2 text-sm text-gray-700">${product_info.name}</td>
              <td class="px-4 py-2 text-sm text-gray-700">${product_info.company_name}</td>
              <td class="px-4 py-2 text-sm text-gray-700">
                <button class="text-blue-500 hover:underline view-detail-btn" data-id="${product_info.id}">보기</button>
              </td>
            </tr>
          `);
          $tbody.append($tr);
        });
        $tbody.on("click", ".view-detail-btn", function () {
          const id = $(this).data("id");

          $('[id~="modify-modal"]').find("#product-id").text(id);
          alert(id);

          $.ajax({
            url: `/${bashPath}/api/product/${id}`,
            method: "GET",
            dataType: "json",
            success: function (product) {
              $('[id~="modify-modal"]')
                .find("#placeholder-product-name input")
                .val(product.name);

              // 모달 보여주기modify-modal
              $('[id~="modify-modal"]').removeClass("hidden").show();
            },
            error: function () {
              alert("상품 정보를 불러오지 못했습니다.");
            },
          });
        });
      },
      error: function (err) {
        console.error("데이터 로딩 오류:", err);
        $tbody.html(`
          <tr>
            <td colspan="5" class="px-4 py-2 text-center text-red-500">데이터 로딩 실패</td>
          </tr>
        `);
      },
    });
  });

  // 모달의 수정버튼 클릭 시
  $(document).on(
    "click",
    ".modal-container #modify-button button",
    function () {
      $productID = $('[id~="modify-modal"]').find("#product-id").text();
      $productName = $('[id~="modify-modal"]')
        .find("#placeholder-product-name input")
        .val();

      $.ajax({
        url: `/${bashPath}/api/product/${$productID}`,
        method: "PATCH",
        contentType: "application/json",
        data: JSON.stringify({ name: $productName }),
        success: function (response) {
          console.log("상품수정 성공:", response);
          alert("상품수정에 성공했어요.");
          location.reload();
        },
        error: function (xhr, status, error) {
          console.error("상품수정 실패:", error);
          alert("오류가 발생했습니다. 다시 시도해주세요.");
        },
      });
    },
  );

  // 모달의 삭제버튼 클릭 시
  $(document).on(
    "click",
    ".modal-container #delete-button button",
    function () {
      $productID = $('[id~="modify-modal"]').find("#product-id").text();

      $.ajax({
        url: `/${bashPath}/api/product/${$productID}`,
        method: "DELETE",
        contentType: "application/json",
        success: function (response) {
          console.log("상품제거 성공:", response);
          alert("상품제거에 성공했어요.");
          location.reload();
        },
        error: function (xhr, status, error) {
          console.error("상품제거 실패:", error);
          alert("오류가 발생했습니다. 다시 시도해주세요.");
        },
      });
    },
  );

  // 추가 버튼 클릭 시
  $(document).on("click", "#add-button .button", function () {
    const name = $("#placeholder-product-name input").val().trim();
    const companyID = $("#placeholder-choice-company .dropdown #company-id")
      .text()
      .trim();
    const bashPath = window.location.pathname.split("/")[1];

    if (!name) {
      alert("제품이름을 입력하세요.");
      return;
    }

    if (companyID === "-1") {
      alert("업체를 선택하세요.");
      return;
    }

    $.ajax({
      url: `/${bashPath}/api/product`, // ← POST 요청 주소
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ company_id: companyID, name: name }),
      success: function (res) {
        alert("제품이 성공적으로 추가되었습니다.");
        location.reload(); // 새로고침으로 목록 반영
      },
      error: function (xhr) {
        console.error("제품 추가 실패", xhr.responseText);
        alert("추가 실패: " + (xhr.responseJSON?.message || "서버 오류"));
      },
    });
  });
});
