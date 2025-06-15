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

      var id = $el.attr("id");

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

            $el.removeAttr("data-component-attrs");
          }

          // 회사명 드롭다운 컴포넌트에 회사들 불러오기
          if (id !== null) {
            const bashPath = window.location.pathname.split("/")[1];
            if (id === "placeholder-choice-company") {
              url = `/${bashPath}/api/company/`;
              $company_dropbox = $el;
              addDropdownItem($company_dropbox, url);
            } else if (id === "placeholder-choice-product-name") {
              url = `/${bashPath}/api/product/`;
              $product_dropbox = $el;
              addDropdownItem($product_dropbox, url);
            }
          }

          const path = window.location.pathname;
          const cleanPath = path.replace(/\/$/, "");

          if (cleanPath.split("/").pop() === "invoice") {
            // invoice 페이지에서 상품 정보란 추가하기
            if (id !== null && id === "add-button") {
              $el.find(".button").click();
            }

            // invoice 페이지에 송장 정보 기입하기
            if (sessionStorage.getItem("ocrResult") !== null) {
              applyOcrData($el);
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

    function addDropdownItem(element, url) {
      $el = element;
      const bashPath = window.location.pathname.split("/")[1];
      $ul = $el.find("ul");

      $.ajax({
        url: url,
        method: "GET",
        contentType: "json",
        success: function (data) {
          data.forEach(function (item_info) {
            if (url === `/${bashPath}/api/product/`) {
              const $tr = $(`
                <li class="dropdown-item">
                  <span id="company-id" class="hidden">${item_info.company_id}</span>
                  <span id="product-id" class="hidden">${item_info.id}</span>
                  <span class="dropdown-label">${item_info.name}</span>
                </li>
              `);
              $ul.append($tr);
            } else if (url === `/${bashPath}/api/company/`) {
              const $tr = $(`
                <li class="dropdown-item">
                  <span id="company-id" class="hidden">${item_info.id}</span>
                  <span id="product-id" class="hidden">-1</span>
                  <span class="dropdown-label">${item_info.name}</span>
                </li>
              `);
              $ul.append($tr);
            }
          });

          const cleanPath = window.location.pathname.replace(/\/$/, "");
          // invoice 페이지 이면서 상품 드롭박스를 만든 후 찾은 상품을 배치하기 위함.
          if (
            cleanPath.split("/").pop() === "invoice" &&
            url === `/${bashPath}/api/product/`
          ) {
            const ocrData = JSON.parse(
              sessionStorage.getItem("ocrResult") || "{}",
            );
            if (Object.keys(ocrData).length == 0) return;

            const productName = ocrData.invoiceData.제품명;
            const index = data.findIndex((item) => item.name === productName);
            if (index > -1) {
              $el.find(".dropdown").find(".dropdown-label").text(productName);
              $el
                .find(".dropdown")
                .find("#company-id")
                .text(data[index].company_id);
              $el.find(".dropdown").find("#product-id").text(data[index].id);

              sessionStorage.setItem("selectProductCompanyId", data[index].company_id.toString());
            } else {
              $el.find(".dropdown").addClass("red");
            }
          }

          // invoice 페이지 이면서 회사 드롭박스를 만든 후 ocr데이터에 있는 상품의 회사를 찾기 위함.
          else if (
            cleanPath.split("/").pop() === "invoice" &&
            url === `/${bashPath}/api/company/`
          ) {
            const ocrData = JSON.parse(
              sessionStorage.getItem("ocrResult") || "{}",
            );
            if (Object.keys(ocrData).length == 0) return;

            console.log("test1");
            const productName = ocrData.invoiceData.제품명;
            applyCompany(productName);
          }
        },
        error: function (xhr, status, error) {
          console.error("업체 리스트 로드 실패:", error);
          const $tr = $(`
            <li class="dropdown-item">
              <span id="company-id" class="hidden">-1</span>
              <span id="product-id" class="hidden">-1</span>
              <span class="dropdown-label">업체 불러오기 실패</span>
            </li>
          `);
          $ul.append($tr);
        },
      });
    }

    function applyCompany(productName) {
      $dropdown = $(document).find("#placeholder-choice-company");
      const bashPath = window.location.pathname.split("/")[1];

      $.ajax({
        url: `/${bashPath}/api/product/search`,
        type: "GET",
        data: { name: "test" },
        success: function (product_info) {
          const matches = product_info.filter(
            (item) => item.name === productName,
          );

          if (matches.length == 1) {
            const index = product_info.findIndex(
              (item) => item.name === productName,
            );

            const companyID = product_info[index].company_id;
            const companyName = product_info[index].company_name;

            console.log("test2");
            $dropdown
              .find(".dropdown")
              .find(".dropdown-label")
              .text(companyName);
            $dropdown.find(".dropdown").find("#company-id").text(companyID);

            console.log("test", sessionStorage.getItem("selectProductCompanyId"));
          } else {
            $dropdown.find(".dropdown").addClass("red");
            console.log("test", sessionStorage.getItem("selectProductCompanyId"));
          }
        },
        error: function (xhr, status, err) {
          console.error("에러:", err);
          $dropdown.find(".dropdown").addClass("red");
          console.log("test", sessionStorage.getItem("selectProductCompanyId"));
        },
      });
    }

    function applyOcrData(element) {
      var $el = element;
      if ($el === null) return;

      const id = $el.attr("id") || null;
      if (id === null) return;

      const ocrData = JSON.parse(sessionStorage.getItem("ocrResult") || "{}");
      if (id === "invoice-number") {
        $el.find("input").val(ocrData.invoiceData.반송송장번호);
      } else if (id === "customer-name") {
        $el.find("input").val(ocrData.invoiceData.고객이름);
      } else if (id === "customer-phone") {
        $el.find("input").val(ocrData.invoiceData.전화번호);
      } else if (id === "invoice-photo") {
        const img = sessionStorage.getItem("invoice_base64Image");
        if (img) {
          $("#invoice-photo img").attr("src", img);
        }
      }
    }
  }

  // DOM 준비되면 전체 자동 로딩 시작
  $(function () {
    autoLoadComponents();
  });

  window.autoLoadComponents = autoLoadComponents;
})(jQuery);
