jQuery.initComponentLabels = function () {
  // 페이지에 있는 모든 컴포넌트 인스턴스를 한 번에 찾아서
  $(".my-component").each(function () {
    var $comp = $(this);
    var containerId = $comp.attr("id");

    // id에 따라 라벨 텍스트를 매핑
    var labelText;
    switch (containerId) {
      case "user-name":
        labelText = "사용자 이름";
        break;
      case "order-number":
        labelText = "주문 번호";
        break;
      // …필요한 만큼 케이스 추가
      default:
        labelText = "기본 라벨";
    }

    // 컴포넌트 내부의 .label-div label 에 텍스트 설정
    $comp.find(".label-div label").text(labelText);
  });
};
