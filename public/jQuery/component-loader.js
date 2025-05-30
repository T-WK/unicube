(function ($) {
  /**
   * 주어진 root(또는 document 전체)에서
   * 데이터 속성이 붙은 모든 컴포넌트를 찾아
   * 순차적으로 로드 + 초기화 + 재귀 로딩까지 처리합니다.
   */
  function autoLoadComponents(root) {
    var $root = root && root.jquery ? root : $(document);

    // 1) 이번 패스에서 처리할 대상
    var $toLoad = $root.find(".component-container[data-component-url]");

    if (!$toLoad.length) return; // 없으면 그만

    // 2) 각 요소마다 URL 읽어서 AJAX 로드
    $toLoad.each(function () {
      var $el = $(this);
      var url = $el.data("component-url");

      // 로드
      $.get(url)
        .done(function (html) {
          // HTML 삽입
          $el.html(html);

          // data-component-attrs 읽어서 파싱
          var attrsJson = $el.attr("data-component-attrs");
          if (attrsJson) {
            try {
              var attrs = JSON.parse(attrsJson);
              Object.keys(attrs).forEach(function (key) {
                // 만약 <img> 태그라면 $el.find('img')에 붙이고,
                // 그 외 컨테이너 자체에 붙이고 싶으면 $el.attr(key, attrs[key]);
                $el.find("img").attr(key, attrs[key]);
              });
            } catch (e) {
              console.error(
                "Invalid JSON in data-component-attrs",
                attrsJson,
                e,
              );
            }
          }

          // 라벨 초기화 (해당 영역만)
          $.initComponentLabels($el);

          // data 속성 지워서 중복 방지
          $el.removeAttr("data-component-url");

          // 재귀: 이 안에 또 컴포넌트가 있으면 다음 패스로
          autoLoadComponents($el);
        })
        .fail(function () {
          console.error("Component load failed:", url);
        });
    });
  }

  // DOM 준비되면 전체 자동 로딩 시작
  $(function () {
    autoLoadComponents();
  });

  window.autoLoadComponents = autoLoadComponents;
})(jQuery);
