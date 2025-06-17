var labelMap = {
  "customer-name": "고객 이름",
  "customer-phone": "고객 전화",
  "invoice-number": "송장 번호",
  "company-name": "업체 이름",

  "invoice-photo": "송장 사진",
  "product-photo": "제품 사진",

  "placeholder-note": "메모",
  "placeholder-product-name": "상품 이름",
  "placeholder-choice-product-name": "상품 이름을 선택하세요.",
  "placeholder-choice-company": "업체를 선택하세요.",
  "placeholder-company-name": "업체 이름",
  "placeholder-company-access-token": "업체 코드",
  "placeholder-company-note": "비고",

  "title-ocr": "OCR 결과",
  "title-products-list": "제품 목록",
  "title-add-product": "제품 추가",
  "title-product-info": "제품 정보",
  "title-company-list": "업체 목록",
  "title-add-company": "업체 추가",
  "title-company-info": "업체 정보",
  "title-invoice-info": "송장 데이터",

  "get-invoice-page-access-button": "송장 찍기",
  "data-processing-page-access-button": "데이터 추출",
  "chart-page-access-button": "반품 현황",
  "product-page-access-button": "제품 관리",
  "company-page-access-button": "업체 관리",
  "add-button": "추가",
  "add-product-button": "상품추가",
  "modify-button": "수정",
  "delete-button": "삭제",
  "save-button": "저장",

  "label-returned-quantity": "입고수량",
  "label-resalable-quantity": "가능수량",

  "header-title": "3PL 반품 자동화 솔루션",
};

jQuery.initComponentLabels = function (context) {
  var $root = context && context.jquery ? context : $(document);

  // context 내의 모든 .component-label 요소를 순회
  $root.find('[class~="component-label"]').each(function () {
    var $label = $(this);

    // 1) 현재 라벨에서 가장 가까운 상위 .component-container를 모두 가져온다
    //    (closest 하나만 잡지 않고, 부모 요소 중에서 모든 .component-container를 리스트로 구함)
    var $allContainers = $label.parents('[class~="component-container"]');

    // 2) 그 중에서 id가 있는 첫 번째(=가장 가까운) 요소를 찾는다
    var compId = null;
    $allContainers.each(function () {
      if (this.id) {
        compId = this.id;
        return false; // break
      }
    });

    // 3) labelMap에 정의된 값이 있으면 사용, 그렇지 않으면 기본값 "Label"
    var labelText = compId && labelMap[compId] ? labelMap[compId] : "Label";

    // 4) input이고 .placeholder 클래스가 있으면 placeholder 속성에 값을 넣고,
    //    그렇지 않으면 text로 세팅
    if (($label.is("input") || $label.is("textarea")) && $label.hasClass("placeholder")) {
      $label.attr("placeholder", labelText);
    } else {
      $label.text(labelText);
    }
  });
};
