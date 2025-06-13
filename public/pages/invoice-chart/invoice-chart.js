$(document).ready(function () {
  const $tbody = $("#invoiceTableBody");
  const bashPath = window.location.pathname.split("/")[1];

  // 검색창에 데이터 불러오기
  $.ajax({
    url: `/${bashPath}/api/invoice`, // ← 필요 시 주소 수정
    method: "GET",
    dataType: "json",
    success: function (data) {
      const invoiceList = data.invoiceList;

      invoiceList.forEach((invoice) => {
        const { id, name, phone, number, created_at, products } = invoice;
        products.forEach((product) => {
          const row = `
            <tr>
              <td class="px-4 py-2 text-sm text-gray-700">${id}</td>
              <td class="px-4 py-2 text-sm text-gray-700">${name}</td>
              <td class="px-4 py-2 text-sm text-gray-700">${phone}</td>
              <td class="px-4 py-2 text-sm text-gray-700">${number}</td>
              <td class="px-4 py-2 text-sm text-gray-700">${product.name}</td>
              <td class="px-4 py-2 text-sm text-gray-700">${product.returned_quantity}</td>
              <td class="px-4 py-2 text-sm text-gray-700">${product.resalable_quantity}</td>
              <td class="px-4 py-2 text-sm text-gray-700">${new Date(created_at).toLocaleDateString()}</td>
              <td class="px-4 py-2 text-sm text-gray-700">
                ${`<button class="text-blue-500 hover:underline view-btn" data-id="${id}">보기</button>`}
              </td>
            </tr>
          `;
          $tbody.append(row);
          $tbody.on("click", ".view-btn", function () {
            const invoiceId = $(this).data("id");
            if (invoiceId) {
              window.location.href = `/${bashPath}/invoice/${invoiceId}`;
            }
          });
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
      url: `/${bashPath}/api/invoice`, // ← 필요 시 주소 수정
      method: "GET",
      dataType: "json",
      data: {
        dateFrom: $("#dateFrom").val(),
        dateTo: $("#dateTo").val(),
        keyword: $("#keyword").val(),
      },
      success: function (data) {
        const invoiceList = data.invoiceList;
        $tbody.empty(); // 기존 테이블 내용 제거 (이거 꼭 있어야 해!)

        invoiceList.forEach((invoice) => {
          const { id, name, phone, number, created_at, products } = invoice;
          products.forEach((product) => {
            const row = `
              <tr>
                <td class="px-4 py-2 text-sm text-gray-700">${id}</td>
                <td class="px-4 py-2 text-sm text-gray-700">${name}</td>
                <td class="px-4 py-2 text-sm text-gray-700">${phone}</td>
                <td class="px-4 py-2 text-sm text-gray-700">${number}</td>
                <td class="px-4 py-2 text-sm text-gray-700">${product.name}</td>
                <td class="px-4 py-2 text-sm text-gray-700">${product.returned_quantity}</td>
                <td class="px-4 py-2 text-sm text-gray-700">${product.resalable_quantity}</td>
                <td class="px-4 py-2 text-sm text-gray-700">${new Date(created_at).toLocaleDateString()}</td>
                <td class="px-4 py-2 text-sm text-gray-700">
                  ${`<button class="text-blue-500 hover:underline view-btn" data-id="${id}">보기</button>`}
                </td>
              </tr>
            `;
            $tbody.append(row);
            $tbody.on("click", ".view-btn", function () {
              const invoiceId = $(this).data("id");
              if (invoiceId) {
                window.location.href = `/${bashPath}/invoice/${invoiceId}`;
              }
            });
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
  $("#exportBtn").on("click", function () {
    const dateFrom = $("#dateFrom").val();
    const dateTo = $("#dateTo").val();
    const keyword = $("#keyword").val();

    const query = $.param({ dateFrom, dateTo, keyword });

    const url = `/${bashPath}/api/invoice/export?${query}`;

    // a 태그를 동적으로 만들어서 클릭
    const a = document.createElement("a");
    a.href = url;
    a.download = ""; // 이 줄 없어도 브라우저가 다운로드 처리함
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
});
