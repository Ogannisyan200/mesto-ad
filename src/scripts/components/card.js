<<<<<<< HEAD
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
    onLike(cardData, likeButton, likeCount);
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
=======
export const likeCard = (likeButton) => {
  likeButton.classList.toggle("card__like-button_is-active");
};

export const deleteCard = (cardElement) => {
  cardElement.remove();
};

const getTemplate = () => {
  return document
    .getElementById("card-template")
    .content.querySelector(".card")
    .cloneNode(true);
};

export const createCardElement = (
  data,
  { onPreviewPicture, onLikeIcon, onDeleteCard }
) => {
  const cardElement = getTemplate();
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__control-button_type_delete");
  const cardImage = cardElement.querySelector(".card__image");

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardElement.querySelector(".card__title").textContent = data.name;

  if (onLikeIcon) {
    likeButton.addEventListener("click", () => onLikeIcon(likeButton));
  }

  if (onDeleteCard) {
    deleteButton.addEventListener("click", () => onDeleteCard(cardElement));
  }

  if (onPreviewPicture) {
    cardImage.addEventListener("click", () => onPreviewPicture({name: data.name, link: data.link}));
>>>>>>> db18633465a58dfa5b0d2918c3d4bbb17a7d4e3b
  }

  return cardElement;
};
