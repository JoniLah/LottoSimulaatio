import React from 'react';
import './SelectedNumbers.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faShuffle, faStar } from '@fortawesome/free-solid-svg-icons';

const SelectedNumbers = ({
  selectedNumbers,
  selectedExtraNumbers,
  winningNumbers,
  winningExtraNumbers,
  handleResetRow,
  showResetButton,
  onDrawRemainingNumbers,
  winningNumbersHistory,
  winningExtraNumbersHistory,
  winningNumbersDrawn
}) => {
  const sortedNumbers = [...selectedNumbers].sort((a, b) => a - b);
  const sortedExtraNumbers = selectedExtraNumbers ? [...selectedExtraNumbers].sort((a, b) => a - b) : [];
  const hasExtraNumbers = sortedExtraNumbers.length > 0;

  // Check if winningNumbersHistory is not empty and is a string
  const winningNumbersCopy = winningNumbersHistory && typeof winningNumbersHistory === 'string'
    ? winningNumbersHistory.split(',').map(Number)
    : [];

  let winningExtraNumbersCopy;

  if (hasExtraNumbers) {
    winningExtraNumbersCopy = winningExtraNumbersHistory && typeof winningExtraNumbersHistory === 'string'
      ? winningExtraNumbersHistory.split(',').map(Number)
      : [];
  }
  
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
          {hasExtraNumbers && 
            <div className="d-flex">
              <FontAwesomeIcon icon={faStar} className="d-flex align-self-center mx-2" />
              {sortedExtraNumbers.map((number) => {
                const isWinningExtraNumber = winningExtraNumbersCopy.includes(Number(number));
                const isWinningExtraNumberLive = winningExtraNumbers.includes(Number(number));

                return (
                  <span
                    key={number}
                    className={`selected-number ${isWinningExtraNumber ? 'winning-number' : ''} ${isWinningExtraNumberLive && winningNumbersDrawn ? 'winning-number' : ''}`}
                  >
                    {number}
                  </span>
                );
              })}
            </div>
          }
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