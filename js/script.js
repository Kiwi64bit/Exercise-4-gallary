//  A true modulo function which does not produce negative numbers
function mod(number, base) {
    return ((number % base) + base) % base;
}

function isNumberInRange(number, min, max) {
    return min <= number && number <= max;
}

function openPopup() {
    popup.classList.add("show");
}

function closePopup() {
    popup.classList.remove("show");
}

function updatePopupImageByIndex(newIndex) {
    // Update index and wrap if it's outside valid range
    currentImageIndex = newIndex;
    currentImageIndex = mod(currentImageIndex, galleryCards.length);
    updatePopup();
}

function nextImage() {
    // Increment image index
    updatePopupImageByIndex(++currentImageIndex);
}

function previousImage() {
    // Decrement image index
    updatePopupImageByIndex(--currentImageIndex);
}

function updatePopupImage() {
    popupImage.src = galleryCards[currentImageIndex].querySelector("img").src;
}

function updateIndicator() {
    activeIndicator.classList.toggle("active");
    activeIndicator = indicators[currentImageIndex];
    activeIndicator.classList.toggle("active");
}

function updatePopup() {
    updatePopupImage();
    updateIndicator();
}

function attachEventListenerToIndicator(indicator) {
    indicator.addEventListener("click", () => {
        let index = indicator.dataset.index;
        let action =
            index == currentImageIndex
                ? sameNumericInput
                : () => updatePopupImageByIndex(index);
        action();
    });
}

function createIndicators(numberOfIndicators) {
    let indicatorList = [];
    for (let i = 0; i < numberOfIndicators; i++) {
        let indicator = document.createElement("li");
        indicator.classList.add("popup-btn", "popup-btn--indicator");
        indicator.setAttribute("data-index", i);
        indicator.innerText = i + 1;
        attachEventListenerToIndicator(indicator);
        indicatorList.push(indicator);
    }
    return indicatorList;
}

function attachEventListenerToCardsIcons(card) {
    icon = card.querySelector(".icon");
    icon.addEventListener("click", () => {
        let index = card.dataset.index;
        updatePopupImageByIndex(index)
        openPopup();
    });
}

function invalidNumericInput() {
    popupImageContainer.classList.add("shake");
    popupImageContainer.addEventListener("animationend", () => {
        popupImageContainer.classList.remove("shake");
    });
}

function sameNumericInput(params) {
    popupImageContainer.classList.add("expand");
    popupImageContainer.addEventListener("animationend", () => {
        popupImageContainer.classList.remove("expand");
    });
}

function handleNumericInput(keyInput) {
    index = keyInput - 1;
    if (index === currentImageIndex) {
        sameNumericInput();
        return;
    }
    let action = isNumberInRange(index, 0, galleryCards.length - 1)
        ? () => updatePopupImageByIndex(index)
        : invalidNumericInput;
    action();
    return;
}

function handleKeyboardInputs(keyInput, controlsFile) {
    if (!isNaN(keyInput)) {
        handleNumericInput(keyInput);
        return;
    }

    let action = controlsFile[keyInput];
    if (action) {
        action();
        return;
    }
}

// Controls
let Controls = {
    Escape: closePopup,
    ArrowRight: nextImage,
    ArrowLeft: previousImage,
};

// Get the popup components
let popup = document.querySelector(".popup");
let popupImageContainer = popup.querySelector(".image");
let popupImage = popupImageContainer.querySelector("img");
let indicatorsContainer = popup.querySelector(".indicators-container");
let popupOverlay = popup.querySelector(".overlay");
let currentImageIndex = 0;

// Get action buttons
let closeButton = popup.querySelector(".popup-btn--close");
let previousButton = popup.querySelector(".popup-btn--previous");
let nextButton = popup.querySelector(".popup-btn--next");

// Get gallery components
let galleryCardContainer = document.querySelector("#Gallery .card-container");
let galleryCards = galleryCardContainer.querySelectorAll(".gallery-card");

// Create and append indicators
let indicators = createIndicators(galleryCards.length);
let activeIndicator = indicators[currentImageIndex];
activeIndicator.classList.toggle("active");
indicatorsContainer.append(...indicators);

// Attaching event listeners
galleryCards.forEach((card) => attachEventListenerToCardsIcons(card));
popupOverlay.addEventListener("click", closePopup);
closeButton.addEventListener("click", closePopup);
previousButton.addEventListener("click", previousImage);
nextButton.addEventListener("click", nextImage);
document.addEventListener("keyup", (event) =>
    handleKeyboardInputs(event.key, Controls)
);
