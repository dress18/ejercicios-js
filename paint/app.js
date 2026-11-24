const optionsModal = document.getElementById("options-modal");
const modalTitle = document.getElementById("modal-title");

document.querySelectorAll("button:not(#modal-close)").forEach((button) => {
  button.addEventListener("click", () => {
    modalTitle.textContent =
      button.getAttribute("aria-label") ||
      button.title ||
      button.textContent.trim() ||
      "Opciones";
    optionsModal.showModal();
  });
});