(function () {
  // css 링크
  const cssId = "labeled-image";
  if (!document.getElementById(cssId)) {
    const link = document.createElement("link");
    link.id = cssId;
    link.rel = "stylesheet";
    link.href = "/components/molecules/labeled-image/labeled-image.css";
    document.head.appendChild(link);
  }

  $("")
})();

$(document).ready(function () {
  // labeled-image div에 이미지 컴포넌트 추가
  $.get("/components/atoms/Image/image.html", function (html) {
    var $tmp = $(html);

    // 이미지 태그에 src 속성 추가 (카메라 아이콘 이미지)
    $tmp.attr("src", "/images/camera.png");

    $(".labeled-image").prepend($tmp);
  });

  // labeled-image div에 label 컴포넌트 추가
  $.get("/components/atoms/Label/label.html", function (html) {
    var $tmp = $(html);

    $(".labeled-image").append($tmp);
  });

  // labeled-image div에 delete-button 컴포넌트 추가
  $.get("/components/molecules/delete-button/delete-button.html", function (html) {
    var $tmp = $(html);

    $(".labeled-image").append($tmp);
  });
});
