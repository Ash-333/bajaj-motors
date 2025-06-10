// Bajaj Experiences API Service
class ExperiencesAPI {
  constructor() {
    this.baseURL = "https://api.bajaj-experiences.com"; // Simulated API endpoint
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes cache
  }

  // Simulate API call with fetch-like interface
  async fetchExperiences() {
    console.log("🚀 Fetching Bajaj Experiences...");

    // Check cache first
    const cacheKey = "experiences";
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      console.log("📦 Returning cached experiences");
      return cached.data;
    }

    try {
      // Simulate network delay (1-3 seconds)
      const delay = Math.random() * 2000 + 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Simulate potential network failure (5% chance)
      if (Math.random() < 0.05) {
        throw new Error("Network timeout - please try again");
      }

      // Generate dynamic experiences data
      const experiences = this.generateExperiencesData();

      // Cache the result
      this.cache.set(cacheKey, {
        data: experiences,
        timestamp: Date.now(),
      });

      console.log(
        "✅ Experiences fetched successfully:",
        experiences.length,
        "items"
      );
      return experiences;
    } catch (error) {
      console.error("❌ Failed to fetch experiences:", error.message);
      throw error;
    }
  }

  // Generate realistic experiences data
  generateExperiencesData() {
    const experiences = [
      {
        id: "squad-diaries",
        title: "SQUAD DIARIES",
        subtitle: "Join the Community",
        description:
          "Connect with fellow riders and share your incredible journeys. Be part of the ultimate motorcycle community.",
        image:
          "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=500&fit=crop&crop=center",
        buttonText: "JOIN SQUAD",
        category: "community",
        featured: true,
        priority: 1,
        tags: ["community", "social", "riders"],
        metadata: {
          participants: "50K+",
          rating: 4.8,
          duration: "Ongoing",
        },
      },
      {
        id: "grand-exchange-mela",
        title: "GRAND EXCHANGE MELA",
        subtitle: "Biggest Exchange Event",
        description:
          "Experience the largest motorcycle exchange festival. Trade, upgrade, and discover amazing deals on your favorite bikes.",
        image:
          "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=500&fit=crop&crop=center",
        buttonText: "DISCOVER MORE",
        category: "event",
        featured: true,
        priority: 2,
        tags: ["exchange", "festival", "deals"],
        metadata: {
          participants: "25K+",
          rating: 4.9,
          duration: "3 Days",
        },
      },
      {
        id: "auto-show-2024",
        title: "AUTO SHOW 2024",
        subtitle: "Future of Mobility",
        description:
          "Witness cutting-edge innovations and upcoming models. Get a glimpse into the future of motorcycle technology.",
        image:
          "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=300&h=500&fit=crop&crop=center",
        buttonText: "EXPLORE",
        category: "exhibition",
        featured: true,
        priority: 3,
        tags: ["innovation", "technology", "future"],
        metadata: {
          participants: "100K+",
          rating: 4.7,
          duration: "5 Days",
        },
      },
      {
        id: "racing-championship",
        title: "RACING CHAMPIONSHIP",
        subtitle: "Feel the Adrenaline",
        description:
          "Experience the thrill of professional motorcycle racing. Watch the best riders compete for ultimate glory.",
        image:
          "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=300&h=500&fit=crop&crop=center",
        buttonText: "WATCH LIVE",
        category: "racing",
        featured: false,
        priority: 4,
        tags: ["racing", "competition", "adrenaline"],
        metadata: {
          participants: "200+",
          rating: 4.9,
          duration: "2 Days",
        },
      },
      {
        id: "adventure-tours",
        title: "ADVENTURE TOURS",
        subtitle: "Epic Journeys Await",
        description:
          "Embark on breathtaking adventures across stunning landscapes. Create memories that will last a lifetime.",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=500&fit=crop&crop=center",
        buttonText: "BOOK TOUR",
        category: "adventure",
        featured: false,
        priority: 5,
        tags: ["adventure", "travel", "exploration"],
        metadata: {
          participants: "5K+",
          rating: 4.8,
          duration: "7-14 Days",
        },
      },
    ];

    // Add random timestamps to simulate real API data
    experiences.forEach((exp) => {
      exp.createdAt = new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ).toISOString();
      exp.updatedAt = new Date(
        Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
      ).toISOString();
    });

    // Sort by priority and featured status
    return experiences.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return a.priority - b.priority;
    });
  }

  // Fetch single experience by ID
  async fetchExperienceById(id) {
    console.log(`🔍 Fetching experience: ${id}`);

    try {
      const experiences = await this.fetchExperiences();
      const experience = experiences.find((exp) => exp.id === id);

      if (!experience) {
        throw new Error(`Experience with ID '${id}' not found`);
      }

      return experience;
    } catch (error) {
      console.error(`❌ Failed to fetch experience ${id}:`, error.message);
      throw error;
    }
  }

  // Fetch experiences by category
  async fetchExperiencesByCategory(category) {
    console.log(`📂 Fetching experiences for category: ${category}`);

    try {
      const experiences = await this.fetchExperiences();
      return experiences.filter((exp) => exp.category === category);
    } catch (error) {
      console.error(
        `❌ Failed to fetch experiences for category ${category}:`,
        error.message
      );
      throw error;
    }
  }

  // Simulate user interaction tracking
  async trackExperienceClick(experienceId, action = "click") {
    console.log(`📊 Tracking ${action} for experience: ${experienceId}`);

    // Simulate analytics call
    await new Promise((resolve) => setTimeout(resolve, 100));

    return {
      success: true,
      experienceId,
      action,
      timestamp: new Date().toISOString(),
    };
  }

  // Clear cache (useful for testing)
  clearCache() {
    this.cache.clear();
    console.log("🗑️ Cache cleared");
  }

  // Get cache status
  getCacheStatus() {
    const entries = Array.from(this.cache.entries()).map(([key, value]) => ({
      key,
      age: Date.now() - value.timestamp,
      expired: Date.now() - value.timestamp > this.cacheTimeout,
    }));

    return {
      size: this.cache.size,
      entries,
    };
  }
}

// Create and export singleton instance
const experiencesAPI = new ExperiencesAPI();

// Make it globally available for debugging
window.experiencesAPI = experiencesAPI;

export default experiencesAPI;
