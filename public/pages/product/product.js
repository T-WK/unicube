$(document).ready(function () {
  const $tbody = $("#productTableBody");
  $.ajax({
    url: "/admin/api/product", // ← 필요 시 주소 수정
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

        $.ajax({
          url: `/admin/api/product/${id}`,
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
});
