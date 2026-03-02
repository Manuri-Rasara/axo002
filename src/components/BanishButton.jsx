import React from 'react';

export const BanishButton = ({ onClick }) => {
  return (
    <button 
      className="banish-button" 
      onClick={onClick}
      aria-label="Banish the headache"
    >
      BANISH!
    </button>
  );
};
