import React, { useState, useEffect, useContext } from 'react';
import './WinningNumbers.css';
import LotteryContext from '../context/LotteryContext';

const WinningNumbers = ({ selectedRows }) => {
  const { winningNumbers } = useContext(LotteryContext); 

  //const [winningNumbers, setWinningNumbers] = useState([]);
  const [winningNumbersGenerated, setWinningNumbersGenerated] = useState(false);

  useEffect(() => {
    if (selectedRows.length > 0 && !winningNumbersGenerated) {
      // TÄSSÄ SYY, GENEROI UUDET VOITTONUMEROT!
      //const newWinningNumbers = generateWinningNumbers().sort((a, b) => a - b);
      const newWinningNumbers = winningNumbers;
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
    <>
      {winningNumbersGenerated && (
        <div className="mt-3">
          <h5 className="mb-1"><strong>Viimeisen kierroksen tiedot:</strong></h5>
          <p className="winning-numbers">
            Voittonumerot: {winningNumbers.join(', ')}
            {/* Voittonumerot: {winningNumbers.map((item, index) => (
              <span key={index} className="winning-number">{item.value}</span>
            )).join(', ')} */}
          </p>
          <div className="result-columns">{getResultMessage()}</div>
        </div>
      )}
    </>
  );
};

export default WinningNumbers;
