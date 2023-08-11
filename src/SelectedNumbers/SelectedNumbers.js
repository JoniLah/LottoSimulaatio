import React from 'react';
import './SelectedNumbers.css';

const SelectedNumbers = ({ selectedNumbers, winningNumbers }) => {
  const sortedNumbers = [...selectedNumbers].sort((a, b) => a - b);

  return (
    <div className="selected-numbers">
      {sortedNumbers.map(number => (
        <span
          key={number}
          className={`selected-number ${winningNumbers.includes(number) ? 'winning-number' : ''}`}
        >
          {number}
        </span>
      ))}
    </div>
  );
};

export default SelectedNumbers;