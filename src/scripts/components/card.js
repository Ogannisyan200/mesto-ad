export const createCard = (
  cardData,
  currentUserId,
  { onLike, onDelete, onImageClick, onInfoClick }
) => {
  const cardTemplate = document.querySelector("#card-template").content;
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);

  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCount = cardElement.querySelector(".card__like-count");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  // Показываем количество лайков
  if (likeCount) {
    likeCount.textContent = cardData.likes.length;
  }

  // Активный лайк если текущий пользователь лайкнул
  const isLiked = cardData.likes.some((user) => user._id === currentUserId);
  if (isLiked) {
    likeButton.classList.add("card__like-button_is-active");
  }

  // Кнопка удаления — только для автора
  if (cardData.owner._id !== currentUserId) {
    deleteButton.remove();
  } else {
    deleteButton.addEventListener("click", () => {
      onDelete(cardData._id, cardElement);
    });
  }

  likeButton.addEventListener("click", () => {
    const isLiked = likeButton.classList.contains("card__like-button_is-active");
    onLike(cardData, cardElement, isLiked);
  });

  cardImage.addEventListener("click", () => {
    onImageClick(cardData);
  });

  // Кнопка "i" — статистика карточки (если есть в разметке)
  const infoButton = cardElement.querySelector(".card__control-button_type_info");
  if (infoButton && onInfoClick) {
    infoButton.addEventListener("click", () => {
      onInfoClick(cardData._id);
    });
  }

  return cardElement;
};

// Удаляет карточку из DOM
export const removeCard = (cardElement) => {
  cardElement.remove();
};

// Обновляет состояние лайка карточки в DOM
export const updateCardLike = (cardElement, isLiked, likesCount) => {
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCount = cardElement.querySelector(".card__like-count");

  likeButton.classList.toggle("card__like-button_is-active", isLiked);
  if (likeCount) {
    likeCount.textContent = likesCount;
  }
};
