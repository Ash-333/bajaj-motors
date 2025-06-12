// Carousel Module
export class CarouselManager {
  constructor() {
    this.slides = [
      {
        id: "slide1",
        image: "./assets/hero_image_1.png",
        title: "PULSAR Series",
        subtitle: "Definitely Male",
        description:
          "Experience the thrill of performance with our latest PULSAR motorcycles. Built for speed, designed for dominance.",
        cta: "Explore PULSAR",
        active: true,
        category: "sport",
      },
      {
        id: "slide2",
        image:
          "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=1920&h=1080&fit=crop",
        title: "DOMINAR 400",
        subtitle: "Adventure Awaits",
        description:
          "Conquer every terrain with the powerful DOMINAR 400. Your gateway to unlimited adventures.",
        cta: "Discover DOMINAR",
        active: true,
        category: "adventure",
      },
      {
        id: "slide3",
        image:
          "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1920&h=1080&fit=crop",
        title: "AVENGER Series",
        subtitle: "Cruise in Style",
        description:
          "Embrace the cruiser lifestyle with AVENGER. Comfort meets performance on every ride.",
        cta: "View AVENGER",
        active: true,
        category: "cruiser",
      },
      // {
      //   id: "slide4",
      //   image:
      //     "https://images.unsplash.com/photo-1605531179818-de32686e5e2e?w=1920&h=1080&fit=crop",
      //   title: "PLATINA",
      //   subtitle: "Comfort Redefined",
      //   description:
      //     "The perfect blend of comfort and efficiency. PLATINA makes every journey memorable.",
      //   cta: "Experience PLATINA",
      //   active: true,
      //   category: "commuter",
      // },
    ];

    this.settings = {
      autoplay: true,
      autoplaySpeed: 5000,
      showDots: true,
      showArrows: true,
      loop: true,
      transition: "slide",
    };

    this.currentSlide = 0;
    this.carouselInterval = null;
  }

  // Get all active slides
  getActiveSlides() {
    return this.slides.filter((slide) => slide.active);
  }

  // Add new slide
  addSlide(slideData) {
    const newSlide = {
      id: slideData.id || "slide_" + Date.now(),
      image: slideData.image || "",
      title: slideData.title || "Untitled",
      subtitle: slideData.subtitle || "",
      description: slideData.description || "",
      cta: slideData.cta || "Learn More",
      active: slideData.active !== false,
      category: slideData.category || "general",
      ...slideData,
    };

    this.slides.push(newSlide);
    this.refresh();
    return newSlide;
  }

  // Remove slide by ID
  removeSlide(slideId) {
    const index = this.slides.findIndex((slide) => slide.id === slideId);
    if (index > -1) {
      this.slides.splice(index, 1);
      this.refresh();
      return true;
    }
    return false;
  }

  // Update slide
  updateSlide(slideId, updateData) {
    const slide = this.slides.find((slide) => slide.id === slideId);
    if (slide) {
      Object.assign(slide, updateData);
      this.refresh();
      return slide;
    }
    return null;
  }

  // Toggle slide active status
  toggleSlide(slideId) {
    const slide = this.slides.find((slide) => slide.id === slideId);
    if (slide) {
      slide.active = !slide.active;
      this.refresh();
      return slide;
    }
    return null;
  }

  // Get slides by category
  getSlidesByCategory(category) {
    return this.slides.filter(
      (slide) => slide.category === category && slide.active
    );
  }

  // Update settings
  updateSettings(newSettings) {
    Object.assign(this.settings, newSettings);
    this.refresh();
  }

  // Initialize carousel
  initialize() {
    this.renderSlides();
    this.renderDots();
    this.setupControls();
    if (this.settings.autoplay) {
      this.startAutoPlay();
    }
  }

  // Render carousel slides
  renderSlides() {
    const slidesContainer = document.getElementById("carousel-slides");
    if (!slidesContainer) return;

    slidesContainer.innerHTML = "";
    const activeSlides = this.getActiveSlides();

    if (activeSlides.length === 0) {
      slidesContainer.innerHTML =
        '<div class="carousel-slide bg-gray-800 flex items-center justify-center"><div class="text-white text-center"><h2 class="text-4xl font-bold mb-4">No Active Slides</h2><p class="text-xl">Add some slides to get started!</p></div></div>';
      return;
    }

    activeSlides.forEach((slide, index) => {
      const slideElement = document.createElement("div");
      slideElement.className = "carousel-slide";
      slideElement.style.backgroundImage = `url(${slide.image})`;
      // Remove all text content - slides now only show background images
      slideElement.innerHTML = "";
      slidesContainer.appendChild(slideElement);
    });
  }

  // Render carousel dots
  renderDots() {
    const dotsContainer = document.getElementById("carousel-dots");
    if (!dotsContainer) return;

    dotsContainer.innerHTML = "";
    const activeSlides = this.getActiveSlides();

    if (!this.settings.showDots || activeSlides.length <= 1) {
      dotsContainer.style.display = "none";
      return;
    }

    dotsContainer.style.display = "flex";
    activeSlides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.className = `carousel-dot ${
        index === this.currentSlide ? "active" : ""
      }`;
      dot.addEventListener("click", () => this.goToSlide(index));
      dotsContainer.appendChild(dot);
    });
  }

  // Go to specific slide
  goToSlide(slideIndex) {
    const activeSlides = this.getActiveSlides();
    if (slideIndex < 0 || slideIndex >= activeSlides.length) return;

    this.currentSlide = slideIndex;
    const slidesContainer = document.getElementById("carousel-slides");
    if (!slidesContainer) return;

    const translateX = -slideIndex * 100;
    slidesContainer.style.transform = `translateX(${translateX}%)`;

    // Update active dot
    document.querySelectorAll(".carousel-dot").forEach((dot, index) => {
      dot.classList.toggle("active", index === slideIndex);
    });

    // Note: Text content animation removed since slides now only contain background images
  }

  // Next slide
  nextSlide() {
    const activeSlides = this.getActiveSlides();
    if (activeSlides.length === 0) return;

    this.currentSlide = (this.currentSlide + 1) % activeSlides.length;
    this.goToSlide(this.currentSlide);
  }

  // Previous slide
  previousSlide() {
    const activeSlides = this.getActiveSlides();
    if (activeSlides.length === 0) return;

    this.currentSlide =
      (this.currentSlide - 1 + activeSlides.length) % activeSlides.length;
    this.goToSlide(this.currentSlide);
  }

  // Setup carousel controls
  setupControls() {
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");
    const carouselContainer = document.querySelector(".carousel-container");

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        this.nextSlide();
        this.resetAutoPlay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        this.previousSlide();
        this.resetAutoPlay();
      });
    }

    // Pause autoplay on hover
    if (carouselContainer) {
      carouselContainer.addEventListener("mouseenter", () =>
        this.stopAutoPlay()
      );
      carouselContainer.addEventListener("mouseleave", () =>
        this.startAutoPlay()
      );
    }

    // Setup Explore More button
    const exploreBtn = document.getElementById("explore-more-btn");
    if (exploreBtn) {
      exploreBtn.addEventListener("click", () => {
        // Scroll to next section or trigger custom action
        const nextSection = document.querySelector("section:nth-of-type(2)");
        if (nextSection) {
          nextSection.scrollIntoView({ behavior: "smooth" });
        } else {
          // Fallback: scroll down by viewport height
          window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
        }
      });
    }
  }

  // Start autoplay
  startAutoPlay() {
    if (!this.settings.autoplay) return;
    this.stopAutoPlay();
    this.carouselInterval = setInterval(
      () => this.nextSlide(),
      this.settings.autoplaySpeed
    );
  }

  // Stop autoplay
  stopAutoPlay() {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
      this.carouselInterval = null;
    }
  }

  // Reset autoplay
  resetAutoPlay() {
    if (this.settings.autoplay) {
      this.stopAutoPlay();
      this.startAutoPlay();
    }
  }

  // Refresh carousel
  refresh() {
    this.renderSlides();
    this.renderDots();

    // Reset current slide if it's out of bounds
    const activeSlides = this.getActiveSlides();
    if (this.currentSlide >= activeSlides.length) {
      this.currentSlide = 0;
    }

    if (activeSlides.length > 0) {
      this.goToSlide(this.currentSlide);
    }

    // Restart autoplay if enabled
    if (this.settings.autoplay) {
      this.resetAutoPlay();
    }
  }

  // Get carousel statistics
  getStats() {
    return {
      totalSlides: this.slides.length,
      activeSlides: this.getActiveSlides().length,
      inactiveSlides: this.slides.filter((slide) => !slide.active).length,
      categories: [...new Set(this.slides.map((slide) => slide.category))],
      settings: { ...this.settings },
    };
  }
}
