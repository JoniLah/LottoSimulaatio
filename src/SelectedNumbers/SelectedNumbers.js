import React, { useEffect } from 'react';
import './SelectedNumbers.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faShuffle } from '@fortawesome/free-solid-svg-icons';

const SelectedNumbers = ({
  selectedNumbers,
  winningNumbers,
  handleResetRow,
  showResetButton,
  onDrawRemainingNumbers,
  winningNumbersHistory
}) => {
  const sortedNumbers = [...selectedNumbers].sort((a, b) => a - b);
  const currentRoundWinningNumbers = winningNumbersHistory[winningNumbersHistory.length - 1] || [];

  console.log("Selected numbers in SelectedNumbers component: ", selectedNumbers);
  console.log("Winning numbers in SelectedNumbers component: ", winningNumbers);
  
  return (
    <div className="selected-numbers">
      <div className="d-flex justify-content-between w-100">
        <div className="d-flex">
          {sortedNumbers.map((number) => (
            <span
              key={number}
              className={`selected-number ${currentRoundWinningNumbers.includes(number) ? 'winning-number' : ''}`} // Check against currentRoundWinningNumbers
            >
              {number}
            </span>
          ))}
        </div>

        {showResetButton && (
          <div className="d-flex align-items-center">
            <span
              className="mx-2"
              onClick={() => onDrawRemainingNumbers()}
              title="Arvo loput numerot"
            >
              <FontAwesomeIcon icon={faShuffle} />
            </span>
            <span onClick={() => handleResetRow()} title="Tyhjennä rivi">
              <FontAwesomeIcon icon={faTrashCan} />
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectedNumbers;