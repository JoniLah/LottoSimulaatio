import React, { useState, useEffect, useContext } from 'react';
import EurojackpotContext from '../../../context/EurojackpotContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const WinningNumbers = ({ selectedRows, calculateTotalWinnings }) => {
  const { winningMainNumbers, winningExtraNumbers } = useContext(EurojackpotContext);
  const [winningMainNumbersGenerated, setWinningMainNumbersGenerated] = useState(false);
  const [winningExtraNumbersGenerated, setWinningExtraNumbersGenerated] = useState(false);

  useEffect(() => {
    if (selectedRows.length > 0 && !winningMainNumbersGenerated) {
      setWinningMainNumbersGenerated(true);
    }
  }, [selectedRows, winningMainNumbersGenerated]);

  const matchCount = (rowNumbers) => {
    let count = 0;
    rowNumbers.forEach(num => {
      if (winningMainNumbers.includes(num)) {
        count++;
      }
    });
    return count;
  };

  const extraMatchCount = (rowExtraNumbers) => {
    let count = 0;
    rowExtraNumbers.forEach(num => {
      if (winningExtraNumbers.includes(num)) {
        count++;
      }
    });
    return count;
  };

const getResultMessage = () => {
    const winningClasses = {
      "5+2 oikein": 0,
      "5+1 oikein": 0,
      "5+0 oikein": 0,
      "4+2 oikein": 0,
      "4+1 oikein": 0,
      "3+2 oikein": 0,
      "4+0 oikein": 0,
      "2+2 oikein": 0,
      "3+1 oikein": 0,
      "3+0 oikein": 0,
      "1+2 oikein": 0,
      "2+1 oikein": 0
    };
  
    // Count occurrences of each winning class
    selectedRows.forEach(row => {
      const matchCounts = matchCount(row.numbers);
      const extraMatchCounts = extraMatchCount(row.extraNumbers);
      const key = `${matchCounts}+${extraMatchCounts} oikein`;
      if (key in winningClasses) {
        winningClasses[key]++;
      }
    });
  
    // Generate result messages
    const result = [];
    for (const [winningClass, count] of Object.entries(winningClasses)) {
      result.push(
        <p key={winningClass} className={`result-column-${winningClass}`}>
          {winningClass}: {count}
        </p>
      );
    }
    return result;
  };

  return (
    <>
      {winningMainNumbersGenerated && (
        <div className="mt-3">
          <h5 className="mb-1"><strong>Viimeisen kierroksen tiedot:</strong></h5>
          <p className="winning-numbers">
            <strong>Voittonumerot:</strong> {winningMainNumbers.join(', ')} <FontAwesomeIcon icon={faStar} className="mx-2" /> {winningExtraNumbers.join(', ')}
            <div className="total-winnings">
                <p><strong>Voitit yhteensä:</strong> {calculateTotalWinnings().toLocaleString('fi-FI', { style: 'currency', currency: 'EUR' })}</p>
            </div>
          </p>
          <div className="result-columns">{getResultMessage()}</div>
        </div>
      )}
    </>
  );
};

export default WinningNumbers;
