$("#data-processing-page-access-button").on("click", function () {
  const $loading = $("#loadingIndicator");
  console.log($loading.length); // 이게 0이면 선택 실패

  const fileInput = document.getElementById("photoFile");

  if (!fileInput.files) {
    alert("이미지를 선택해주세요.");
    return;
  }
  $loading.show();

  setTimeout(() => {
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      const base64Image = e.target.result;

      $.ajax({
        url: "/admin/api/ocr",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ image: base64Image }),
        success: function (response) {
          console.log("업로드 성공:", response);
          sessionStorage.setItem("ocrResult", JSON.stringify(response));
          window.location.href = "/admin/invoice";
        },
        error: function (xhr, status, error) {
          console.error("업로드 실패:", error);
          alert("오류가 발생했습니다. 다시 시도해주세요.");
          $loading.hide(); // 실패 시 로딩 숨기기
        },
      });
    };

    reader.readAsDataURL(file);
  }, 0);
});
