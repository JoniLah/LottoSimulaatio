import React from 'react';
import './SelectedNumbers.css';

const SelectedNumbers = ({ selectedNumbers, winningNumbers }) => {
  const sortedNumbers = [...selectedNumbers].sort((a, b) => a - b);

  return (
    <div className="selected-numbers">
      {sortedNumbers.map(number => {
        const isWinningNumber = winningNumbers.length > 0 && winningNumbers.includes(number);
        return (
          <span
            key={number}
            className={`selected-number ${isWinningNumber ? 'winning-number' : ''}`}
          >
            {number}
          </span>
        );
      })}
    </div>
  );
};

export default SelectedNumbers;