export interface Painting {
  id: string;
  title: string;
  year: number;
  medium: "Oil" | "Watercolor" | "Acrylic" | "Mixed Media";
  size: string;
  price: number;
  available: boolean;
  imageUrl: string;
  description: string;
  collection?: string;
}

export const paintings: Painting[] = [
  {
    id: "1",
    title: "Silent Horizon",
    year: 2023,
    medium: "Oil",
    size: "36 × 48 in",
    price: 4500,
    available: true,
    imageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80",
    description: "An exploration of memory and landscape. The deep umber tones rise to meet a muted sky, capturing the precise moment before dusk settles.",
    collection: "Earth & Sky"
  },
  {
    id: "2",
    title: "Whispering Reeds",
    year: 2022,
    medium: "Watercolor",
    size: "18 × 24 in",
    price: 1200,
    available: false,
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=80",
    description: "Delicate washes of sage and gold bleed into one another, suggesting movement and the quiet rustle of wetland flora.",
    collection: "Flora"
  },
  {
    id: "3",
    title: "Urban Fracture",
    year: 2024,
    medium: "Acrylic",
    size: "48 × 60 in",
    price: 6500,
    available: true,
    imageUrl: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&w=800&q=80",
    description: "Bold, structural forms collide in this large-scale acrylic. A meditation on the geometry of modern living spaces.",
    collection: "Structures"
  },
  {
    id: "4",
    title: "Earthen Vessel",
    year: 2023,
    medium: "Mixed Media",
    size: "24 × 24 in",
    price: 2800,
    available: true,
    imageUrl: "https://images.unsplash.com/photo-1578926288588-72b2207b1bd1?auto=format&fit=crop&w=800&q=80",
    description: "Texture plays the lead role here, with layers of sand and pigment building a surface that feels excavated rather than painted.",
    collection: "Tactile"
  },
  {
    id: "5",
    title: "The Long Wait",
    year: 2021,
    medium: "Oil",
    size: "30 × 40 in",
    price: 3800,
    available: false,
    imageUrl: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&w=800&q=80",
    description: "Figures dissolve into the background, a moody and atmospheric piece reflecting on the passage of time.",
    collection: "Figures in Space"
  },
  {
    id: "6",
    title: "Morning Light, Interior",
    year: 2024,
    medium: "Oil",
    size: "20 × 24 in",
    price: 2200,
    available: true,
    imageUrl: "https://images.unsplash.com/photo-1580136579312-94651dfd596d?auto=format&fit=crop&w=800&q=80",
    description: "A study of how morning light catches the dust motes and softens the hard edges of a room. Warm, intimate, and still.",
    collection: "Interiors"
  },
  {
    id: "7",
    title: "Currents",
    year: 2022,
    medium: "Acrylic",
    size: "36 × 36 in",
    price: 3200,
    available: true,
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
    description: "Fluid and dynamic. The brushstrokes mimic the pull of the tide, creating a mesmerizing rhythm of color and form.",
    collection: "Water"
  },
  {
    id: "8",
    title: "Autumn Fragment",
    year: 2023,
    medium: "Watercolor",
    size: "12 × 16 in",
    price: 800,
    available: false,
    imageUrl: "https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?auto=format&fit=crop&w=800&q=80",
    description: "A spontaneous capture of autumn foliage. Quick, confident marks let the white of the paper breathe through the pigments."
  },
  {
    id: "9",
    title: "Monolith I",
    year: 2024,
    medium: "Mixed Media",
    size: "40 × 40 in",
    price: 5000,
    available: true,
    imageUrl: "https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&w=800&q=80",
    description: "Imposing and austere, this piece commands the room. The use of charcoal and heavy body acrylic creates a stark, powerful presence.",
    collection: "Structures"
  },
  {
    id: "10",
    title: "Fading Ember",
    year: 2023,
    medium: "Oil",
    size: "24 × 36 in",
    price: 3400,
    available: true,
    imageUrl: "https://images.unsplash.com/photo-1516796181074-bf453fbfa3e6?auto=format&fit=crop&w=800&q=80",
    description: "Rich terracotta and burnt sienna dominate the canvas, glowing with an inner warmth that seems to shift as the light changes in the room."
  },
  {
    id: "11",
    title: "Winter's Edge",
    year: 2021,
    medium: "Acrylic",
    size: "30 × 30 in",
    price: 2600,
    available: false,
    imageUrl: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=800&q=80",
    description: "Cooler tones intrude upon the warmth. A transitional piece that balances the crispness of frost with the lingering heat of the earth."
  },
  {
    id: "12",
    title: "Tapestry",
    year: 2024,
    medium: "Oil",
    size: "48 × 72 in",
    price: 8000,
    available: true,
    imageUrl: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=800&q=80",
    description: "A monumental work. The complex interplay of colors and textures requires long looking, revealing new secrets to the patient observer.",
    collection: "Masterworks"
  }
];
