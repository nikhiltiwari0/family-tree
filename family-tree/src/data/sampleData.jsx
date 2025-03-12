// src/data/sampleData.jsx
export const familyData = {
    "grandpa": {
      id: "grandpa",
      name: "John Johnson Sr.",
      dates: "1920 - 1995",
      image: "https://randomuser.me/api/portraits/men/75.jpg", // Replace with actual image URL
      bio: "A hardworking farmer who loved his family.",
      birthPlace: "Rural Town, USA",
      occupation: "Farmer",
      website: "",
      relatives: [],
      files: ["Grandpa's Photo Album.zip", "Land Deed.pdf"]
    },
    "grandma": {
      id: "grandma",
      name: "Alice Johnson Sr.",
      dates: "1922 - 2008",
      image: "https://randomuser.me/api/portraits/women/75.jpg", // Replace with actual image URL
      bio: "A loving homemaker and gardener.",
      birthPlace: "Small City, USA",
      occupation: "Homemaker",
      website: "",
      relatives: [],
      files: ["Grandma's Recipe Book.docx", "Wedding Photo.jpeg"]
    },
    "father": {
      id: "father",
      name: "John Johnson Jr.",
      dates: "1945 - Present",
      image: "https://randomuser.me/api/portraits/men/45.jpg", // Replace with actual image URL
      bio: "A retired teacher who enjoys reading and traveling.",
      birthPlace: "Same Town, USA",
      occupation: "Retired Teacher",
      website: "johnswebsite.com",
      relatives: ["grandpa", "grandma"],
      files: ["Father's Diploma.pdf", "Travel Photos 2020.zip"]
    },
    "mother": {
      id: "mother",
      name: "Mary Johnson",
      dates: "1948 - Present",
      image: "https://randomuser.me/api/portraits/women/45.jpg", // Replace with actual image URL
      bio: "A passionate artist and volunteer at the local museum.",
      birthPlace: "Another City, USA",
      occupation: "Artist & Volunteer",
      website: "marysart.com",
      relatives: ["grandpa", "grandma"],
      files: ["Art Portfolio.pdf", "Volunteer Certificate.pdf"]
    },
    "brother": {
      id: "brother",
      name: "Robert Johnson",
      dates: "1970 - Present",
      image: "https://randomuser.me/api/portraits/men/35.jpg", // Replace with actual image URL
      bio: "A software engineer and avid hiker.",
      birthPlace: "City, USA",
      occupation: "Software Engineer",
      website: "robertsdev.com",
      relatives: ["father", "mother"],
      files: ["Project Documentation.docx", "Hiking Photos.zip"]
    },
    "user": {
      id: "user",
      name: "You (Lisa Johnson)",
      dates: "1975 - Present",
      image: "https://randomuser.me/api/portraits/women/35.jpg", // Replace with your image URL
      bio: "That's you! Edit your details to personalize your family tree.",
      birthPlace: "Current City, USA",
      occupation: "Your Occupation",
      website: "yourwebsite.com",
      relatives: ["father", "mother"],
      files: ["Personal Documents.zip", "Favorite Recipes.docx"]
    }
  };