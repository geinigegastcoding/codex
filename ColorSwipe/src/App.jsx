import React, { useState } from 'react';
import { generatePalettes } from './components/PaletteGenerator';
import SwipeCard from './components/SwipeCard';
import FavoritesList from './components/FavoritesList';
import { Heart, X, Palette, List } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const ALL_PALETTES = generatePalettes();

function App() {
  const [palettes, setPalettes] = useState(ALL_PALETTES);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [swipeDir, setSwipeDir] = useState(null); // 'left', 'right', or null

  const handleSwipe = (direction) => {
    if (palettes.length === 0) return;
    
    const currentPalette = palettes[palettes.length - 1];
    
    if (direction === 'right') {
      setFavorites([...favorites, currentPalette]);
    }
    
    // Remove the swiped palette from the stack
    setTimeout(() => {
      setPalettes((prev) => prev.slice(0, -1));
      setSwipeDir(null);
    }, 200); // small delay to allow animation to finish
  };

  const handleRemoveFavorite = (id) => {
    setFavorites(favorites.filter(p => p.id !== id));
  };

  const currentBgColor = swipeDir === 'right' 
    ? '#1a3a29' 
    : swipeDir === 'left' 
      ? '#3a1a1a' 
      : '#121212';

  return (
    <div className="app-container" style={{ backgroundColor: currentBgColor }}>
      <header className="app-header">
        <div className="logo" onClick={() => setShowFavorites(false)}>
          <Palette className="logo-icon" size={28} />
          <h1>PaletteMatch</h1>
        </div>
        <button 
          className={`nav-btn ${showFavorites ? 'active' : ''}`}
          onClick={() => setShowFavorites(!showFavorites)}
        >
          <List size={24} />
          <span className="badge">{favorites.length}</span>
        </button>
      </header>

      <main className="main-content">
        {showFavorites ? (
          <div className="favorites-view">
            <h2>Saved Palettes</h2>
            <FavoritesList favorites={favorites} onRemove={handleRemoveFavorite} />
          </div>
        ) : (
          <div className="swipe-view">
            {palettes.length === 0 ? (
              <div className="no-more-palettes">
                <h2>No more palettes!</h2>
                <p>Check out your saved favorites or reload to start over.</p>
                <button className="primary-btn" onClick={() => setPalettes(generatePalettes())}>
                  Reload Palettes
                </button>
              </div>
            ) : (
              <div className="cards-stack">
                <AnimatePresence>
                  {palettes.map((palette, index) => {
                    const isActive = index === palettes.length - 1;
                    // Only render top 2 cards for performance and visual stacking
                    if (index < palettes.length - 2) return null;
                    
                    return (
                      <SwipeCard 
                        key={palette.id}
                        palette={palette}
                        active={isActive}
                        onSwipe={handleSwipe}
                        setSwipeDir={setSwipeDir}
                      />
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
            
            {palettes.length > 0 && (
              <div className="action-buttons">
                <button className="action-btn nope-btn" onClick={() => handleSwipe('left')}>
                  <X size={32} />
                </button>
                <button className="action-btn like-btn" onClick={() => handleSwipe('right')}>
                  <Heart size={32} />
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
