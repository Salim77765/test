const sampleListings = [
  {
    title: "Premium Basmati Rice Fields in Punjab",
    description: "Explore our premium Basmati rice fields in Punjab, where the finest grains are cultivated with care using sustainable practices.",
    image: {
      filename: "cropimage1",
      url: "https://images.unsplash.com/photo-1590490376785-90b7f75d5a26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmljZSUyMGZpZWxkc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
    },
    price: 2500,
    location: "Punjab, India",
    country: "India",
    geometry: {
      coordinates: [75.341217, 31.147130],
      type: "Point"
    },
    category: "Rice"
  },
  {
    title: "Organic Tea Plantations in Assam",
    description: "Discover the lush organic tea plantations in Assam, renowned for producing the finest tea leaves in the world.",
    image: {
      filename: "cropimage2",
      url: "https://images.unsplash.com/photo-1576670574131-0f1d6ed876f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGVhJTIwcGxhbnRhdGlvbnN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
    },
    price: 3200,
    location: "Assam, India",
    country: "India",
    geometry: {
      coordinates: [92.937573, 26.200604],
      type: "Point"
    },
    category: "Plantations"
  },
  {
    title: "Saffron Fields in Kashmir",
    description: "Visit the vibrant saffron fields of Kashmir, where the world's most precious spice is carefully harvested.",
    image: {
      filename: "cropimage3",
      url: "https://images.unsplash.com/photo-1584950009381-4a50bfa6a1f2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c2FmZnJvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
    },
    price: 5000,
    location: "Kashmir, India",
    country: "India",
    geometry: {
      coordinates: [74.797282, 34.083656],
      type: "Point"
    },
    category: "Cash-Crops"
  },
  {
    title: "Wheat Farms in Haryana",
    description: "Explore the vast wheat farms in Haryana, a key region contributing to India's food security with high-quality wheat production.",
    image: {
      filename: "cropimage4",
      url: "https://images.unsplash.com/photo-1603714244584-06c3d8f32fd4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d2hlYXQlMjBmYXJtfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
    },
    price: 1800,
    location: "Haryana, India",
    country: "India",
    geometry: {
      coordinates: [76.793488, 29.058775],
      type: "Point"
    },
    category: "Wheat"
  },
  {
    title: "Coconut Groves in Kerala",
    description: "Experience the lush coconut groves of Kerala, where coconuts are grown in abundance, supporting the local economy.",
    image: {
      filename: "cropimage5",
      url: "https://images.unsplash.com/photo-1593283788297-04c909529a4d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y29jb251dCUyMGdyb3ZlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
    },
    price: 2200,
    location: "Kerala, India",
    country: "India",
    geometry: {
      coordinates: [76.271083, 10.850516],
      type: "Point"
    },
    category: "Plantations"
  },  
];

module.exports = { data: sampleListings };
