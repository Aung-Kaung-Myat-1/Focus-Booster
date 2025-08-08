import React, { useState, useEffect, useRef } from 'react';
import './AmbientSoundPlayer.css';

const AmbientSoundPlayer = ({ onThemeChange }) => {
  const [currentSound, setCurrentSound] = useState('forest');
  const [availableSounds, setAvailableSounds] = useState([]);
  const audioRef = useRef(null);

  // Theme color palettes for different ambient sounds
  const themePalettes = {
    // Main 5 themes
    forest: {
      primary: '#392118',      // Ancient Grove (dark brown)
      secondary: '#663B2A',    // Canyon Rust (reddish-brown)
      accent: '#6D6941',       // Fernwood (muted olive green)
      background: '#F7F3E8',   // Very light beige
      text: '#392118',         // Ancient Grove (dark brown text)
      card: 'rgba(247, 243, 232, 0.9)'  // Very light beige card background
    },
    ocean: {
      primary: '#004D5C',      // Deep teal (darkest)
      secondary: '#1B8A9A',    // Turquoise blue
      accent: '#4FB3C5',       // Light turquoise
      background: '#F8FEFF',   // Very light cyan
      text: '#004D5C',         // Deep teal text
      card: '#F0FDFF'          // Light cyan card
    },
    rain: {
      primary: '#1A2B3D',      // Dark stormy blue-grey
      secondary: '#2F4F6F',    // Slate grey-blue
      accent: '#5F7A8A',       // Misty blue-grey
      background: '#FAFBFC',   // Very light blue-grey
      text: '#1A2B3D',         // Dark stormy blue-grey text
      card: '#F5F7FA'          // Light cloudy grey
    },
    office: {
      primary: '#270202',      // Root Beer (very dark red-brown)
      secondary: '#650207',    // Rosewood (dark red-brown)
      accent: '#8E020A',       // Sangria (medium red)
      background: '#FEFCFC',   // Very light pink-red
      text: '#270202',         // Root Beer (dark red-brown text)
      card: '#FDF0F0'          // Very light pink-red card
    },
    cafe: {
      primary: '#3D1F12',      // Espresso (very dark brown)
      secondary: '#4A2F24',    // Coffee Brown (dark brown)
      accent: '#84634A',       // Chestnut (medium brown)
      background: '#FEFCF8',   // Very light cream
      text: '#3D1F12',         // Espresso (dark brown text)
      card: '#F8F4F0'          // Very light cream card
    },
    
    // Additional unique themes
    campfire: {
      primary: '#8B4513',      // Saddle brown (firewood)
      secondary: '#D2691E',    // Chocolate (embers)
      accent: '#CD853F',       // Peru (warm glow)
      background: '#FFF8DC',   // Cornsilk (firelight)
      text: '#8B4513',         // Saddle brown text
      card: '#FFEFD5'          // Papaya whip card
    },
    waterfall: {
      primary: '#006994',      // Steel blue (deep water)
      secondary: '#4682B4',    // Steel blue (medium)
      accent: '#87CEEB',       // Sky blue (spray)
      background: '#F0F8FF',   // Alice blue (mist)
      text: '#006994',         // Steel blue text
      card: '#E6F3FF'          // Light blue card
    },
    river: {
      primary: '#2F4F4F',      // Dark slate grey (riverbed)
      secondary: '#556B2F',    // Dark olive green (algae)
      accent: '#20B2AA',       // Light sea green (flowing water)
      background: '#F5FFFA',   // Mint cream (river mist)
      text: '#2F4F4F',         // Dark slate grey text
      card: '#F0FFF0'          // Honeydew card
    },
    jungle: {
      primary: '#2E8B57',      // Sea green (jungle canopy)
      secondary: '#3CB371',    // Medium sea green (vines)
      accent: '#66CDAA',       // Medium aquamarine (leaves)
      background: '#F0FFF0',   // Honeydew (jungle air)
      text: '#2E8B57',         // Sea green text
      card: '#F5FFFA'          // Mint cream card
    },
    leaves: {
      primary: '#6B8E23',      // Olive drab (fallen leaves)
      secondary: '#9ACD32',    // Yellow green (leaf pile)
      accent: '#BDB76B',       // Dark khaki (fresh leaves)
      background: '#F5F5DC',   // Beige (forest floor)
      text: '#6B8E23',         // Olive drab text
      card: '#F0F0E6'          // Light beige card
    },
    wind: {
      primary: '#4A5568',      // Darker grey (wind clouds)
      secondary: '#718096',    // Medium grey (breeze)
      accent: '#A0AEC0',       // Light grey (gentle wind)
      background: '#F7FAFC',   // Very light grey (sky)
      text: '#1A202C',         // Very dark grey text (highly visible)
      card: '#EDF2F7'          // Light grey card
    },
    'howling-wind': {
      primary: '#2F4F4F',      // Dark slate grey (storm clouds)
      secondary: '#4A4A4A',    // Dark grey (strong wind)
      accent: '#708090',       // Slate grey (wind gusts)
      background: '#F8F8FF',   // Ghost white (stormy sky)
      text: '#2F4F4F',         // Dark slate grey text
      card: '#F0F0F5'          // Light grey card
    },
    'walk-in-snow': {
      primary: '#1E3A8A',      // Deep blue (frozen lake)
      secondary: '#3B82F6',    // Bright blue (ice crystals)
      accent: '#60A5FA',       // Light blue (snow sparkles)
      background: '#EFF6FF',   // Very light blue (winter sky)
      text: '#1E40AF',         // Dark blue text (crystal clear)
      card: '#DBEAFE'          // Light blue card (frosted glass)
    },
    airport: {
      primary: '#4169E1',      // Royal blue (sky)
      secondary: '#87CEEB',    // Sky blue (clouds)
      accent: '#B0E0E6',       // Powder blue (terminal)
      background: '#F0F8FF',   // Alice blue (clean air)
      text: '#4169E1',         // Royal blue text
      card: '#E6F3FF'          // Light blue card
    },
    subway: {
      primary: '#696969',      // Dim grey (concrete)
      secondary: '#A9A9A9',    // Dark grey (steel)
      accent: '#C0C0C0',       // Silver (metal)
      background: '#F5F5F5',   // White smoke (underground)
      text: '#696969',         // Dim grey text
      card: '#F0F0F0'          // Light grey card
    },
    temple: {
      primary: '#CD853F',      // Peru (ancient stone)
      secondary: '#DEB887',    // Burlywood (wooden beams)
      accent: '#D2B48C',       // Tan (incense)
      background: '#FDF5E6',   // Old lace (sacred light)
      text: '#CD853F',         // Peru text
      card: '#FAF0E6'          // Linen card
    },
    'night-village': {
      primary: '#2F4F4F',      // Dark slate grey (night)
      secondary: '#4A4A4A',    // Dark grey (shadows)
      accent: '#708090',       // Slate grey (moonlight)
      background: '#F8F8FF',   // Ghost white (night air)
      text: '#2F4F4F',         // Dark slate grey text
      card: '#F0F0F5'          // Light grey card
    },
    laboratory: {
      primary: '#2F4F4F',      // Dark slate grey (equipment)
      secondary: '#708090',    // Slate grey (steel)
      accent: '#B0C4DE',       // Light steel blue (clean surfaces)
      background: '#F8F8FF',   // Ghost white (sterile)
      text: '#2F4F4F',         // Dark slate grey text
      card: '#F0F0F5'          // Light grey card
    },
    'laundry-room': {
      primary: '#4682B4',      // Steel blue (machines)
      secondary: '#87CEEB',    // Sky blue (soap)
      accent: '#B0E0E6',       // Powder blue (clean)
      background: '#F0F8FF',   // Alice blue (fresh)
      text: '#4682B4',         // Steel blue text
      card: '#E6F3FF'          // Light blue card
    },
    'construction-site': {
      primary: '#8B4513',      // Saddle brown (wood)
      secondary: '#CD853F',    // Peru (dirt)
      accent: '#DAA520',       // Goldenrod (safety vests)
      background: '#FFF8DC',   // Cornsilk (dust)
      text: '#8B4513',         // Saddle brown text
      card: '#FFEFD5'          // Papaya whip card
    },
    'crowded-bar': {
      primary: '#8B0000',      // Dark red (dim lighting)
      secondary: '#B22222',    // Fire brick (warm glow)
      accent: '#DC143C',       // Crimson (energy)
      background: '#FFF0F5',   // Lavender blush (atmosphere)
      text: '#8B0000',         // Dark red text
      card: '#FFE4E1'          // Misty rose card
    },
    carousel: {
      primary: '#FF69B4',      // Hot pink (fun)
      secondary: '#FFB6C1',    // Light pink (joy)
      accent: '#FFC0CB',       // Pink (playful)
      background: '#FFF0F5',   // Lavender blush (magical)
      text: '#FF69B4',         // Hot pink text
      card: '#FFE4E1'          // Misty rose card
    },
    supermarket: {
      primary: '#32CD32',      // Lime green (fresh produce)
      secondary: '#90EE90',    // Light green (clean)
      accent: '#98FB98',       // Pale green (bright)
      background: '#F0FFF0',   // Honeydew (sterile)
      text: '#32CD32',         // Lime green text
      card: '#F5FFFA'          // Mint cream card
    },
    subway: {
      primary: '#696969',      // Dim grey (concrete)
      secondary: '#A9A9A9',    // Dark grey (steel)
      accent: '#C0C0C0',       // Silver (metal)
      background: '#F5F5F5',   // White smoke (underground)
      text: '#696969',         // Dim grey text
      card: '#F0F0F0'          // Light grey card
    },
    temple: {
      primary: '#CD853F',      // Peru (ancient stone)
      secondary: '#DEB887',    // Burlywood (wooden beams)
      accent: '#D2B48C',       // Tan (incense)
      background: '#FDF5E6',   // Old lace (sacred light)
      text: '#CD853F',         // Peru text
      card: '#FAF0E6'          // Linen card
    },
    underwater: {
      primary: '#191970',      // Midnight blue (deep ocean)
      secondary: '#4169E1',    // Royal blue (water)
      accent: '#87CEEB',       // Sky blue (light rays)
      background: '#E0F6FF',   // Very light cyan (underwater glow)
      text: '#191970',         // Midnight blue text
      card: '#D4F1F4'          // Light cyan card
    },
    'night-village': {
      primary: '#2F4F4F',      // Dark slate grey (night)
      secondary: '#4A4A4A',    // Dark grey (shadows)
      accent: '#708090',       // Slate grey (moonlight)
      background: '#F8F8FF',   // Ghost white (night air)
      text: '#2F4F4F',         // Dark slate grey text
      card: '#F0F0F5'          // Light grey card
    },
    laboratory: {
      primary: '#2F4F4F',      // Dark slate grey (equipment)
      secondary: '#708090',    // Slate grey (steel)
      accent: '#B0C4DE',       // Light steel blue (clean surfaces)
      background: '#F8F8FF',   // Ghost white (sterile)
      text: '#2F4F4F',         // Dark slate grey text
      card: '#F0F0F5'          // Light grey card
    },
    'laundry-room': {
      primary: '#4682B4',      // Steel blue (machines)
      secondary: '#87CEEB',    // Sky blue (soap)
      accent: '#B0E0E6',       // Powder blue (clean)
      background: '#F0F8FF',   // Alice blue (fresh)
      text: '#4682B4',         // Steel blue text
      card: '#E6F3FF'          // Light blue card
    },
    'construction-site': {
      primary: '#8B4513',      // Saddle brown (wood)
      secondary: '#CD853F',    // Peru (dirt)
      accent: '#DAA520',       // Goldenrod (safety vests)
      background: '#FFF8DC',   // Cornsilk (dust)
      text: '#8B4513',         // Saddle brown text
      card: '#FFEFD5'          // Papaya whip card
    },
    'crowded-bar': {
      primary: '#8B0000',      // Dark red (dim lighting)
      secondary: '#B22222',    // Fire brick (warm glow)
      accent: '#DC143C',       // Crimson (energy)
      background: '#FFF0F5',   // Lavender blush (atmosphere)
      text: '#8B0000',         // Dark red text
      card: '#FFE4E1'          // Misty rose card
    },
    carousel: {
      primary: '#FF69B4',      // Hot pink (fun)
      secondary: '#FFB6C1',    // Light pink (joy)
      accent: '#FFC0CB',       // Pink (playful)
      background: '#FFF0F5',   // Lavender blush (magical)
      text: '#FF69B4',         // Hot pink text
      card: '#FFE4E1'          // Misty rose card
    },
    supermarket: {
      primary: '#32CD32',      // Lime green (fresh produce)
      secondary: '#90EE90',    // Light green (clean)
      accent: '#98FB98',       // Pale green (bright)
      background: '#F0FFF0',   // Honeydew (sterile)
      text: '#32CD32',         // Lime green text
      card: '#F5FFFA'          // Mint cream card
    }
  };

  // All ambient sounds with actual sound files
  const allAmbientSounds = [
    // WORKING SOUNDS (Perfect Audio) - These appear first
    { id: 'ocean', name: 'Azure Dreams', url: '/sounds/ocean.mp3', category: 'nature' },
    { id: 'rain', name: 'Silver Drops', url: '/sounds/rain.mp3', category: 'nature' },
    
    // Additional sounds using working audio files
    { id: 'underwater', name: 'Abyssal Whispers', url: '/sounds/ocean.mp3', category: 'nature' },
    { id: 'waterfall', name: 'Crystal Falls', url: '/sounds/ocean.mp3', category: 'nature' },
    { id: 'river', name: 'Emerald Flow', url: '/sounds/ocean.mp3', category: 'nature' },
    
    // Other sounds (may have audio issues but themes work)
    { id: 'forest', name: 'Mystic Grove', url: '/sounds/forest.mp3', category: 'nature' },
    { id: 'campfire', name: 'Golden Embers', url: '/sounds/campfire.mp3', category: 'nature' },
    { id: 'jungle', name: 'Verdant Realm', url: '/sounds/jungle.mp3', category: 'nature' },
    { id: 'leaves', name: 'Amber Path', url: '/sounds/leaves.mp3', category: 'nature' },
    { id: 'office', name: 'Neon Hive', url: '/sounds/office.mp3', category: 'places' },
    { id: 'cafe', name: 'Velvet Brew', url: '/sounds/cafe.mp3', category: 'places' },
    { id: 'wind', name: 'Zephyr Song', url: '/sounds/forest.mp3', category: 'nature' },
    { id: 'howling-wind', name: 'Thunder Breath', url: '/sounds/forest.mp3', category: 'nature' },
    { id: 'walk-in-snow', name: 'Frost Whisper', url: '/sounds/leaves.mp3', category: 'nature' },
    { id: 'airport', name: 'Sky Port', url: '/sounds/office.mp3', category: 'places' },
    { id: 'subway', name: 'Metro Pulse', url: '/sounds/office.mp3', category: 'places' },
    { id: 'temple', name: 'Ethereal Sanctum', url: '/sounds/office.mp3', category: 'places' },
    { id: 'night-village', name: 'Shadow Market', url: '/sounds/forest.mp3', category: 'places' },
    { id: 'laboratory', name: 'Quantum Lab', url: '/sounds/office.mp3', category: 'places' },
    { id: 'laundry-room', name: 'Steam Chamber', url: '/sounds/office.mp3', category: 'places' },
    { id: 'construction-site', name: 'Iron Forge', url: '/sounds/office.mp3', category: 'places' },
    { id: 'crowded-bar', name: 'Neon Nights', url: '/sounds/cafe.mp3', category: 'places' },
    { id: 'carousel', name: 'Dream Spinner', url: '/sounds/office.mp3', category: 'places' },
    { id: 'supermarket', name: 'Crystal Market', url: '/sounds/office.mp3', category: 'places' }
  ];

  // All themes directly selectable
  const prominentSounds = allAmbientSounds;

  // Load available sounds
  useEffect(() => {
    setAvailableSounds(prominentSounds);
    
    // Load saved sound preference
    const savedSound = localStorage.getItem('focus-booster-sound');
    if (savedSound) setCurrentSound(savedSound);
  }, []);

  // Save sound preference to localStorage
  useEffect(() => {
    localStorage.setItem('focus-booster-sound', currentSound);
  }, [currentSound]);

  const handleSoundChange = (soundId) => {
    setCurrentSound(soundId);
    localStorage.setItem('focus-booster-sound', soundId);
    
    // Trigger theme change
    if (onThemeChange && themePalettes[soundId]) {
      onThemeChange(themePalettes[soundId]);
    }
  };





  return (
    <div className="theme-selector">
      <div className="ambient-header">
        <h3>Select a Theme</h3>
      </div>
      
      <div className="sound-controls">
        <div className="sound-selector">
          {prominentSounds.map((sound) => (
            <button
              key={sound.id}
              className={`sound-option ${currentSound === sound.id ? 'selected' : ''}`}
              onClick={() => handleSoundChange(sound.id)}
            >
              {sound.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AmbientSoundPlayer; 