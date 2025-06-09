$(document).on("click", "#add-button .button", function () {
  const name = $("#placeholder-company-name input").val().trim();
  const note = $("#placeholder-company-note textarea").val().trim();
  const bashPath = window.location.pathname.split("/")[1];
  console.log(11);
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
