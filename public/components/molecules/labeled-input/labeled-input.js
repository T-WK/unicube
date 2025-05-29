(function () {
  const cssId = "labeled-input";
  if (!document.getElementById(cssId)) {
    const link = document.createElement("link");
    link.id = cssId;
    link.rel = "stylesheet";
    link.href = "/components/molecules/labeled-input/labeled-input.css";
    document.head.appendChild(link);
  }
})();

$(document).ready(function () {
  $.get("/components/atoms/Label/label.html", function (html) {
    var $tmp = $(html);
    $tmp.text("Label");

    $(".labeled-input").prepend($tmp);
  });
});
