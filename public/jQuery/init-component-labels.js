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
  "placeholder-company-access-token": "업체 아이디",
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
  "modify-button": "수정",
  "delete-button": "삭제",
  "save-button": "저장",

  "label-returned-quantity": "입고수량",
  "label-resalable-quantity": "상품화 가능 수량",

  "header-title": "3PL 반품 자동화 솔루션",
};

jQuery.initComponentLabels = function (context) {
  // context가 jQuery 객체면 그 안만, 아니면 document 전체를 스캔
  var $root = context && context.jquery ? context : $(document);

  $root
    .find('[class~="component-container"]')
    .addBack('[class~="component-container"]')
    .each(function () {
      var $comp = $(this);
      var id = $comp.attr("id");
      var labelText = labelMap[id] || "Label";

      $comp.find('[class~="component-label"]').text(labelText);
    });
};
