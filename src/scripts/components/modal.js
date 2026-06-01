export const openModalWindow = (modal) => {
  modal.classList.add("popup_is-opened");
  document.addEventListener("keydown", handleEscClose);
};

export const closeModalWindow = (modal) => {
  modal.classList.remove("popup_is-opened");
  document.removeEventListener("keydown", handleEscClose);
};

const handleEscClose = (evt) => {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".popup_is-opened");
    if (openedModal) {
      closeModalWindow(openedModal);
    }
  }
};

export const setCloseByOverlay = (modal) => {
  modal.addEventListener("mousedown", (evt) => {
    if (evt.target === modal) {
      closeModalWindow(modal);
    }
  });
};
