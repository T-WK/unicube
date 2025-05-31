$(document).on("click", ".preview-image-container", function () {
  const fileInput = document.getElementById("photoFile");
  fileInput.click();
});

$(document).on("change", "#photoFile", function () {
  const deleteButton = document.getElementById("delete-button");
  const outerDiv = deleteButton.parentElement.parentElement;
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const previewImage = document.querySelector(
        ".preview-image-container img",
      );
      previewImage.src = e.target.result;
      outerDiv.classList.remove("hidden");
      console.log(deleteButton);
      console.log(outerDiv);
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
  const outerDiv = deleteButton.parentElement.parentElement;
  outerDiv.classList.add("hidden");
});
