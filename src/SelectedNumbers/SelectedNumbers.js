import React from 'react';
import './SelectedNumbers.css';

const SelectedNumbers = ({ selectedNumbers }) => {
  const sortedNumbers = [...selectedNumbers].sort((a, b) => a - b);

  return (
    <div className="selected-numbers">
      <h2>Selected Numbers:</h2>
      <div>
        {sortedNumbers.map(number => (
          <span key={number} className="selected-number">
            {number}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SelectedNumbers;
