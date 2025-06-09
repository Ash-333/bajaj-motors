// Bike Carousel Component
export class BikeCarousel {
  constructor() {
    // Elements
    this.bikeImage = document.getElementById("s1-bikeImage");
    this.title = document.getElementById("s1-title");
    this.description = document.getElementById("s1-description");
    this.prevBtn = document.getElementById("s1-prevBtn");
    this.nextBtn = document.getElementById("s1-nextBtn");
    this.thumbnails = document.querySelectorAll(".thumbnail");
    this.variantButtons = document.querySelectorAll(".variant-btn");
    this.colorButtons = document.querySelectorAll("[data-color]");

    // Bike data with multiple images for each model
    this.models = [
      {
        name: "PULSAR 220F ABS",
        images: [
          "/assets/bike1.svg",
          "/assets/bike1-black.svg",
          "/assets/bike1-yellow.svg",
          "/assets/bike1-green.svg"
        ],
        description: "Powerful High Performance bike that offers superior power, handling, safety, features to meet diversified demands",
        buttonId: "s1-variant-220f",
      },
      {
        name: "PULSAR 150 TD",
        images: [
          "/assets/bike2.svg",
          "/assets/bike2-black.svg",
          "/assets/bike2-yellow.svg",
          "/assets/bike2-green.svg"
        ],
        description: "Reliable and stylish with excellent fuel efficiency and smooth handling.",
        buttonId: "s1-variant-150td",
      },
      {
        name: "PULSAR 150",
        images: [
          "/assets/bike3.svg",
          "/assets/bike3-black.svg",
          "/assets/bike3-yellow.svg",
          "/assets/bike3-green.svg"
        ],
        description: "An iconic blend of power and style, perfect for city rides.",
        buttonId: "s1-variant-150",
      },
      {
        name: "PULSAR 125",
        images: [
          "/assets/bike4.svg",
          "/assets/bike4-black.svg",
          "/assets/bike4-yellow.svg",
          "/assets/bike4-green.svg"
        ],
        description: "Perfect entry-level bike with great mileage and comfortable ride.",
        buttonId: "s1-variant-125",
      },
    ];

    this.currentIndex = 0;
    this.currentColorIndex = 0;
    this.isTransitioning = false;

    // Initialize
    this.init();
  }

  init() {
    // Add transition styles
    this.bikeImage.style.transition = "opacity 0.3s ease-in-out";

    // Setup event listeners
    this.setupEventListeners();

    // Preload images and initialize view
    this.preloadImages();
    this.updateView(this.currentIndex, this.currentColorIndex);
  }

  preloadImages() {
    this.models.forEach((model) => {
      model.images.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    });
  }

  updateView(index, colorIndex = 0) {
    if (this.isTransitioning || !this.models[index]) return;
    this.isTransitioning = true;

    const model = this.models[index];

    // Fade out current image
    this.bikeImage.style.opacity = "0";

    setTimeout(() => {
      // Update content
      this.bikeImage.src = model.images[colorIndex] || model.images[0];
      this.title.textContent = model.name;
      this.description.textContent = model.description;

      // Update active button styles
      this.updateVariantButtons(model.buttonId);

      // Update thumbnails
      this.updateThumbnails(index);

      // Update color buttons
      this.updateColorButtons(colorIndex);

      // Fade in new image
      this.bikeImage.style.opacity = "1";
      this.isTransitioning = false;
    }, 300);
  }

  updateVariantButtons(activeButtonId) {
    this.variantButtons.forEach((btn) => {
      btn.classList.remove("font-bold", "border-b-2", "border-black");
      btn.classList.add("text-gray-500");
    });

    const activeBtn = document.getElementById(activeButtonId);
    if (activeBtn) {
      activeBtn.classList.add("font-bold", "border-b-2", "border-black");
      activeBtn.classList.remove("text-gray-500");
    }
  }

  updateThumbnails(activeIndex) {
    this.thumbnails.forEach((thumb, idx) => {
      if (idx === activeIndex) {
        thumb.classList.remove("opacity-50");
        thumb.classList.add("border-black");
        thumb.classList.remove("border-gray-300");
      } else {
        thumb.classList.add("opacity-50");
        thumb.classList.remove("border-black");
        thumb.classList.add("border-gray-300");
      }
    });
  }

  updateColorButtons(activeColorIndex) {
    this.colorButtons.forEach((btn) => {
      btn.classList.remove("ring-2", "ring-blue-500");
    });
    if (this.colorButtons[activeColorIndex]) {
      this.colorButtons[activeColorIndex].classList.add("ring-2", "ring-blue-500");
    }
  }

  setupEventListeners() {
    // Arrow click events
    this.nextBtn.addEventListener("click", () => {
      if (this.isTransitioning) return;
      this.currentIndex = (this.currentIndex + 1) % this.models.length;
      this.updateView(this.currentIndex, this.currentColorIndex);
    });

    this.prevBtn.addEventListener("click", () => {
      if (this.isTransitioning) return;
      this.currentIndex = (this.currentIndex - 1 + this.models.length) % this.models.length;
      this.updateView(this.currentIndex, this.currentColorIndex);
    });

    // Variant button clicks
    this.variantButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (this.isTransitioning) return;
        const variantIndex = parseInt(btn.getAttribute("data-variant"));
        if (!isNaN(variantIndex) && variantIndex < this.models.length) {
          this.currentIndex = variantIndex;
          this.updateView(this.currentIndex, this.currentColorIndex);
        }
      });
    });

    // Thumbnail clicks
    this.thumbnails.forEach((thumb) => {
      thumb.addEventListener("click", () => {
        if (this.isTransitioning) return;
        const thumbIndex = parseInt(thumb.getAttribute("data-index"));
        if (!isNaN(thumbIndex) && thumbIndex < this.models.length) {
          this.currentIndex = thumbIndex;
          this.updateView(this.currentIndex, this.currentColorIndex);
        }
      });
    });

    // Color picker functionality
    this.colorButtons.forEach((button) => {
      button.addEventListener("click", () => {
        if (this.isTransitioning) return;
        const colorIndex = parseInt(button.getAttribute("data-color"));
        if (!isNaN(colorIndex)) {
          this.currentColorIndex = colorIndex;
          this.updateView(this.currentIndex, this.currentColorIndex);
        }
      });
    });

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (this.isTransitioning) return;

      if (e.key === "ArrowRight") {
        this.currentIndex = (this.currentIndex + 1) % this.models.length;
        this.updateView(this.currentIndex, this.currentColorIndex);
      } else if (e.key === "ArrowLeft") {
        this.currentIndex = (this.currentIndex - 1 + this.models.length) % this.models.length;
        this.updateView(this.currentIndex, this.currentColorIndex);
      }
    });
  }
} 