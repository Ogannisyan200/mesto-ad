import "../pages/index.css";
import { createCard, updateCardLike, removeCard } from "./components/card.js";
import { openModalWindow, closeModalWindow, setCloseByOverlay } from "./components/modal.js";
import { enableValidation, clearValidation, disableSubmitButton } from "./components/validation.js";
import {
  getUserInfo,
  getCardList,
  setUserInfo,
  updateAvatar,
  addCard,
  deleteCard,
  changeLikeCardStatus,
} from "./components/api.js";

// ==================== НАСТРОЙКИ ВАЛИДАЦИИ ====================
const validationSettings = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

// ==================== DOM ЭЛЕМЕНТЫ ====================

// Профиль
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileImage = document.querySelector(".profile__image");

// Кнопки открытия модальных окон
const editProfileButton = document.querySelector(".profile__edit-button");
const addCardButton = document.querySelector(".profile__add-button");
const editAvatarButton = document.querySelector(".profile__image-button");
const logoElement = document.querySelector(".header__logo");

// Модальные окна
const profileFormModal = document.querySelector(".popup_type_edit");
const addCardModal = document.querySelector(".popup_type_new-card");
const imageModal = document.querySelector(".popup_type_image");
const avatarModal = document.querySelector(".popup_type_avatar");
const deleteCardModal = document.querySelector(".popup_type_remove-card");
const usersStatsModal = document.querySelector(".popup_type_info");

// Формы
const profileForm = profileFormModal.querySelector(".popup__form");
const addCardForm = addCardModal.querySelector(".popup__form");
const avatarForm = avatarModal.querySelector(".popup__form");

// Инпуты профиля
const profileTitleInput = profileForm.querySelector(".popup__input_type_name");
const profileDescriptionInput = profileForm.querySelector(".popup__input_type_description");

// Инпуты карточки
const cardNameInput = addCardForm.querySelector(".popup__input_type_card-name");
const cardLinkInput = addCardForm.querySelector(".popup__input_type_url");

// Инпут аватара
const avatarInput = avatarForm.querySelector(".popup__input_type_avatar");

// Полноразмерное изображение
const imageModalImage = imageModal.querySelector(".popup__image");
const imageModalCaption = imageModal.querySelector(".popup__caption");

// Список карточек
const cardsContainer = document.querySelector(".places__list");

// Кнопки подтверждения удаления
const deleteConfirmButton = deleteCardModal
  ? deleteCardModal.querySelector(".popup__button_type_confirm")
  : null;

// Элементы статистики пользователей
const usersStatsModalInfoList = usersStatsModal
  ? usersStatsModal.querySelector(".popup__info-list")
  : null;
const usersStatsModalUsersList = usersStatsModal
  ? usersStatsModal.querySelector(".popup__users-list")
  : null;

// ==================== СОСТОЯНИЕ ====================
let currentUserId = null;
let cardToDelete = null;
let cardElementToDelete = null;

// ==================== УТИЛИТЫ ====================

const setButtonLoading = (button, isLoading, defaultText) => {
  button.textContent = isLoading ? `${defaultText.replace("ть", "ние")}…` : defaultText;
};

const formatDate = (date) =>
  date.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

// ==================== КАРТОЧКИ ====================

const handleLike = (cardData, cardElement, isLiked) => {
  changeLikeCardStatus(cardData._id, isLiked)
    .then((updatedCard) => {
      const liked = updatedCard.likes.some((user) => user._id === currentUserId);
      updateCardLike(cardElement, liked, updatedCard.likes.length);
    })
    .catch((err) => console.log(err));
};

const handleDeleteClick = (cardId, cardElement) => {
  cardToDelete = cardId;
  cardElementToDelete = cardElement;
  openModalWindow(deleteCardModal);
};

const handleImageClick = (cardData) => {
  imageModalImage.src = cardData.link;
  imageModalImage.alt = cardData.name;
  imageModalCaption.textContent = cardData.name;
  openModalWindow(imageModal);
};

const prependCard = (cardData) => {
  const cardElement = createCard(cardData, currentUserId, {
    onLike: handleLike,
    onDelete: handleDeleteClick,
    onImageClick: handleImageClick,
  });
  cardsContainer.prepend(cardElement);
};

const renderCards = (cards) => {
  cards.forEach((cardData) => {
    const cardElement = createCard(cardData, currentUserId, {
      onLike: handleLike,
      onDelete: handleDeleteClick,
      onImageClick: handleImageClick,
    });
    cardsContainer.append(cardElement);
  });
};

// ==================== УДАЛЕНИЕ КАРТОЧКИ ====================

if (deleteConfirmButton) {
  deleteConfirmButton.addEventListener("click", () => {
    const button = deleteConfirmButton;
    button.textContent = "Удаление…";
    deleteCard(cardToDelete)
      .then(() => {
        removeCard(cardElementToDelete);
        closeModalWindow(deleteCardModal);
        cardToDelete = null;
        cardElementToDelete = null;
      })
      .catch((err) => console.log(err))
      .finally(() => {
        button.textContent = "Да";
      });
  });
}

// ==================== ПРОФИЛЬ ====================

editProfileButton.addEventListener("click", () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  clearValidation(profileForm, validationSettings);
  openModalWindow(profileFormModal);
});

profileForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const button = profileForm.querySelector(".popup__button");
  setButtonLoading(button, true, "Сохранить");
  setUserInfo({
    name: profileTitleInput.value,
    about: profileDescriptionInput.value,
  })
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModalWindow(profileFormModal);
    })
    .catch((err) => console.log(err))
    .finally(() => setButtonLoading(button, false, "Сохранить"));
});

// ==================== АВАТАР ====================

if (editAvatarButton) {
  editAvatarButton.addEventListener("click", () => {
    avatarForm.reset();
    clearValidation(avatarForm, validationSettings);
    openModalWindow(avatarModal);
  });
}

avatarForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const button = avatarForm.querySelector(".popup__button");
  setButtonLoading(button, true, "Сохранить");
  updateAvatar({ avatar: avatarInput.value })
    .then((userData) => {
      profileImage.style.backgroundImage = `url('${userData.avatar}')`;
      closeModalWindow(avatarModal);
      avatarForm.reset();
    })
    .catch((err) => console.log(err))
    .finally(() => setButtonLoading(button, false, "Сохранить"));
});

// ==================== ДОБАВЛЕНИЕ КАРТОЧКИ ====================

addCardButton.addEventListener("click", () => {
  addCardForm.reset();
  clearValidation(addCardForm, validationSettings);
  openModalWindow(addCardModal);
});

addCardForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const button = addCardForm.querySelector(".popup__button");
  setButtonLoading(button, true, "Создать");
  addCard({ name: cardNameInput.value, link: cardLinkInput.value })
    .then((newCard) => {
      prependCard(newCard);
      closeModalWindow(addCardModal);
      addCardForm.reset();
    })
    .catch((err) => console.log(err))
    .finally(() => setButtonLoading(button, false, "Создать"));
});

// ==================== СТАТИСТИКА ПОЛЬЗОВАТЕЛЕЙ (ВАРИАНТ 2) ====================

const createInfoString = (label, value) => {
  const template = document.querySelector("#popup-info-definition-template");
  if (!template) return null;
  const item = template.content.cloneNode(true);
  const dt = item.querySelector("dt");
  const dd = item.querySelector("dd");
  if (dt) dt.textContent = label;
  if (dd) dd.textContent = value;
  return item;
};

const createUserPreview = (user) => {
  const template = document.querySelector("#popup-info-user-preview-template");
  if (!template) return null;
  const item = template.content.cloneNode(true);
  const img = item.querySelector(".popup-info__user-avatar");
  const name = item.querySelector(".popup-info__user-name");
  if (img) {
    img.src = user.avatar;
    img.alt = user.name;
  }
  if (name) name.textContent = user.name;
  return item;
};

const handleLogoClick = () => {
  if (!usersStatsModal) return;

  getCardList()
    .then((cards) => {
      if (usersStatsModalInfoList) {
        usersStatsModalInfoList.innerHTML = "";

        const totalCards = cards.length;
        const totalLikes = cards.reduce((sum, card) => sum + card.likes.length, 0);

        // Все уникальные авторы
        const authorsMap = {};
        cards.forEach((card) => {
          if (!authorsMap[card.owner._id]) {
            authorsMap[card.owner._id] = { user: card.owner, count: 0 };
          }
          authorsMap[card.owner._id].count++;
        });
        const authors = Object.values(authorsMap);
        const topAuthor = authors.sort((a, b) => b.count - a.count)[0];

        usersStatsModalInfoList.append(
          createInfoString("Всего карточек:", totalCards)
        );
        usersStatsModalInfoList.append(
          createInfoString("Всего лайков:", totalLikes)
        );

        if (cards.length > 0) {
          usersStatsModalInfoList.append(
            createInfoString(
              "Первая создана:",
              formatDate(new Date(cards[cards.length - 1].createdAt))
            )
          );
          usersStatsModalInfoList.append(
            createInfoString(
              "Последняя создана:",
              formatDate(new Date(cards[0].createdAt))
            )
          );
        }

        if (topAuthor) {
          usersStatsModalInfoList.append(
            createInfoString("Самый активный автор:", `${topAuthor.user.name} (${topAuthor.count} карт.)`)
          );
        }
      }

      // Топ пользователей по лайкам
      if (usersStatsModalUsersList) {
        usersStatsModalUsersList.innerHTML = "";
        const likersMap = {};
        cards.forEach((card) => {
          card.likes.forEach((liker) => {
            if (!likersMap[liker._id]) {
              likersMap[liker._id] = { user: liker, count: 0 };
            }
            likersMap[liker._id].count++;
          });
        });
        const topLikers = Object.values(likersMap)
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        topLikers.forEach(({ user }) => {
          const preview = createUserPreview(user);
          if (preview) usersStatsModalUsersList.append(preview);
        });
      }

      openModalWindow(usersStatsModal);
    })
    .catch((err) => console.log(err));
};

if (logoElement) {
  logoElement.addEventListener("click", handleLogoClick);
  logoElement.style.cursor = "pointer";
}

// ==================== ЗАКРЫТИЕ МОДАЛЬНЫХ ОКОН ====================

document.querySelectorAll(".popup").forEach((modal) => {
  setCloseByOverlay(modal);
  const closeButton = modal.querySelector(".popup__close");
  if (closeButton) {
    closeButton.addEventListener("click", () => closeModalWindow(modal));
  }
});

// ==================== ИНИЦИАЛИЗАЦИЯ ====================

enableValidation(validationSettings);

Promise.all([getCardList(), getUserInfo()])
  .then(([cards, userData]) => {
    currentUserId = userData._id;
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileImage.style.backgroundImage = `url('${userData.avatar}')`;
    renderCards(cards);
  })
  .catch((err) => console.log(err));
