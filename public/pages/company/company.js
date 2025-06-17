$(document).ready(function () {
  const $tbody = $("#invoiceTableBody");
  $("#modify-company-modal-container").addClass("hidden").hide();
  const bashPath = window.location.pathname.split("/")[1];

  // 페이지 로드시 바로.
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

        $('[id~="modify-modal"]').find("#company-id").text(id);

        $.ajax({
          url: `/${bashPath}/api/company/${id}`,
          method: "GET",
          dataType: "json",
          success: function (company) {
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

  // 검색 버튼 눌렀을 때.
  $("#searchBtn").on("click", function () {
    $.ajax({
      url: `/${bashPath}/api/company/search`, // ← 필요 시 주소 수정
      method: "GET",
      dataType: "json",
      data: { name: $("#keyword").val() },
      success: function (data) {
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

          $('[id~="modify-modal"]').find("#company-id").text(id);
          alert(id);

          $.ajax({
            url: `/${bashPath}/api/company/${id}`,
            method: "GET",
            dataType: "json",
            success: function (company) {
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

  // 모달의 수정버튼 클릭 시
  $(document).on(
    "click",
    ".modal-container #modify-button button",
    function () {
      const $companyID = $('[id~="modify-modal"]').find("#company-id").text();
      const $companyName = $('[id~="modify-modal"]')
        .find("#placeholder-company-name input")
        .val();
      const $companyNote = $('[id~="modify-modal"]')
        .find("#placeholder-company-note input")
        .val();

      if (!$companyNote) $companyNote = "";

      $.ajax({
        url: `/${bashPath}/api/company/${$companyID}`,
        method: "PATCH",
        contentType: "application/json",
        data: JSON.stringify({ name: $companyName, note: $companyNote }),
        success: function (response) {
          console.log("업체수정 성공:", response);
          alert("업체수정에 성공했어요.");
          location.reload();
        },
        error: function (xhr, status, error) {
          console.error("업체수정 실패:", error);
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
      const $companyID = $('[id~="modify-modal"]').find("#company-id").text();

      $.ajax({
        url: `/${bashPath}/api/company/${$companyID}`,
        method: "DELETE",
        contentType: "application/json",
        success: function (response) {
          console.log("업체제거 성공:", response);
          alert("업체제거에 성공했어요.");
          location.reload();
        },
        error: function (xhr, status, error) {
          console.error("업체제거 실패:", error);
          alert("오류가 발생했습니다. 다시 시도해주세요.");
        },
      });
    },
  );

  // 추가 버튼 클릭 시
  $(document).on("click", "#add-button .button", function () {
    const name = $("#placeholder-company-name input").val().trim();
    const note = $("#placeholder-company-note textarea").val().trim();
    const bashPath = window.location.pathname.split("/")[1];
    if (!name) {
      alert("업체 이름은 필수입니다.");
      return;
    }

    $.ajax({
      url: `/${bashPath}/api/company`, // ← POST 요청 주소
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ name, note }),
      success: function (res) {
        alert("업체가 성공적으로 추가되었습니다.");
        location.reload(); // 새로고침으로 목록 반영
      },
      error: function (xhr) {
        console.error("업체 추가 실패", xhr.responseText);
        alert("추가 실패: " + (xhr.responseJSON?.message || "서버 오류"));
      },
    });
  });
});
