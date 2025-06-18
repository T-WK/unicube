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
