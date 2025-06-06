$(document).ready(function () {
  const $tbody = $("#invoiceTableBody");
  $("#modify-company-modal-container").addClass("hidden").hide();
  const bashPath = window.location.pathname.split("/")[1];
  $.ajax({
    url: `/${bashPath}/api/company`, // ← 필요 시 주소 수정
    method: "GET",
    dataType: "json",
    success: function (data) {
      data.forEach(function (company_info) {
        const $tr = $(`
          <tr>
            <td class="px-4 py-2 text-sm text-gray-700">${company_info.id}</td>
            <td class="px-4 py-2 text-sm text-gray-700">${company_info.name}</td>
            <td class="px-4 py-2 text-sm text-gray-700">${company_info.access_token}</td>
            <td class="px-4 py-2 text-sm text-gray-700">${company_info.note || "-"}</td>
            <td class="px-4 py-2 text-sm text-gray-700">
              <button class="text-blue-500 hover:underline view-detail-btn" data-id="${company_info.id}">보기</button>
            </td>
          </tr>
        `);
        $tbody.append($tr);
      });
      $tbody.on("click", ".view-detail-btn", function () {
        const id = $(this).data("id");

        $.ajax({
          url: `/${bashPath}/api/company/${id}`,
          method: "GET",
          dataType: "json",
          success: function (company) {
            // 값 채우기
            $('[id~="modify-modal"]')
              .find("#placeholder-company-name input")
              .val(company.name);

            $('[id~="modify-modal"]')
              .find("#placeholder-company-access-token input")
              .val(company.access_token);

            $('[id~="modify-modal"]')
              .find("#placeholder-company-note input")
              .val(company.note || "");

            // 모달 보여주기modify-modal
            $('[id~="modify-modal"]').removeClass("hidden").show();
          },
          error: function () {
            alert("업체 정보를 불러오지 못했습니다.");
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
  $("#searchBtn").on("click", function () {
    $.ajax({
      url: `/${bashPath}/api/company/search`, // ← 필요 시 주소 수정
      method: "GET",
      dataType: "json",
      data: { name: $("#keyword").val() },
      success: function (data) {
        console.log(data);
        $tbody.empty(); // 기존 테이블 내용 제거 (이거 꼭 있어야 해!)
        data.forEach(function (company_info) {
          const $tr = $(`
            <tr>
              <td class="px-4 py-2 text-sm text-gray-700">${company_info.id}</td>
              <td class="px-4 py-2 text-sm text-gray-700">${company_info.name}</td>
              <td class="px-4 py-2 text-sm text-gray-700">${company_info.access_token}</td>
              <td class="px-4 py-2 text-sm text-gray-700">${company_info.note || "-"}</td>
              <td class="px-4 py-2 text-sm text-gray-700">
                <button class="text-blue-500 hover:underline view-detail-btn" data-id="${company_info.id}">보기</button>
              </td>
            </tr>
          `);
          $tbody.append($tr);
        });
        $tbody.on("click", ".view-detail-btn", function () {
          const id = $(this).data("id");

          $.ajax({
            url: `/${bashPath}/api/company/${id}`,
            method: "GET",
            dataType: "json",
            success: function (company) {
              // 값 채우기
              $('[id~="modify-modal"]')
                .find("#placeholder-company-name input")
                .val(company.name);

              $('[id~="modify-modal"]')
                .find("#placeholder-company-access-token input")
                .val(company.access_token);

              $('[id~="modify-modal"]')
                .find("#placeholder-company-note input")
                .val(company.note || "");

              // 모달 보여주기modify-modal
              $('[id~="modify-modal"]').removeClass("hidden").show();
            },
            error: function () {
              alert("업체 정보를 불러오지 못했습니다.");
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
});
