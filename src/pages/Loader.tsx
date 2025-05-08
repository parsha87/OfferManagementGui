// src/components/Loader.tsx
import React from 'react';
import './Loader.css'; // optional

const Loader = () => (
  <div className="loader-overlay">
    <div className="loader-spinner">Loading...</div>
  </div>
);

export default Loader;
