import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Zap, Layers, BarChart, ArrowRight } from 'lucide-react';

const WebsitePreview = ({ colors }) => {
  // Try to map colors effectively to UI parts.
  const [bg, primary, secondary, accent, text] = colors;
  
  return (
    <div className="website-preview-container">
      <div className="mockup-browser">
        <div className="mockup-header" style={{ backgroundColor: primary, color: bg }}>
          <div className="mockup-logo">
            <Layers size={14} /> <span>AcmeCorp</span>
          </div>
          <div className="mockup-nav">
            <span>Features</span>
            <span>Pricing</span>
            <span>About</span>
          </div>
        </div>
        
        <div className="mockup-body" style={{ backgroundColor: bg }}>
          <div className="mockup-hero">
            <h1 style={{ color: text }}>Build the Future</h1>
            <p style={{ color: text, opacity: 0.8 }}>The best platform for your next big idea.</p>
            <div className="mockup-btn" style={{ backgroundColor: accent, color: bg }}>
              Get Started <ArrowRight size={12} />
            </div>
          </div>
          
          <div className="mockup-features">
            <div className="mockup-card" style={{ backgroundColor: secondary, color: text }}>
               <Zap size={16} style={{ color: accent, marginBottom: '4px' }} />
               <h4>Fast Setup</h4>
               <p style={{ opacity: 0.7 }}>Deploy instantly.</p>
            </div>
            <div className="mockup-card" style={{ backgroundColor: secondary, color: text }}>
               <BarChart size={16} style={{ color: accent, marginBottom: '4px' }} />
               <h4>Analytics</h4>
               <p style={{ opacity: 0.7 }}>Track everything.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SwipeCard = ({ palette, onSwipe, active, setSwipeDir }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const opacity = useTransform(x, [-300, -150, 0, 150, 300], [0, 1, 1, 1, 0]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [0, -100], [0, 1]);

  const handleDrag = (event, info) => {
    if (info.offset.x > 50) setSwipeDir('right');
    else if (info.offset.x < -50) setSwipeDir('left');
    else setSwipeDir(null);
  };

  const handleDragEnd = (event, info) => {
    setSwipeDir(null);
    if (info.offset.x > 100) {
      onSwipe('right');
    } else if (info.offset.x < -100) {
      onSwipe('left');
    }
  };

  if (!active) {
    return (
      <div className="card-container inactive-card">
        <div className="palette-display" style={{ height: '50%' }}>
          {palette.colors.map((color, index) => (
            <div key={index} className="color-bar" style={{ backgroundColor: color }}>
              <span className="hex-code">{color}</span>
            </div>
          ))}
        </div>
        <WebsitePreview colors={palette.colors} />
        <div className="card-info">
          <h2>{palette.name}</h2>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="card-container active-card"
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 0.98, cursor: 'grabbing' }}
      whileHover={{ scale: 1.02 }}
    >
      <motion.div className="stamp like-stamp" style={{ opacity: likeOpacity }}>
        SAVE
      </motion.div>
      <motion.div className="stamp nope-stamp" style={{ opacity: nopeOpacity }}>
        PASS
      </motion.div>
      
      <div className="palette-display" style={{ height: '50%' }}>
        {palette.colors.map((color, index) => (
          <div key={index} className="color-bar" style={{ backgroundColor: color }}>
             <span className="hex-code">{color}</span>
          </div>
        ))}
      </div>
      
      <WebsitePreview colors={palette.colors} />
      
      <div className="card-info">
        <h2>{palette.name}</h2>
        <p className="hint-text">Swipe left or right</p>
      </div>
    </motion.div>
  );
};

export default SwipeCard;
