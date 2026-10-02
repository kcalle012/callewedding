// Site Configuration
// Customize all content here to personalize your wedding website

const siteConfig = {
  // ============================================
  // SECRETS CONFIGURATION
  // ============================================
  // These are set in .env file, NOT here
  // Required secrets (all FREE - no credit card needed):
  // - GOOGLE_SERVICE_ACCOUNT_JSON (for photo upload & blessings)
  // - GOOGLE_DRIVE_FOLDER_ID (for photo storage)
  // - GOOGLE_SPREADSHEET_ID (for blessings & RSVP data)
  // - REACT_APP_RSVP_API_URL (optional: for RSVP form)
  // See README.md for complete free setup guide

  // ============================================
  // WEDDING TYPE
  // ============================================
  // Options: "hindu", "christian", "custom"
  // This determines which event presets are available
  weddingType: "custom", // Change to "christian" or "custom" as needed

  // ============================================
  // FEATURE FLAGS - Enable/disable features
  // ============================================
  // All features are enabled by default - set to false to disable any feature
  features: {
    homepage: { enabled: true, label: "Home" },
    ourStory: { enabled: true, label: "Our Story" },
    events: { enabled: true, label: "Events & RSVP" },
    photoGallery: { enabled: true, label: "Photo Gallery" },
    uploadPhotos: { enabled: true, label: "Upload Photos" },
    blessings: { enabled: true, label: "Blessings" },
    weddingParty: { enabled: true, label: "Wedding Party" },
    registry: { enabled: true, label: "Registry" },
    travel: { enabled: false, label: "Travel & Accommodation" },
    faq: { enabled: true, label: "FAQ" },
    timeline: { enabled: true, label: "Timeline" },
  },

  // ============================================
  // EVENT PRESETS
  // ============================================
  // Pre-built event templates based on wedding type
  // Use these as reference or copy to events array below
  eventPresets: {
    
    christian: [
      { name: "Rehearsal Dinner", description: "Pre-wedding dinner with close family and friends", dressCode: "Semi-formal" },
      { name: "Wedding Ceremony", description: "Church ceremony - join us as we say 'I do'", dressCode: "Formal" },
      { name: "Cocktail Hour", description: "Post-ceremony cocktails and mingling", dressCode: "Semi-formal" },
      { name: "Reception", description: "Wedding reception with dinner and dancing", dressCode: "Formal" },
      { name: "After Party", description: "Late night celebration", dressCode: "Casual" },
    ],
    custom: [
      { name: "Mass", description: "Mass will happen at 3:00pm at St. Peter's Roman Catholic Church in Belleville, NJ", dressCode: "Formal" },
      { name: "Reception", description: "Reception will take place at Il Villagio at 6:00pm", dressCode: "Fornal"}
    ], // User defines their own events
  },

  // Couple Information
  couple: {
    name1: "Kevin Calle",
    name2: "Gabriela Herrera",
    displayName: "Kevin and Gabriela Calle", // Used in navbar and footer
    name1Image: "/images/partner1.svg", // Path to partner 1's photo (replace with your image)
    name2Image: "/images/partner2.svg", // Path to partner 2's photo (replace with your image)
  },

  // Wedding Date (for countdown timer)
  wedding: {
    date: "2027-06-19T15:00:00", // ISO format date/time
    location: "Belleville, NJ",
  },

  // Homepage
  homepage: {
    title: "Welcome to Our Wedding Website!",
    subtitle: "We're so excited to share our special day with you. Capture and share your favorite moments from our wedding here!",
    ctaButton: "Upload Photos",
    backgroundImage: "/_DS21059.jpeg",
    showCountdown: true,
  },

  // Our Story Section
  ourStory: {
    partner1Story: {
      name: "Kevin's Story",
      image: "/IMG_4144.jpg", // Replace with your photo
      story: `Kevin was born in Newark, NJ and was raised mostly in Belleville.
                His family consists of his family including his father (Juan Calle), his mother (Diana Calle),
                his brother (Ryan Calle), and his sister (Camila Calle)`,
    },
    partner2Story: {
      name: "Gabriela's Story",
      image: "/IMG_4146.jpg", // Replace with your photo
      story: `Gabriela was born in Newark, NJ and was rasied mostly in Newarl. Her family consists of her father (Cesar Herrera),
          her mother (Ruth Herrera), her brothers (Cesar "Jr" Herrera and Daniel Herrera), and her sister (Adriana Herrera)`,
    },  
    howWeMet: {
      enabled: true,
      title: "How We Met",
      story: `Our families' history goes back to Ecuador, where both of our fathers grew up in Cuenca.
                Since then, they both immigrated to the United States, and raised their families. It was
                through the church that their families found each other, and since as long as we can remember
                we have been in each others lives since elementary school.`,
    },
    proposal: {
      enabled: true,
      title: "The Proposal",
      story: `We got engaged in November of 2025, where we went out for a day in New York City. Back at home, friends and
          family help set up the proposal. After an amazing day of exploring the city and wrapping the day up with dinner
          there was one more suprise! Kevin proposed, and our families joined soon after to embrace and celebrate the moment.
          Since then we have been looking forward to doing life together.`,
      image: "/_DS21024_Original.jpg", // Optional proposal photo
    },
    memories: {
      intro: "A few special moments from our journey together.",
      images: [
        "/images/photo1.svg", // Replace with your photos
        "/images/photo2.svg",
        "/images/photo3.svg",
        "/images/photo4.svg",
      ],
    },
    milestones: [
      {
        date: "2020-01-15",
        title: "First Date",
        description: "Our first date at the coffee shop",
      },
      {
        date: "2021-06-20",
        title: "Moved In Together",
        description: "Started our life together",
      },
      {
        date: "2023-12-25",
        title: "Engagement",
        description: "He said yes!",
      },
    ],
    backgroundImage: "/images/homage_page_background.png",
  },

  // ============================================
  // EVENTS/RSVP PAGE
  // ============================================
  // Customize your events below
  // For Hindu weddings: See eventPresets.hindu above for common events
  // For Christian weddings: See eventPresets.christian above for common events
  // For custom weddings: Create your own event list
  events: {
    title: "Celebrate With Us",
    subtitle: "We are thrilled to have you join us for these cherished moments.",
    events: [
      {
        id: 1,
        name: "Wedding Mass",
        date: "2027-06-19",
        time: "3:00 PM",
        venue: "St. Peter's Roman Catholic Church, Belleville, NJ.",
        mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3020.967421347689!2d-74.15939902319016!3d40.78473037138279!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c255b18fcb9b8b%3A0xf757c35e25d257f7!2sSt.%20Peter's%20Roman%20Catholic%20Church!5e0!3m2!1sen!2sus!4v1790794849929!5m2!1sen!2sus",
        dressCode: "Semi-formal", // Optional
        description: "Join us for our ", // Optional
      },
      {
        id: 2,
        name: "Reception",
        date: "2027-06-19",
        time: "6:00 PM",
        venue: "Carlstadt, NJ",
        mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3018.518291226249!2d-74.08599782255672!3d40.83854327137484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2f8f0bdce229f%3A0xb2139c4ce89a991f!2sIl%20Villaggio!5e0!3m2!1sen!2sus!4v1790981825452!5m2!1sen!2sus",
        dressCode: "Traditional", // Optional
        description: "Main wedding reception", // Optional
        category: "wedding", // Optional
      },
    ],
    // Google Apps Script URL for RSVP submissions (optional)
    // If not using Google Apps Script, you can set this to your own API endpoint
    rsvpApiUrl: process.env.REACT_APP_RSVP_API_URL || "",
    accommodationOptions: [
      { value: "Morning", label: "Morning (9 AM - 12 PM)" },
      { value: "Afternoon", label: "Afternoon (12 PM - 4 PM)" },
      { value: "Evening", label: "Evening (4 PM - 8 PM)" },
      { value: "Night", label: "Night (After 8 PM)" },
    ],
    backgroundImage: "/images/homage_page_background.png",
  },

  // Photo Gallery
  photoGallery: {
    title: "Our Photo Gallery",
    subtitle: "Memories captured from our special day",
    // Show uploaded photos from Google Drive
    showUploadedPhotos: true, // Set to false to hide uploaded photos
    // Static photos (always shown if provided)
    staticPhotos: [], // Array of photo URLs
    enableFiltering: true,
    enableDownload: true,
  },

  // Blessings Page
  blessings: {
    title: "Drop Us Your Blessing",
    subtitle: "Your blessings mean the world to us. Share your thoughts, prayers, and kind words as we embark on this new journey together.",
    backgroundImage: "/images/homage_page_background.png",
    showAllBlessings: true, // Show all submitted blessings
    enableSearch: true,
    enableLikes: false, // Optional: enable like/react functionality
  },

  // Upload Photos Page
  uploadPhotos: {
    title: "Upload Your Photos",
    subtitle: "Share your favorite moments from our special day!",
    backgroundImage: "/images/homage_page_background.png",
    enableCaptions: true, // Allow users to add captions
    maxFileSize: 10, // MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp"],
  },

  // Wedding Party
  weddingParty: {
    title: "Our Wedding Party",
    subtitle: "Meet the amazing people standing with us",
    bridesmaids: [
      {
        name: "Adriana Herrera",
        role: "Maid of Honor",
        image: "/images/partner1.svg", // Replace with actual photo
        bio: "Short bio about this person",
      },
      {
        name: "Bridesmaid 2",
        role: "Bridesmaid",
        image: "/images/partner2.svg",
        bio: "Short bio about this person",
      },
    ],
    groomsmen: [
      {
        name: "Ryan Calle",
        role: "Best Man",
        image: "/images/partner1.svg", // Replace with actual photo
        bio: "Ryan, or Santi as we call him affectionately, has a five year difference with Kevin. Growing up, they both always played soccer and music together.",
      },
      {
        name: "Groomsman 2",
        role: "Groomsman",
        image: "/images/partner2.svg",
        bio: "Short bio about this person",
      },
    ],
  },

  // Registry/Gifts
  registry: {
    title: "Wedding Registry",
    subtitle: "Your presence is the greatest gift, but if you'd like to honor us with something special...",
    enableGiftTracking: true, // Enable gift reservation system
    registries: [
      {
        name: "Amazon",
        url: "https://www.amazon.com/wedding/guest-view/3ISTPJ8D94NWC",
        description: "Our Amazon registry",
      },
      //{
      //  name: "Target",
      //  url: "https://www.target.com/wedding-registry",
      //  description: "Our Target registry",
      //},
    ],
    cashFunds: [
      {
        name: "The Newlywed Fund",
        description: "Help us create unforgettable memories",
        url: "https://www.zola.com/registry/kevinandgabriela2027",
      },
    ],
    thankYouMessage: "Thank you for your generous gifts!",
  },

  // Travel & Accommodation
  travel: {
    title: "Travel & Accommodation",
    subtitle: "Everything you need to know about getting here and staying here",
    // Coordinates for weather forecast (optional)
    // Get coordinates from: https://www.latlong.net/
    coordinates: {
      lat: null, // e.g., 40.7128 for New York
      lon: null, // e.g., -74.0060 for New York
    },
    hotels: [
      {
        name: "Hotel Name",
        address: "123 Main St, City, State",
        phone: "+1 (555) 123-4567",
        website: "https://example.com/hotel",
        description: "Beautiful hotel near the venue",
        distance: "0.5 miles from venue",
        bookingCode: "WEDDING2025", // Optional booking code
      },
    ],
    transportation: {
      airport: {
        name: "City International Airport",
        code: "XYZ",
        distance: "20 miles",
        directions: "Take Highway 101 North, exit at Main Street",
      },
      parking: "Free parking available at the venue",
      shuttle: "Shuttle service available from hotel (details TBD)",
    },
    localAttractions: [
      {
        name: "Local Attraction",
        description: "Great place to visit",
        website: "https://example.com/attraction",
      },
    ],
    maps: {
      venue: "https://www.google.com/maps/embed?pb=YOUR_VENUE_MAP",
      hotels: "https://www.google.com/maps/embed?pb=YOUR_HOTELS_MAP",
    },
  },

  // FAQ
  faq: {
    title: "Frequently Asked Questions",
    subtitle: "Everything you need to know",
    questions: [
      {
        title: "What should I wear?",
        content: "Formal attire is requested. Please avoid white and blue.",
      },
      {
        title: "Can I bring a plus one?",
        content: "Your plus ones are included in the RSVP section of this website. Simply check off which plus ones you want to bring if you have the option",
      },
      {
        title: "Will there be parking?",
        content: "Yes, free parking is available at the venue.",
      },
      {
        title: "What time should I arrive?",
        content: "Please arrive 15-30 minutes before the ceremony begins.",
      },
      {
        title: "Are children welcome?",
        content: "While we love your little ones, this will be an adults-only celebration.",
      },
    ],
  },

  // Timeline
  timeline: {
    title: "Our Journey",
    subtitle: "Milestones in our relationship",
    showPlanningTimeline: true, // Show wedding planning milestones
    items: [
      //{
      //  date: "2020-01-15",
      //  title: "First Date",
      //  description: "Our first date at the coffee shop downtown",
      //  image: "/images/photo1.svg", // Optional
      //  type: "relationship", // "relationship" or "planning"
      //},
      {
        date: "2016-12-25",
        title: "Official",
        description: "We made it official!",
        type: "relationship",
      },
      {
        date: "2025-11-08",
        title: "Engagement",
        description: "She said yes! We're getting married!",
        image: "_DS21024_Original.jpg",  // Optional
        type: "relationship",
      },
    ],
    // Wedding Planning Timeline
    planningItems: [
      {
        date: "2026-02-01",
        title: "Started Planning",
        description: "Began our wedding planning journey",
        type: "planning",
      },
      {
        date: "2026-04-28",
        title: "Venue Booked",
        description: "Found and booked our dream venue",
        type: "planning",
      },
      {
        date: "2026-05-12",
        title: "Vendors Selected",
        description: "Photographer, caterer, and florist confirmed",
        type: "planning",
      },
      {
        date: "2026-10-20",
        title: "Invitations Sent",
        description: "Save the dates and invitations sent to all guests",
        type: "planning",
      },
    ],
  },

  // Footer
  footer: {
    tagline: "True love is the greatest adventure. Thank you for being a part of our journey!",
    contactEmail: "kcalle012@gmail.com", // Optional
    socialMedia: {
      instagram: "https://instagram.com/_kevincalle", // Optional
      // facebook: "https://facebook.com/yourpage", // Optional
    },
  },

  // Navigation
  navigation: {
    blessingsLabel: "Blessings",
    ourStoryLabel: "Our Story",
    eventsLabel: "Events",
    galleryLabel: "Gallery",
    uploadLabel: "Upload",
    partyLabel: "Wedding Party",
    registryLabel: "Registry",
    travelLabel: "Travel",
    faqLabel: "FAQ",
    timelineLabel: "Timeline",
  },

  // App Metadata
  app: {
    name: "Wedding Invite",
    shortName: "Wedding",
    description: "A beautiful wedding website to share your special day",
  },
};

export default siteConfig;
