// carousel.js

// Global variable to store experiences data
let originalExperiences = [];

// Function to load experiences from JSON
async function loadExperiencesData() {
    try {
        const response = await fetch('./js/experienceData.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        originalExperiences = data.originalExperiences;
        return originalExperiences;
    } catch (error) {
        console.error('Error loading experiences data:', error);
        // Fallback data in case JSON fails to load
        originalExperiences = [
            {
                title: "Squad Diaries",
                description: "Adventures with your riding squad.",
                image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=500&fit=crop&crop=center",
                link: "#"
            },
            {
                title: "Grand Exchange Mela",
                description: "Exciting offers on new Bajaj bikes.",
                image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=500&fit=crop&crop=center",
                link: "#"
            }
        ];
        return originalExperiences;
    }
}

// Ensure the DOM is fully loaded before running the script
// (Still good practice, though modules are "deferred" by default)
document.addEventListener('DOMContentLoaded', async () => {
    // Load experiences data first
    await loadExperiencesData();
    const carouselContainer = document.getElementById('experienceCarouselContainer');
    const carouselWrapper = document.querySelector('.experience-carousel-wrapper');
    const leftArrow = document.getElementById('leftArrow');
    const rightArrow = document.getElementById('rightArrow');

    const cardBaseWidth = 481;
    const focusedCardScale = 1;
    const sideCardScale = 0.8;
    const overlapAmount = 80;

    let currentIndex = 0;
    let autoScrollInterval;
    const autoScrollDelay = 3000;

    const duplicateStartCount = 2;
    const duplicateEndCount = 2;

    function createCarouselItem(experience) {
        const card = document.createElement('div');
        card.className = `experience-carousel-item rounded-lg shadow-lg`;

        const imageWrapper = document.createElement('div');
        imageWrapper.className = "card-image-wrapper";

        const img = document.createElement('img');
        img.src = experience.image;
        img.alt = experience.title;
        img.className = "card-image";

        const linkButton = document.createElement('a');
        linkButton.href = experience.link;
        linkButton.className = "explore-button";
        linkButton.innerHTML = `
  Discover More 
  <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.6445 6.07812L16.4688 10.8047C16.5469 10.8828 16.5957 10.9772 16.6152 11.0879C16.6348 11.1986 16.612 11.306 16.5469 11.4102C16.5208 11.4753 16.4883 11.5273 16.4492 11.5664L11.6836 16.4102C11.5794 16.5013 11.459 16.5469 11.3223 16.5469C11.1855 16.5469 11.0716 16.5013 10.9805 16.4102L10.7852 16.2148C10.694 16.1107 10.6484 15.9902 10.6484 15.8535C10.6484 15.7168 10.694 15.6029 10.7852 15.5117L14.3789 11.8594H4.55469C4.42448 11.8594 4.31055 11.8105 4.21289 11.7129C4.11523 11.6152 4.06641 11.4948 4.06641 11.3516V11.0781C4.06641 10.9479 4.11523 10.834 4.21289 10.7363C4.31055 10.6387 4.42448 10.5898 4.55469 10.5898H14.4375L10.7656 6.99609C10.6745 6.90495 10.6257 6.78776 10.6191 6.64453C10.6126 6.5013 10.6615 6.38411 10.7656 6.29297L10.9414 6.09766C11.0456 5.99349 11.166 5.94141 11.3027 5.94141C11.4395 5.94141 11.5534 5.98698 11.6445 6.07812Z" fill="white"/>
  </svg>
`

        imageWrapper.appendChild(img);
        imageWrapper.appendChild(linkButton);
        card.appendChild(imageWrapper);

        return card;
    }

    function populateCarousel() {
        carouselContainer.innerHTML = '';
        const totalOriginalCards = originalExperiences.length;

        for (let i = 0; i < duplicateStartCount; i++) {
            carouselContainer.appendChild(createCarouselItem(originalExperiences[totalOriginalCards - duplicateStartCount + i]));
        }

        originalExperiences.forEach((exp) => {
            carouselContainer.appendChild(createCarouselItem(exp));
        });

        for (let i = 0; i < duplicateEndCount; i++) {
            carouselContainer.appendChild(createCarouselItem(originalExperiences[i]));
        }

        currentIndex = duplicateStartCount;
        updateCarousel(false);
    }

    function updateCarousel(useTransition = true) {
        const allCards = Array.from(carouselContainer.children);
        const totalOriginalCards = originalExperiences.length;

        if (useTransition) {
            carouselContainer.style.transition = 'transform 0.5s ease-in-out';
        } else {
            carouselContainer.style.transition = 'none';
        }

        const scaledFocusedCardWidth = cardBaseWidth * focusedCardScale;
        const scaledSideCardWidth = cardBaseWidth * sideCardScale;

        const wrapperTargetWidth = scaledSideCardWidth + scaledFocusedCardWidth + scaledSideCardWidth - (overlapAmount * 2);
        carouselWrapper.style.width = `${wrapperTargetWidth}px`;

        allCards.forEach((card, index) => {
            card.style.width = `${cardBaseWidth}px`;
            card.style.height = `${cardBaseWidth * 1.6}px`;

            if (index === currentIndex) {
                card.classList.add('focused');
                const marginValue = -overlapAmount;
                card.style.marginLeft = `${marginValue}px`;
                card.style.marginRight = `${marginValue}px`;
            } else {
                card.classList.remove('focused');
                card.style.marginLeft = `0px`;
                card.style.marginRight = `0px`;
            }
        });

        const focusedCardElement = allCards[currentIndex];

        if (focusedCardElement) {
            const focusedRect = focusedCardElement.getBoundingClientRect();
            const wrapperRect = carouselWrapper.getBoundingClientRect();

            const focusedCardViewportCenter = focusedRect.left + (focusedRect.width / 2);
            const wrapperViewportCenter = wrapperRect.left + (wrapperRect.width / 2);

            const currentTransformX = parseFloat(getComputedStyle(carouselContainer).transform.split(',')[4] || 0);

            const translateXValue = currentTransformX + (wrapperViewportCenter - focusedCardViewportCenter);

            carouselContainer.style.transform = `translateX(${translateXValue}px)`;
        }

        carouselContainer.removeEventListener('transitionend', handleTransitionEnd);
        carouselContainer.addEventListener('transitionend', handleTransitionEnd);
    }

    function handleTransitionEnd() {
        const totalOriginalCards = originalExperiences.length;

        if (currentIndex >= totalOriginalCards + duplicateStartCount) {
            currentIndex = duplicateStartCount;
            updateCarousel(false);
        } else if (currentIndex < duplicateStartCount) {
            currentIndex = totalOriginalCards + duplicateStartCount - 1;
            updateCarousel(false);
        }
    }

    function nextCard() {
        currentIndex++;
        updateCarousel();
    }

    function prevCard() {
        currentIndex--;
        updateCarousel();
    }

    function startAutoScroll() {
        stopAutoScroll();
        autoScrollInterval = setInterval(nextCard, autoScrollDelay);
    }

    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
    }

    // Initialize carousel after data is loaded
    if (originalExperiences.length > 0) {
        populateCarousel();
        startAutoScroll();
    } else {
        console.error('No experiences data available to populate carousel');
    }

    leftArrow.addEventListener('click', () => {
        stopAutoScroll();
        prevCard();
        startAutoScroll();
    });

    rightArrow.addEventListener('click', () => {
        stopAutoScroll();
        nextCard();
        startAutoScroll();
    });

    window.addEventListener('resize', () => {
        stopAutoScroll();
        setTimeout(() => {
            updateCarousel(false);
            startAutoScroll();
        }, 100);
    });

    carouselWrapper.addEventListener('mouseenter', stopAutoScroll);
    carouselWrapper.addEventListener('mouseleave', startAutoScroll);
    leftArrow.addEventListener('mouseenter', stopAutoScroll);
    leftArrow.addEventListener('mouseleave', startAutoScroll);
    rightArrow.addEventListener('mouseenter', stopAutoScroll);
    rightArrow.addEventListener('mouseleave', startAutoScroll);
});