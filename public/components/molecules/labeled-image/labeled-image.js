$(document).on("click", ".preview-image-container", function () {
  const fileInput = document.getElementById("photoFile");
  fileInput.click();
});

$(document).on("change", "#photoFile", function () {
  const deleteButton = document.getElementById("delete-button");
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const previewImage = document.querySelector(
        ".preview-image-container img",
      );
      previewImage.src = e.target.result;
      deleteButton.style.display = "inline-block";
    };
    reader.readAsDataURL(file);
  }
});

$(document).on("click", "#delete-button", function () {
  const previewImage = document.querySelector(".preview-image-container img");
  previewImage.src = "/images/camera.png";
  const fileInput = document.getElementById("photoFile");
  fileInput.value = ""; // input 초기화
  const deleteButton = document.getElementById("delete-button");
  deleteButton.style.display = "none";
});
