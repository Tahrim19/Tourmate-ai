const SECTION_MAPPINGS = {
  "🏛️": { category: "attractions", title: "Top Attractions" },
  "🌳": { category: "parks", title: "Parks & Nature" },
  "🛍️": { category: "malls", title: "Shopping & Malls" },
  "💎": { category: "gems", title: "Hidden Gems" },
  "🍜": { category: "dishes", title: "Must-Try Dishes" },
  "🏪": { category: "restaurants", title: "Best Restaurants" },
  "🌮": { category: "street_food", title: "Street Food" },
  "☕": { category: "cafes", title: "Cafes & Desserts" },
  "💡": { category: "tips", title: "Tips & Suggestions" },
};

/**
 * Parses a bullet point line for name, optional rating, and description.
 * Handles missing ratings gracefully.
 */
function parseBulletPoint(line) {
  // Remove bullet point prefix (e.g., "* ", "- ", "+ ")
  const cleaned = line.replace(/^\s*[*\-+]\s*/, "");
  
  // Extract bold text for the name
  const boldMatch = cleaned.match(/^\*\*(.*?)\*\*(.*)/);
  if (!boldMatch) {
    // If not in bold, treat the whole line as description
    return { name: "Tip", rating: null, description: cleaned };
  }
  
  const name = boldMatch[1].trim();
  let remaining = boldMatch[2].trim();
  
  // Clean leading separators from the remaining text (like " — ", " - ", " : ")
  remaining = remaining.replace(/^[—–:\s-]+/, "").trim();
  
  let rating = null;
  let description = remaining;
  
  // Match rating patterns: "⭐4.8", "⭐ 4.8", or plain "⭐"
  const ratingMatch = remaining.match(/^(?:⭐\s*([\d.]+)|([\d.]+)\s*⭐|⭐)/);
  if (ratingMatch) {
    rating = ratingMatch[1] || "⭐";
    // Slice off the matched rating and clean any trailing separators
    description = remaining.substring(ratingMatch[0].length).replace(/^[—–:\s-]+/, "").trim();
  }
  
  return { name, rating, description: description || "" };
}

/**
 * Parse the plain text response from the multi-agent backend into
 * structured JS blocks to render rich UI cards.
 */
export function parseResponse(text) {
  if (!text) return [];

  const lines = text.split("\n");
  const blocks = [];
  
  let currentSection = null;
  let currentPlace = null;
  let currentItineraryDay = null;
  let currentTimeBlock = null;
  let currentTextParagraph = "";

  function flushTextParagraph() {
    if (currentTextParagraph.trim()) {
      blocks.push({
        type: "text",
        content: currentTextParagraph.trim()
      });
      currentTextParagraph = "";
    }
  }

  function flushCurrentPlace() {
    if (currentPlace && currentSection) {
      currentSection.items.push(currentPlace);
      currentPlace = null;
    }
  }

  function flushCurrentSection() {
    flushCurrentPlace();
    if (currentSection) {
      blocks.push(currentSection);
      currentSection = null;
    }
  }

  function flushCurrentItineraryDay() {
    if (currentItineraryDay) {
      if (currentTimeBlock) {
        currentItineraryDay.timeBlocks.push(currentTimeBlock);
        currentTimeBlock = null;
      }
      blocks.push(currentItineraryDay);
      currentItineraryDay = null;
    }
  }

  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // 1. Check for Itinerary Day Header: e.g., 🗓️ **Day 1 — Mughal Heritage**
    if (trimmed.includes("🗓️")) {
      flushTextParagraph();
      flushCurrentSection();
      flushCurrentItineraryDay();

      // Extract day number and theme. Support patterns like "Day 1 - Theme" or "Day 1: Theme"
      const dayMatch = trimmed.match(/Day\s*(\d+)\s*[—–:\s-]\s*(.*)/i) || trimmed.match(/Day\s*(\d+)(.*)/i);
      const dayNum = dayMatch ? dayMatch[1] : "1";
      let theme = dayMatch ? dayMatch[2] : "";
      theme = theme.replace(/\*\*|^\s*[—–:\s-]+/g, "").trim();

      currentItineraryDay = {
        type: "itinerary_day",
        day: dayNum,
        theme: theme,
        timeBlocks: [],
        transport: null,
        budget: null,
        tips: []
      };
      continue;
    }

    // 2. Check for standard Section headers using emojis
    let sectionHeaderMatch = false;
    for (const [emoji, mapping] of Object.entries(SECTION_MAPPINGS)) {
      if (trimmed.includes(emoji)) {
        flushTextParagraph();
        flushCurrentSection();
        flushCurrentItineraryDay();

        currentSection = {
          type: "section",
          category: mapping.category,
          title: mapping.title,
          items: []
        };
        sectionHeaderMatch = true;
        break;
      }
    }
    if (sectionHeaderMatch) continue;

    // 3. Inside Itinerary Day parsing
    if (currentItineraryDay) {
      // Time Blocks: Morning 🌅, Afternoon ☀️, Evening 🌙
      if (trimmed.includes("🌅") || trimmed.includes("☀️") || trimmed.includes("🌙")) {
        if (currentTimeBlock) {
          currentItineraryDay.timeBlocks.push(currentTimeBlock);
        }

        let timeName = "Morning";
        let emoji = "🌅";
        if (trimmed.includes("☀️")) {
          timeName = "Afternoon";
          emoji = "☀️";
        } else if (trimmed.includes("🌙")) {
          timeName = "Evening";
          emoji = "🌙";
        }

        // Clean time header, e.g., "Morning (9:00 AM – 12:00 PM)" -> details: "(9:00 AM – 12:00 PM)"
        let timeDetails = trimmed.replace(/^[🌅☀️🌙\s]+/u, "").replace(/\*\*/g, "").trim();
        timeDetails = timeDetails.replace(new RegExp(`^${timeName}\\s*`, "i"), "").replace(/^[—–:\s-]+/, "").trim();

        currentTimeBlock = {
          time: timeName,
          emoji: emoji,
          details: timeDetails,
          activities: []
        };
        continue;
      }

      // Getting Around (Transport)
      if (trimmed.includes("🚗")) {
        const text = trimmed.replace(/^[🚗\s]+/u, "").replace(/^\*\*Getting Around\*\*[:-]/gi, "").replace(/^[—–:\s-]+/, "").trim();
        currentItineraryDay.transport = text;
        continue;
      }

      // Budget
      if (trimmed.includes("💰")) {
        const text = trimmed.replace(/^[💰\s]+/u, "").replace(/^\*\*Budget (Estimate|Tip)\*\*[:-]/gi, "").replace(/^[—–:\s-]+/, "").trim();
        currentItineraryDay.budget = text;
        continue;
      }

      // Tips inside itinerary
      if (trimmed.includes("💡")) {
        const text = trimmed.replace(/^[💡\s]+/u, "").replace(/^\*\*Tips?\*\*[:-]/gi, "").replace(/^[—–:\s-]+/, "").trim();
        currentItineraryDay.tips.push(text);
        continue;
      }

      // Bullet activities under a timeblock
      if (trimmed.startsWith("*") || trimmed.startsWith("-") || trimmed.startsWith("+")) {
        const activityText = trimmed.replace(/^\s*[*\-+]\s*/, "").replace(/\*\*/g, "").trim();
        if (currentTimeBlock) {
          currentTimeBlock.activities.push(activityText);
        } else {
          // If no time block active yet, push to day tips
          currentItineraryDay.tips.push(activityText);
        }
        continue;
      }

      // Any dangling text lines
      if (currentTimeBlock) {
        currentTimeBlock.activities.push(trimmed.replace(/\*\*/g, "").trim());
      } else {
        currentItineraryDay.tips.push(trimmed.replace(/\*\*/g, "").trim());
      }
      continue;
    }

    // 4. Inside Section Places parsing (Attractions, Food, etc.)
    if (currentSection) {
      if (trimmed.includes("📍")) {
        const addressText = trimmed.replace(/^[📍\s]+/, "").trim();
        if (currentPlace) {
          currentPlace.address = addressText;
          flushCurrentPlace();
        }
        continue;
      }

      if (trimmed.startsWith("*") || trimmed.startsWith("-") || trimmed.startsWith("+")) {
        flushCurrentPlace(); // Save previous item

        const parsed = parseBulletPoint(trimmed);
        if (parsed) {
          currentPlace = {
            name: parsed.name,
            rating: parsed.rating,
            description: parsed.description,
            address: null
          };
        }
        continue;
      }
      
      // If it's a line without bullets but we're in a section, it could be description continuation
      if (currentPlace) {
        currentPlace.description += " " + trimmed.replace(/\*\*/g, "").trim();
      } else {
        // Default fall back
        currentTextParagraph += (currentTextParagraph ? " " : "") + trimmed;
      }
      continue;
    }

    // 5. Default text block
    currentTextParagraph += (currentTextParagraph ? " " : "") + trimmed;
  }

  // Final flush for remaining items
  flushTextParagraph();
  flushCurrentSection();
  flushCurrentItineraryDay();

  return blocks;
}
