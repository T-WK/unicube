(function () {
  const cssId = "spinner-container";
  if (!document.getElementById(cssId)) {
    const link = document.createElement("link");
    link.id = cssId;
    link.rel = "stylesheet";
    link.href = "/components/molecules/number-spinner/number-spinner.css";
    document.head.appendChild(link);
  }

  // 숫자 이외 값 입력 방지 (delegate)
  $(document).on("input", ".spinner-input", function () {
    var clean = this.value.replace(/\D/g, ""); // 숫자만 남기기
    if (this.value !== clean) {
      this.value = clean;
    }
  });

  // 증가 버튼 (delegate)
  $(document).on("click", "#spinner-increment", function () {
    var $btn = $(this);
    var $container = $btn.closest(".spinner-container");
    var $input = $container.find(".spinner-input");
    var val = parseInt($input.val(), 10) || 0;

    val += 1;
    $input.val(val);

    // 에러 상태 해제
    $container.removeClass("error");
  });

  // 감소 버튼 (delegate)
  $(document).on("click", "#spinner-decrement", function () {
    var $btn = $(this);
    var $container = $btn.closest(".spinner-container");
    var $input = $container.find(".spinner-input");
    var val = parseInt($input.val(), 10) || 0;

    if (val <= 0) {
      $input.val(0);
      $container.addClass("error");
    } else {
      val -= 1;
      $input.val(val);
      $container.removeClass("error");
    }
  });
})();
