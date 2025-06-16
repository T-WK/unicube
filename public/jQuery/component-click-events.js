$(function () {
  $(document).on("click", "#add-button", function () {
    $('[id~="add-modal"]').removeClass("hidden");
  });

  $(document).on("click", ".header-icon", function (e) {
    const bashPath = window.location.pathname.split("/")[1];
    window.location.href = `/${bashPath}/`;
  });

  $(document).on("click", ".modal", function (e) {
    // e.target이 modal-container 내부 요소인지 체크
    if (!$(e.target).closest(".modal-container").length) {
      $(this).addClass("hidden");
    }
  });
});

$(document).on("click", ".labeled-image img", function () {
  if ($(this).attr("src") !== "/images/camera.png") return;

  const $container = $(this).closest(".labeled-image");
  const fileInput = $container.find('input[type="file"]')[0];

  if (fileInput) {
    fileInput.click();
  }
});

$(document).on("change", "#photoFile", function () {
  const $deleteButton = $(this).parent().find("#cancel-button");
  const $outerDiv = $deleteButton.parent();

  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const base64Image = e.target.result;
      if ($outerDiv.parent().attr("id") === "product-photo") {
        const maxSize = 4 * 1000 * 1000;
        const compressedData = compressBase64ToMaxSize(e.target.result, maxSize)
          .then((compressedDataURL) => {
            sessionStorage.setItem("product_base64Image", compressedDataURL);
          })
          .catch((err) => {
            console.error("압축 또는 저장 실패:", err);
          });
      }
      var $previewImage = $outerDiv.find("img");
      $previewImage.attr("src", base64Image);
      $deleteButton.removeClass("hidden");
    };
    reader.readAsDataURL(file);
  }
});

// TODO: 방법이 좀 별로임. 더 좋은 방법 찾아보긴 해야함.
$(document).on("click", "#delete-button", function () {
  const $container = $(this).parent().parent().parent();

  // 이미지의 딜리트 버튼을 눌렀는가?
  if ($container.hasClass("labeled-image")) {
    var $previewImage = $container.find("img");
    $previewImage.attr("src", "/images/camera.png");
    const $fileInput = $container.find("#photoFile");
    $fileInput.val(""); // input 초기화
    const $deleteButton = $container.find("#cancel-button");
    $deleteButton.addClass("hidden");

    if ($container.parent().attr("id") === "product-photo") {
      sessionStorage.removeItem("product_base64Image");
    }

    return;
  }

  if ($container.hasClass("product-edit-container")) {
    $container.parent().remove();
    return;
  }
});

/**
 * base64 Data URL 이미지를 받아, 최종 base64 크기가 maxBytes를 넘지 않도록
 * JPEG 퀄리티를 낮춰 압축한 base64(Data URL)를 반환
 *
 * @param {string} base64DataURL  - 'data:image/...;base64,…' 형태
 * @param {number} maxBytes       - 허용할 최대 Data URL 바이트 크기 (예: 5 * 1024 * 1024)
 * @param {number} [minQuality=0.1] - 최소 JPEG 퀄리티 (0.0 ~ 1.0)
 * @returns {Promise<string>}     - 압축된 JPEG Data URL
 */
async function compressBase64ToMaxSize(
  base64DataURL,
  maxBytes,
  minQuality = 0.1,
) {
  // 1) base64 → Image 로드
  const img = await new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = base64DataURL;
  });

  // 2) 캔버스에 그리기
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  // 3) Data URL 오버헤드 고려 → Blob 목표 크기 계산
  //    base64 길이 ≈ blobSize × 4/3
  const maxBlobBytes = Math.floor((maxBytes * 3) / 4);

  // 4) 이진 탐색으로 최적 퀄리티 찾기
  let low = minQuality,
    high = 1.0,
    bestQuality = minQuality;

  for (let i = 0; i < 7; i++) {
    const q = (low + high) / 2;
    // canvas.toBlob 은 비동기 콜백
    const blob = await new Promise((res) =>
      canvas.toBlob(res, "image/jpeg", q),
    );
    if (blob.size <= maxBlobBytes) {
      bestQuality = q; // 이 퀄리티로는 OK
      low = q; // 더 높은 퀄리티도 시도
    } else {
      high = q; // 용량 초과 → 퀄리티 낮춤
    }
  }

  // 5) 최종 Data URL 생성 (JPEG, bestQuality)
  const compressedDataURL = canvas.toDataURL("image/jpeg", bestQuality);

  return compressedDataURL;
}
