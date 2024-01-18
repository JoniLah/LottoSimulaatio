import React from 'react';
import './SelectedNumbers.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faShuffle } from '@fortawesome/free-solid-svg-icons';

const SelectedNumbers = ({
  selectedNumbers,
  winningNumbers,
  handleResetRow,
  showResetButton,
  onDrawRemainingNumbers,
  winningNumbersHistory,
  winningNumbersDrawn
}) => {
  const sortedNumbers = [...selectedNumbers].sort((a, b) => a - b);

  // Check if winningNumbersHistory is not empty and is a string
  const winningNumbersCopy = winningNumbersHistory && typeof winningNumbersHistory === 'string'
    ? winningNumbersHistory.split(',').map(Number)
    : [];
  
  return (
    <div className="selected-numbers">
      <div className="d-flex justify-content-between w-100">
        <div className="d-flex">
          {sortedNumbers.map((number) => {
            const isWinningNumber = winningNumbersCopy.includes(Number(number));
            const isWinningNumberLive = winningNumbers.includes(Number(number));
            return (
              <span
                key={number}
                className={`selected-number ${isWinningNumber ? 'winning-number' : ''} ${isWinningNumberLive && winningNumbersDrawn ? 'winning-number' : ''}`}
              >
                {number}
              </span>
            );
          })}
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