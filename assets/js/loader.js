const loader = document.querySelector(".loader-backdrop");

function showLoader() {
  loader.classList.remove("invisible");
}

function hideLoader() {
  loader.classList.add("invisible");
}
