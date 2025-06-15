(function () {
  // 1) “버튼을 클릭하면” 메뉴를 open/close
  $(document).on("click", ".dropdown", function (e) {
    e.stopPropagation(); // 이벤트 버블링 방지

    var $btn = $(this);
    var $container = $btn.closest(".dropdown-container");
    var $menu = $container.find(".dropdown-contents");

    // **다른 모든 메뉴를 닫고, 화살표를 위 상태로 리셋**
    $(".dropdown-contents").addClass("hidden");
    $(".dropdown")
      .removeClass("active")
      .find("#dropdown-up-img")
      .addClass("hidden");
    $(".dropdown").find("#dropdown-down-img").removeClass("hidden");

    // **현재 버튼에만 active 토글, 그리고 메뉴도 토글**
    $btn.toggleClass("active");
    $btn.find("#dropdown-down-img").toggleClass("hidden");
    $btn.find("#dropdown-up-img").toggleClass("hidden");
    $menu.toggleClass("hidden");

    // **메뉴를 보여주는 순간에 위치를 다시 계산**
    if (!$menu.hasClass("hidden")) {
      // $btn.position() → 컨테이너(.dropdown-container)가 position: relative인 덕분에 올바르게 계산됨
      var btnPos = $btn.position();
      var btnH = $btn.outerHeight();

      $menu.css({
        // 이미 CSS에서 position:absolute; top:left: 지정해두었으므로
        // 아래 두 줄은 override 혹은 정밀 조정 용도로만 사용해도 됩니다.
        top: btnPos.top + btnH,
        left: btnPos.left,
        width: $btn.outerWidth(), // 버튼 폭과 메뉴 폭을 똑같이 맞추고 싶을 때
      });
    }
  });

  // 2) 메뉴 아이템을 클릭하면 메뉴 닫고, 레이블 텍스트 교체
  $(document).on("click", ".dropdown-item", function (e) {
    e.stopPropagation();

    var $item = $(this);
    var $container = $item.closest(".dropdown-container");
    var $btn = $container.find(".dropdown");
    var $menu = $container.find(".dropdown-contents");

    var itemText = $item.find(".dropdown-label").text();
    var itemID = $item.find("#item-id").text();
    $btn.find(".dropdown-label").text(itemText);
    $btn.find("#item-id").text(itemID);

    // 메뉴 닫기 & 화살표 원복
    $menu.addClass("hidden");
    $btn.removeClass("active");
    $btn.removeClass("red");
    $btn.find("#dropdown-up-img").addClass("hidden");
    $btn.find("#dropdown-down-img").removeClass("hidden");
  });

  // 3) 화면 아무 곳이나(다른 영역) 클릭 시 모든 메뉴 닫기
  $(document).on("click", function (e) {
    $(".dropdown-contents").addClass("hidden");
    $(".dropdown")
      .removeClass("active")
      .find("#dropdown-up-img")
      .addClass("hidden");
    $(".dropdown").find("#dropdown-down-img").removeClass("hidden");
  });
})();
