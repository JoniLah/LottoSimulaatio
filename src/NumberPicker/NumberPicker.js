import React from 'react';
import './NumberPicker.css';

const NumberPicker = ({ onNumberClick, selectedNumbers }) => {
  const handleNumberClick = (number) => {
    onNumberClick(number);
  };

  const renderNumbers = () => {
    const numbers = [];
    for (let i = 1; i <= 40; i++) {
      const isSelected = selectedNumbers.includes(i);
      numbers.push(
        <div
          key={i}
          className={`number ${isSelected ? 'selected' : ''}`}
          onClick={() => handleNumberClick(i)}
        >
          {i}
        </div>
      );
    }
    return numbers;
  };

  return (
    <div className="number-picker">
      {renderNumbers()}
    </div>
  );
};

export default NumberPicker;
