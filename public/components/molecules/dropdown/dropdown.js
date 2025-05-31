(function () {
  $(document).on("click", ".dropdown", function (e) {
    var $btn = $(this);
    var $container = $btn.closest(".dropdown-container");
    var $menu = $container.find(".dropdown-contents");

    // 드롭다운 이미지 변경
    $btn.find("#dropdown-down-img").addClass("hidden");
    $btn.find("#dropdown-up-img").removeClass("hidden");

    // 다른 드롭다운 닫기
    $(".dropdown-contents").addClass("hidden");
    $(".dropdown").removeClass("active");

    // 이 버튼에만 active 토글
    $btn.toggleClass("active");
    // 이 메뉴만 show/hide
    $menu.toggleClass("hidden");

    // 위치 계산 (container가 position:relative인 경우)
    var btnPos = $btn.position();
    var btnH = $btn.outerHeight();

    $menu.css({
      position: "absolute",
      top: btnPos.top + btnH,
      left: btnPos.left,
      width: $btn.outerWidth(),
    });
  });

  // dropdown-contents안에 있는 dropdown-item를 눌렀을 때
  $(document).on("click", ".dropdown-contents .dropdown-item", function (e) {
    e.stopPropagation(); // 클릭 이벤트가 document로 전파되는 걸 막아서
    var $container = $(this).closest(".dropdown-container");
    $container.find(".dropdown-contents").addClass("hidden");
    $container.find(".dropdown").removeClass("active");

    var itemText = $(this).find("span").text();
    $container.find(".dropdown > * > span").text(itemText);

    // 드롭다운 이미지 변경
    $container.find("#dropdown-up-img").addClass("hidden");
    $container.find("#dropdown-down-img").removeClass("hidden");
  });

  // dropdown-contents 외부를 클릭했을 때
  $(document).on("click", function (e) {
    $(".dropdown-container").each(function () {
      var $container = $(this);
      // 클릭 위치가 이 컨테이너 내부가 아니라면
      if ($container.has(e.target).length === 0) {
        $container.find(".dropdown-contents").addClass("hidden");
        $container.find(".dropdown").removeClass("active");

        // 드롭다운 이미지 변경
        $container.find("#dropdown-up-img").addClass("hidden");
        $container.find("#dropdown-down-img").removeClass("hidden");
      }
    });
  });
})();
