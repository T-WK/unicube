$(function () {
  console.log("DOM ready!");
  $(document).on("click", "#add-button", function () {
    $('[id~="add-modal"]').removeClass("hidden");
  });

  $(document).on("click", ".modal", function (e) {
    // e.target이 modal-container 내부 요소인지 체크
    if (!$(e.target).closest(".modal-container").length) {
      console.log("modal overlay clicked (outside container)");
      $(this).addClass("hidden");
    }
  });
});
