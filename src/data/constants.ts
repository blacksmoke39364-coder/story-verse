import { ArtStyle, ImageSizeOption, LanguageOption, StoryTheme } from '../types';

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ' },
  { code: 'ml', label: 'Malayalam', nativeLabel: 'മലയാളം' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी' },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা' },
  { code: 'gu', label: 'Gujarati', nativeLabel: 'ગુજરાતી' },
  { code: 'pa', label: 'Punjabi', nativeLabel: 'ਪੰਜਾਬੀ' },
];

export const THEMES: { id: StoryTheme; label: string; icon: string; description: string; samplePrompt: string }[] = [
  { id: 'Space', label: 'Space & Stars', icon: '🚀', description: 'Cosmic rockets, starry constellations, gentle alien friends', samplePrompt: 'A rocket that visits a friendly constellation of sleeping stars' },
  { id: 'Dinosaurs', label: 'Gentle Dinosaurs', icon: '🦕', description: 'Friendly herbivores, cozy prehistoric jungles, fruit picnics', samplePrompt: 'A baby dinosaur who finds the sweetest mango in the jungle' },
  { id: 'Animals', label: 'Forest Animals', icon: '🦊', description: 'Curious foxes, wise owls, playful squirrels and bunnies', samplePrompt: 'A woodland tea party hosted by a clever little hedgehog' },
  { id: 'Fantasy', label: 'Enchanted Realm', icon: '✨', description: 'Magic gardens, talking trees, shimmering pixie dust', samplePrompt: 'A secret key that unlocks a garden where flowers sing bedtime songs' },
  { id: 'Adventure', label: 'Island Adventure', icon: '🧭', description: 'Treasure maps, crystal caves, brave bridges', samplePrompt: 'A sailboat made of leaves looking for the Island of Gentle Smiles' },
  { id: 'Science', label: 'Curious Science', icon: '🔬', description: 'Helpful robots, flying inventions, microscope wonders', samplePrompt: 'A tiny solar-powered robot helping baby honeybees find flowers' },
  { id: 'Friendship', label: 'Warm Friendship', icon: '🤝', description: 'Sharing toys, empathy, team adventures, helping hands', samplePrompt: 'Two friends build a cozy treehouse for all their stuffed toys' },
  { id: 'School', label: 'School & Playground', icon: '🎒', description: 'First day joy, fun art class, playground games', samplePrompt: 'A magical colored pencil that draws real butterflies on the chalkboard' },
  { id: 'Mystery', label: 'Gentle Mystery', icon: '🔍', description: 'Missing stuffed toys, cozy footprints, riddle boxes', samplePrompt: 'Who left tiny blue sparkles on the kitchen cookie jar?' },
  { id: 'Nature', label: 'Nature & Oceans', icon: '🌿', description: 'Glowing coral reefs, whispering rainforests, mountain trails', samplePrompt: 'A little sea turtle following the moonbeams to the calm bay' },
  { id: 'Indian culture', label: 'Indian Heritage', icon: '🪔', description: 'Diwali lanterns, monsoon peacocks, royal palaces, folk tales', samplePrompt: 'A baby elephant celebrating the festival of lights with magical golden diyas' },
  { id: 'Custom', label: 'Custom Magic', icon: '🎨', description: 'Child’s own dream, voice idea, or bedtime wish', samplePrompt: 'A story about my bedtime puppy who flies with marshmallow wings' },
];

export const ART_STYLES: { id: ArtStyle; label: string; preview: string; description: string }[] = [
  { id: 'storybook', label: 'Classic Picture Book', preview: '📖', description: 'Soft textured, storybook warmth with nostalgic gentle linework' },
  { id: 'watercolor', label: 'Dreamy Watercolor', preview: '🎨', description: 'Ethereal washes of lavender, amber, and serene starry tints' },
  { id: '3D animated', label: '3D Animated Film', preview: '🎬', description: 'Vibrant rounded characters with Pixar-like lighting and expressiveness' },
  { id: 'magical fantasy', label: 'Enchanted Fantasy', preview: '✨', description: 'Luminescent glades, glowing starlight, and jewel-toned skies' },
  { id: 'cartoon', label: 'Playful Cartoon', preview: '🧸', description: 'Bold cheerful shapes, friendly faces, and joyful colors' },
  { id: 'soft illustration', label: 'Soft Bedtime Glow', preview: '🌙', description: 'Muted pastel tones designed to relax the eyes before sleep' },
  { id: 'educational illustration', label: 'Illustrated Science', preview: '🌱', description: 'Clear, engaging diagrams and charming nature details' },
];

export const IMAGE_SIZES: { id: ImageSizeOption; label: string; badge: string; description: string }[] = [
  { id: '1K', label: '1K Standard', badge: 'Fastest', description: '1024×1024 crisp resolution, ideal for instant story page generation' },
  { id: '2K', label: '2K High Definition', badge: 'Recommended', description: '2048×2048 high fidelity with enhanced brush textures' },
  { id: '4K', label: '4K Ultra Premium', badge: 'Studio', description: '4096×4096 gallery grade rendering using gemini-3-pro-image' },
];

export const CHARACTER_AVATARS = [
  { emoji: '🚀', label: 'Astronaut' },
  { emoji: '🦊', label: 'Clever Fox' },
  { emoji: '🦕', label: 'Gentle Dino' },
  { emoji: '🦁', label: 'Brave Cub' },
  { emoji: '🤖', label: 'Friendly Bot' },
  { emoji: '🦉', label: 'Moon Owl' },
  { emoji: '🦄', label: 'Starlight Unicorn' },
  { emoji: '🐢', label: 'Wise Turtle' },
];
