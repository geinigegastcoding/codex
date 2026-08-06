import onlinePalettes from './onlinePalettes.json';

export const generatePalettes = () => {
  if (onlinePalettes && onlinePalettes.length > 0) {
    // Copy the array to avoid mutating the original import
    const palettes = [...onlinePalettes];
    
    // Shuffle the array to make the Tinder experience randomized
    for (let i = palettes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [palettes[i], palettes[j]] = [palettes[j], palettes[i]];
    }
    return palettes;
  }
  
  // Fallback in case JSON is empty
  return [
    { id: 1, name: "Fallback Palette", colors: ["#F94144", "#F3722C", "#F8961E", "#F9C74F", "#90BE6D"] }
  ];
};
