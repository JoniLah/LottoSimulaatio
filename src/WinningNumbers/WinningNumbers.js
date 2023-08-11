import React, { useState, useEffect } from 'react';
import './WinningNumbers.css';
import { generateWinningNumbers } from '../utils';

const WinningNumbers = ({ selectedRows }) => {
  const [winningNumbers, setWinningNumbers] = useState([]);
  const [winningNumbersGenerated, setWinningNumbersGenerated] = useState(false);

  useEffect(() => {
    if (selectedRows.length > 0 && !winningNumbersGenerated) {
      const newWinningNumbers = generateWinningNumbers().sort((a, b) => a - b);
      setWinningNumbers(newWinningNumbers);
      setWinningNumbersGenerated(true);
    }
  }, [selectedRows, winningNumbersGenerated]);

  const matchCount = (rowNumbers) => {
    let count = 0;
    rowNumbers.forEach(num => {
      if (winningNumbers.includes(num)) {
        count++;
      }
    });
    return count;
  };

  const getResultMessage = () => {
    const result = [];
    for (let i = 4; i <= 7; i++) {
      const matchingRows = selectedRows.filter(row => matchCount(row.numbers) === i);
      result.push(
        <p key={i} className={`result-column-${i}`}>
          {i} oikein riviä: {matchingRows.length}
        </p>
      );
    }
    return result;
  };

  return (
    <div className="winning-numbers-container">
      {winningNumbersGenerated && (
        <div>
          <p className="winning-numbers">
            Voittonumerot: {winningNumbers.join(', ')}
          </p>
          <div className="result-columns">{getResultMessage()}</div>
        </div>
      )}
    </div>
  );
};

export default WinningNumbers;
