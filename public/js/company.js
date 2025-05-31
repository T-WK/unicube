document.addEventListener("DOMContentLoaded", async () => {
  const tbody = document.getElementById("invoiceTableBody");

  try {
    const res = await fetch("/admin/api/company"); // ← API 주소는 맞게 수정
    const data = await res.json();

    data.forEach((invoice) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
          <td class="px-4 py-2 text-sm text-gray-700">${invoice.id}</td>
          <td class="px-4 py-2 text-sm text-gray-700">${invoice.company_name}</td>
          <td class="px-4 py-2 text-sm text-gray-700">${invoice.company_id}</td>
          <td class="px-4 py-2 text-sm text-gray-700">${invoice.note || "-"}</td>
          <td class="px-4 py-2 text-sm text-gray-700">
            <a href="/pages/invoice-form.html?id=${invoice.id}" class="text-blue-500 hover:underline">수정</a>
            |
            <button data-id="${invoice.id}" class="text-red-500 hover:underline delete-btn">삭제</button>
          </td>
        `;

      tbody.appendChild(tr);
    });

    // 삭제 버튼 이벤트 바인딩
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        if (confirm("정말 삭제하시겠습니까?")) {
          await fetch(`/api/invoice/${id}`, { method: "DELETE" });
          location.reload(); // 새로고침해서 반영
        }
      });
    });
  } catch (err) {
    console.error("데이터 로딩 오류:", err);
    tbody.innerHTML = `<tr><td colspan="5" class="px-4 py-2 text-center text-red-500">데이터 로딩 실패</td></tr>`;
  }
});
