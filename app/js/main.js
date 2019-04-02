let modal = document.getElementById("modal");
let button = document.getElementById("button");
let closeBtn = document.getElementById("popup__close");
let uninstallBtn = document.getElementById("popup__uninnstall-app");

button.addEventListener("click", function() {
    modal.style.display = "block";
})

window.addEventListener("click", function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
})

closeBtn.addEventListener("click", closeModal);

function closeModal() {
    modal.style.display = "none";
}

uninstallBtn.addEventListener("click", function () {
    closeModal();
    setTimeout(() => alert("Done"), 1000)
    })
