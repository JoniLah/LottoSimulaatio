import React from 'react';
import './NumberPicker.css';

const NumberPicker = ({ totalNumbers, onNumberClick, selectedNumbers, extraNumbers }) => {
  const handleNumberClick = (number, extraNumbers) => {
    onNumberClick(number, extraNumbers);
  };

  const renderNumbers = () => {
    const numbers = [];
    for (let i = 1; i <= totalNumbers; i++) {
      const isSelected = selectedNumbers.includes(i);
      numbers.push(
        <div
          key={i}
          className={`number ${isSelected ? 'selected' : ''}`}
          onClick={() => handleNumberClick(i, extraNumbers)}
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
