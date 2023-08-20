import React, { useState, useEffect } from 'react';
import NumberPicker from '../../NumberPicker/NumberPicker';
import SelectedNumbers from '../../SelectedNumbers/SelectedNumbers';
import WinningNumbers from '../../WinningNumbers/WinningNumbers';
import { generateWinningNumbers } from '../../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import './Lottery.css';

function Lottery({ balance, setBalance }) {
  const [winningNumbersDrawn, setWinningNumbersDrawn] = useState(false);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [rows, setRows] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [winningNumbers, setWinningNumbers] = useState([]);
  const [roundCompleted, setRoundCompleted] = useState(false);
  const [keyCounter, setKeyCounter] = useState(0);
  const [resetting, setResetting] = useState(false);
  const [paidRows, setPaidRows] = useState([]);
  const [firstRoundCompleted, setFirstRoundCompleted] = useState(false);
  const [newRowsSelected, setNewRowsSelected] = useState(false);

  const renderWinningNumbers = () => {
    return winningNumbers.map((number, index) => (
      <div
        key={index}
        className={`winning-number number-${number} winning-number-active`}
      >
        {number}
      </div>
    ));
  };

  // Define a new state variable to track whether both conditions are met
  const [isRoundCompletedAndNumbersDrawn, setIsRoundCompletedAndNumbersDrawn] = useState(false);

  // Use a useEffect to watch for changes in roundCompleted and winningNumbersDrawn
  useEffect(() => {
    if (roundCompleted && winningNumbersDrawn) {
      // Both conditions are met, so execute your function here
      // Calculate the total winnings
      const totalWinnings = calculateTotalWinnings();
      
      // Update the balance
      setBalance(prevBalance => prevBalance + totalWinnings);

      console.log("in useEffect: " + totalWinnings);
      
      // Also set the state variable to true to prevent this from running multiple times
      setIsRoundCompletedAndNumbersDrawn(true);
    }
  }, [roundCompleted, winningNumbersDrawn]);

  useEffect(() => {
    // Check if roundCompleted and resetting are both true
    if (roundCompleted && resetting) {
      const newWinningNumbers = generateWinningNumbers();
      setWinningNumbers(newWinningNumbers);
      setRoundCompleted(false);
      setResetting(false);
    }
  }, [roundCompleted, resetting]);

  const handleResetRow = () => {
    setSelectedNumbers([]);
  }

  const handleDrawWinningNumbers = () => {
    if (!winningNumbersDrawn) {
      const newWinningNumbers = generateWinningNumbers();
      setWinningNumbers(newWinningNumbers);
      setWinningNumbersDrawn(true);

      // Calculate winnings for each row
      const updatedRows = rows.map(row => {
        const matchedNumbers = row.numbers.filter(number => winningNumbers.includes(number));
        const winnings = calculateWinnings(matchedNumbers.length);
        return { ...row, winnings };
      });
      }
  };

  const handleResetRows = () => {
    setSelectedNumbers([]);
    setRows([]);
    setTotalCost(0);
    setWinningNumbers([]);
    setRoundCompleted(false);
    setResetting(true);
    setWinningNumbersDrawn(false); // Reset the winning numbers drawing state
    setPaidRows([]); // Clear paid rows
  };

  const handlePayment = () => {
    if (totalCost <= balance) {
      // Remove this line as it's not needed here
      // setWinningNumbers(newWinningNumbers);
      setRoundCompleted(true);
      setBalance((prevBalance) => prevBalance - totalCost);
      setTotalCost(0); // Reset the totalCost after payment
  
      // Trigger the winning number animation after a short delay
      setTimeout(() => {
        const winningNumberElements = document.querySelectorAll('.winning-number');
        winningNumberElements.forEach((element) => {
          element.classList.add('winning-number-active');
        });
      }, 100);
  
      // Set the first round as completed
      if (!firstRoundCompleted) {
        setFirstRoundCompleted(true);
      }
    } else {
      alert('Ei riittävästi saldoa.');
    }
  };

  const calculateWinnings = (matchedNumbersCount) => {
    const winningPrizes = [0, 0, 0, 0, 10, 79.75, 3628.14, 13000000];
    return winningPrizes[matchedNumbersCount];
  };

  const handleNewRound = () => {
    if (resetting) {
      setSelectedNumbers([]);
      setRows([]);
      setTotalCost(0);
      setWinningNumbers([]);
      setRoundCompleted(false);
      setResetting(false);
    } else {
      // Generate new winning numbers here
      const newWinningNumbers = generateWinningNumbers();
      setWinningNumbers(newWinningNumbers);
      setResetting(true);
    }
  };

  const handleNumberClick = (number) => {
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(prevSelected => prevSelected.filter(num => num !== number));
    } else {
      if (selectedNumbers.length < 7) {
        setSelectedNumbers(prevSelected => [...prevSelected, number]);
      }
    }
  };

  const handleAddRow = () => {
    if (selectedNumbers.length === 7) {
      const newRowKey = `row_${performance.now()}`;
      setRows((prevRows) => [
        ...prevRows,
        { key: newRowKey, numbers: selectedNumbers },
      ]);
      setTotalCost((prevCost) => prevCost + 1);
      setSelectedNumbers([]);
  
      // Set newRowsSelected to true when adding a row
      setNewRowsSelected(true);
    }
  };

  const pickRandomRows = (count) => {
    for (let i = 0; i < count; i++) {
      const randomNumbers = [];
      while (randomNumbers.length < 7) {
        const randomNumber = Math.floor(Math.random() * 40) + 1;
        if (!randomNumbers.includes(randomNumber)) {
          randomNumbers.push(randomNumber);
        }
      }
      const newRowKey = `row_${performance.now()}_${keyCounter + i}`;
      setRows((prevRows) => [
        ...prevRows,
        { key: newRowKey, numbers: randomNumbers },
      ]);
      setTotalCost((prevCost) => prevCost + 1);
    }
    setKeyCounter((prevKeyCounter) => prevKeyCounter + count);
  
    // Set newRowsSelected to true after adding random rows
    setNewRowsSelected(true);
  };

  const handleDeleteRow = (rowIndex) => {
    const updatedRows = rows.filter((_, index) => index !== rowIndex);
    setRows(updatedRows);
    setTotalCost(prevCost => prevCost - 1);
  };

  const calculateMatchedNumbers = (selectedNumbers, winningNumbers) => {
    return selectedNumbers.filter(number => winningNumbers.includes(number)).length;
  };

  const calculateTotalWinnings = () => {
    const totalWinnings = rows.reduce(
      (total, row) => total + calculateWinnings(calculateMatchedNumbers(row.numbers, winningNumbers)),
      0
    );
  
    return totalWinnings;
  };

  const handleDrawRemainingNumbers = () => {
    const remainingNumbers = generateRandomNumbers(); // Generate random numbers
    const updatedSelectedNumbers = [...selectedNumbers, ...remainingNumbers];
    setSelectedNumbers(updatedSelectedNumbers);
  };

  const generateRandomNumbers = () => {
    const remainingNumbers = [];
    while (remainingNumbers.length < 7 - selectedNumbers.length) {
      const randomNumber = Math.floor(Math.random() * 40) + 1; // Adjust the range as needed
      if (!selectedNumbers.includes(randomNumber) && !remainingNumbers.includes(randomNumber)) {
        remainingNumbers.push(randomNumber);
      }
    }
    return remainingNumbers; // Ensure it always returns an array
  };

  return (
    <div className="container mt-5">
      <div className="row mb-3">
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <h1>LottoSimulaatio</h1>
          <div style={{ display: 'flex', flexDirection: 'column'}}>
            <p>Saldo:</p>
            <h5>{balance.toLocaleString('fi-FI', { style: 'currency', currency: 'EUR' })}</h5>
          </div>
        </div>
        
        <div className="row my-3">
          <div className="col-md-12">
            <button className="btn btn-primary random-rows" onClick={() => pickRandomRows(1)}>
              Valitse 1 satunnainen rivi
            </button>
            <button className="btn btn-primary random-rows" onClick={() => pickRandomRows(5)}>
              Valitse 5 satunnaista riviä
            </button>
            <button className="btn btn-primary random-rows" onClick={() => pickRandomRows(10)}>
              Valitse 10 satunnaista riviä
            </button>
            <button className="btn btn-primary random-rows" onClick={() => pickRandomRows(100)}>
              Valitse 100 satunnaista riviä
            </button>
            <button className="btn btn-primary random-rows" onClick={() => pickRandomRows(10000)}>
              Valitse 10 000 satunnaista riviä
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            {selectedNumbers.length < 7 && (
              <small>Valitse {7 - selectedNumbers.length === 1 ? 'vielä 1 numero' : `${7 - selectedNumbers.length} numeroa`}</small>
            )}
            <NumberPicker selectedNumbers={selectedNumbers} onNumberClick={handleNumberClick} />
            {selectedNumbers.length > 0 ? (
              <div className="selected-numbers-live">
                <SelectedNumbers selectedNumbers={selectedNumbers} winningNumbers={winningNumbers} handleResetRow={handleResetRow} showResetButton={true} onDrawRemainingNumbers={handleDrawRemainingNumbers} />
                {selectedNumbers.length >= 7 ? (
                <button
                  onClick={handleAddRow}
                  disabled={selectedNumbers.length !== 7}
                  className="btn btn-warning mt-2"
                >
                  Lisää rivi
                </button>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="col-md-6 selected-container">
          {rows.map((row, index) => (
              <div key={row.key} className="selected-row">
                <SelectedNumbers
                  selectedNumbers={row.numbers}
                  winningNumbers={winningNumbers}
                  handleResetRow={() => {}}
                  showResetButton={false}
                />
                <div className="winning-info" style={{display: 'flex', alignSelf: 'center', marginTop: '20px'}}>
                  {roundCompleted && calculateWinnings(calculateMatchedNumbers(row.numbers, winningNumbers)) > 0 && (
                    <p><span style={{color: 'green', fontWeight: 'bold'}}>Voitto:</span> {calculateWinnings(calculateMatchedNumbers(row.numbers, winningNumbers)).toLocaleString('fi-FI', { style: 'currency', currency: 'EUR' })}</p>
                  )}
                </div>
                <span onClick={() => handleDeleteRow(index)}><FontAwesomeIcon icon={faTrashCan} /></span>
              </div>
            ))}
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-md-12">
            {roundCompleted && !winningNumbersDrawn ? (
              <>
                <button className="btn btn-primary" onClick={handleDrawWinningNumbers}>
                  Arvo numerot
                </button>

                <button className="btn btn-secondary" onClick={handleResetRows}>
                  Tyhjennä rivit
                </button>
              </>
            ) : (
              <>
                {newRowsSelected && !winningNumbersDrawn && (
                  <button className="btn btn-success" onClick={handlePayment}>
                    Maksa {totalCost.toLocaleString('fi-FI', { style: 'currency', currency: 'EUR' })}
                  </button>
                )}
                {firstRoundCompleted && rows.length > 0 && (
                  <button className="btn btn-primary" onClick={handleNewRound}>
                    Arvo numerot uudelleen
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <div>
          {winningNumbers.length > 0 && (
            <WinningNumbers winningNumbers={winningNumbers} selectedRows={rows} />
          )}
        </div>

        <div className="winning-numbers-container">
          {roundCompleted && (
            <div className="winning-numbers-animation">
              {renderWinningNumbers()}
            </div>
          )}
        </div>

        <div className="total-winnings">
          {roundCompleted && winningNumbersDrawn && (
            <p>Voitit yhteensä: {calculateTotalWinnings().toLocaleString('fi-FI', { style: 'currency', currency: 'EUR' })}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Lottery;