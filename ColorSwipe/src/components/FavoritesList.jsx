import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const FavoritesList = ({ favorites, onRemove }) => {
  const [copiedColor, setCopiedColor] = useState(null);

  const copyToClipboard = (color) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  if (favorites.length === 0) {
    return (
      <div className="favorites-empty">
        <p>You haven't saved any palettes yet.</p>
        <p>Swipe right to save your favorites!</p>
      </div>
    );
  }

  return (
    <div className="favorites-list">
      {favorites.map((palette) => (
        <div key={palette.id} className="favorite-item">
          <div className="favorite-header">
            <h3>{palette.name}</h3>
            <button className="remove-btn" onClick={() => onRemove(palette.id)}>Remove</button>
          </div>
          <div className="favorite-colors">
            {palette.colors.map((color, index) => (
              <div 
                key={index} 
                className="fav-color-block" 
                style={{ backgroundColor: color }}
                onClick={() => copyToClipboard(color)}
                title="Click to copy"
              >
                {copiedColor === color ? (
                  <span className="copy-icon"><Check size={16} /></span>
                ) : (
                  <span className="copy-icon"><Copy size={16} /></span>
                )}
                <span className="fav-hex">{color}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FavoritesList;
