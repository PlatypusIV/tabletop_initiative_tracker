import React from 'react';
import './loader.css';

export default function Loader() {
  return (
    <div className="loader-container">
      <div className="magic-circle"></div>
      <div className="runes"></div>
      <div className="loading-text">Summoning pieces...</div>
    </div>
  )
}