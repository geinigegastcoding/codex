const fs = require('fs');

async function fetchOnlinePalettes() {
  try {
    console.log('Fetching palettes from nice-color-palettes...');
    const response = await fetch('https://raw.githubusercontent.com/Jam3/nice-color-palettes/master/1000.json');
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform to our format
    // data is an array of arrays of 5 hex codes
    const palettes = data.slice(0, 500).map((colors, index) => {
      return {
        id: index + 1,
        name: `Palette #${index + 1}`,
        colors: colors
      };
    });
    
    fs.writeFileSync('./src/components/onlinePalettes.json', JSON.stringify(palettes, null, 2));
    console.log('Successfully saved to src/components/onlinePalettes.json');
  } catch (error) {
    console.error('Error fetching palettes:', error);
    fs.writeFileSync('./src/components/onlinePalettes.json', JSON.stringify([], null, 2));
  }
}

fetchOnlinePalettes();
