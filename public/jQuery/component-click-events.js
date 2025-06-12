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
      var $previewImage = $outerDiv.find("img");
      $previewImage.attr("src", e.target.result);
      $deleteButton.removeClass("hidden");
    };
    reader.readAsDataURL(file);
  }
});

$(document).on("click", "#delete-button", function () {
  const $container = $(this).parent().parent().parent();
  var $previewImage = $container.find("img");
  console.log($previewImage);
  $previewImage.attr("src", "/images/camera.png");
  console.log("test3");
  const $fileInput = $container.find("#photoFile");
  console.log($fileInput);
  $fileInput.val(""); // input 초기화
  console.log("test5");
  const $deleteButton = $container.find("#cancel-button");
  console.log($deleteButton);
  $deleteButton.addClass("hidden");
  console.log("test7");
});
