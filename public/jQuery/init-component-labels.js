var labelMap = {
  "customer-name": "고객 이름",
  "customer-phone": "고객 전화",
  "invoice-number": "송장 번호",
  "company-name" : "업체 이름",
  
  "invoice-photo": "송장 사진",
  "product-photo": "제품 사진",

  "placeholder-note": "메모",
  "placeholder-product-name": "상품 이름",
  "placeholder-choice-company": "업체를 선택하세요.",
  "placeholder-company-name": "업체 이름",
  

  "title-ocr": "OCR 결과",
  "title-products-list": "제품 목록",
  "title-add-product": "제품 추가",
  "title-product-info": "제품 정보",
  "title-company-list": "업체 목록",
  "title-add-company": "업체 추가",
  "title-company-info": "업체 정보",

  "get-invoice-page-access-button": "송장 찍기",
  "daga-processing-page-access-button": "데이터 추출",
  "chart-page-access-button": "반품 현황",
  "product-page-access-button": "제품 관리",
  "company-page-access-button": "업체 관리",
  "add-button": "추가",
  "modify-button": "수정",
  "delete-button": "삭제",
};

jQuery.initComponentLabels = function () {
  // 페이지에 있는 모든 컴포넌트 인스턴스를 한 번에 찾아서
  $(".component-container").each(function () {
    var $comp = $(this);
    var containerId = $comp.attr("id");

    // id에 따라 라벨 텍스트를 매핑
    const labelText = labelMap[containerId];
    if (!labelText) {
      console.warn(`No label text found for container id: ${containerId}`);
      labelText = "Label" // 라벨 텍스트가 없으면 다음 컴포넌트로 넘어감
    }

    // 컴포넌트 내부의 .component-label 에 텍스트 설정
    $comp.find('.component-label').text(labelText);
  });
};
