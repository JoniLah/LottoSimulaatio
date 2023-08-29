import React, { useState, useEffect } from 'react';
import NumberPicker from '../../NumberPicker/NumberPicker';
import SelectedNumbers from '../../SelectedNumbers/SelectedNumbers';
import WinningNumbers from '../../WinningNumbers/WinningNumbers';
import { generateWinningNumbers } from '../../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap/js/dist/collapse'; // Import Bootstrap Collapse JavaScript module
import './Lottery.css';

function Lottery({ balance, setBalance }) {
  const [winningNumbersDrawn, setWinningNumbersDrawn] = useState(false);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [rows, setRows] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [currentTotalCost, setCurrentTotalCost] = useState(0);
  const [winningNumbers, setWinningNumbers] = useState([]);
  const [roundCompleted, setRoundCompleted] = useState(false);
  const [keyCounter, setKeyCounter] = useState(0);
  const [resetting, setResetting] = useState(false);
  const [firstRoundCompleted, setFirstRoundCompleted] = useState(false);
  const [newRowsSelected, setNewRowsSelected] = useState(false);
  const [isRoundCompletedAndNumbersDrawn, setIsRoundCompletedAndNumbersDrawn] = useState(false);
  const [accordionVisible, setAccordionVisible] = useState(false);
  const [previousRoundDetails, setPreviousRoundDetails] = useState(null);

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

  useEffect(() => {
    if (roundCompleted && winningNumbersDrawn) {
      const totalWinnings = calculateTotalWinnings();
      setBalance(prevBalance => prevBalance + totalWinnings);
      setIsRoundCompletedAndNumbersDrawn(true);

    }
  }, [roundCompleted, winningNumbersDrawn]);

  useEffect(() => {
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

  // const handlePayment = () => {
  //   if (totalCost <= balance) {
  //     setRoundCompleted(true);
  //     setBalance((prevBalance) => prevBalance - totalCost);
  //     setTotalCost(0); // Reset the totalCost after payment
  
  //     // Trigger the winning number animation after a short delay
  //     setTimeout(() => {
  //       const winningNumberElements = document.querySelectorAll('.winning-number');
  //       winningNumberElements.forEach((element) => {
  //         element.classList.add('winning-number-active');
  //       });
  //     }, 100);
  
  //     // Set the first round as completed
  //     if (!firstRoundCompleted) {
  //       setFirstRoundCompleted(true);
  //     }
  //   } else {
  //     alert('Ei riittävästi saldoa.');
  //   }
  // };

  const handlePayment = () => {
    console.log("111");
    if (currentTotalCost <= balance) {
      console.log(currentTotalCost);
      // Remove this line as it's not needed here
      // setWinningNumbers(newWinningNumbers);
      setRoundCompleted(true);
      setBalance((prevBalance) => prevBalance - currentTotalCost);
      setCurrentTotalCost(0); // Reset the current total cost after payment
  
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
      setCurrentTotalCost((prevCost) => prevCost + 1); // Update current total cost
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

  const clearAllSelectedRows = () => {
    setRows([]);
    setTotalCost(0);
    setNewRowsSelected(false);
  };

  // const renderPaymentButton = () => {
  //   if (newRowsSelected && (!roundCompleted || (roundCompleted && winningNumbersDrawn))) {
  //     const cost = totalCost.toLocaleString('fi-FI', { style: 'currency', currency: 'EUR' });
  //     return (
  //       <div>
  //         <button className="btn btn-success" onClick={handlePayment}>
  //           Maksa {cost}
  //         </button>
  //       </div>
  //     );
  //   } else {
  //     return null; // Hide the "Maksa" button in other cases
  //   }
  // };

  const renderPaymentButton = () => {
    let cost = currentTotalCost;
    if (rows.length > 0 && (!roundCompleted || (roundCompleted && winningNumbersDrawn))) {
      cost = rows.length;
    }
    return (
      <div>
        <button className="btn btn-success" onClick={handlePayment}>
          Maksa {cost.toLocaleString('fi-FI', { style: 'currency', currency: 'EUR' })}
        </button>
      </div>
    );
  };

  const renderRandomRowButton = (count) => {
    const formattedCount = count.toLocaleString('fi-FI');

    return (
      <button
        key={count}
        className="btn btn-primary random-rows"
        onClick={() => pickRandomRows(count)}
      >
        Valitse {formattedCount} satunnaista riviä
      </button>
    );
  }

  const savePreviousRoundDetails = () => {
    const timestamp = new Date().toLocaleString('fi-FI');
    const cost = currentTotalCost.toLocaleString('fi-FI', { style: 'currency', currency: 'EUR' });
    const winnings = calculateTotalWinnings();
    const date = new Date().toLocaleDateString('fi-FI');

    const roundDetails = {
      timestamp,
      selectedNumbers,
      winningNumbers,
      cost,
      winnings,
      date
    };

    setPreviousRoundDetails(roundDetails);
  };

  useEffect(() => {
    if (roundCompleted && winningNumbersDrawn) {
      savePreviousRoundDetails();
      setIsRoundCompletedAndNumbersDrawn(true);
    }
  }, [roundCompleted, winningNumbersDrawn]);

  return (
    <div className="container mt-5">
      <div className="row mb-3">
        <div className="row my-3">
          <div className="col-md-12">
            {renderRandomRowButton(1)}
            {renderRandomRowButton(5)}
            {renderRandomRowButton(10)}
            {renderRandomRowButton(100)}
            {renderRandomRowButton(10000)}
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

          <div className="col-md-6">
            <div className="d-flex flex-column align-items-end">
              <div className="selected-container w-100">
                {rows.map((row, index) => (
                    <div key={row.key} className="selected-row">
                      <div className="d-flex flex-row align-items-center">
                        <small className="mx-2">{index + 1}.</small>
                        <SelectedNumbers
                          selectedNumbers={row.numbers}
                          winningNumbers={winningNumbers}
                          handleResetRow={() => {}}
                          showResetButton={false}
                        />
                      </div>
                      <div className="winning-info" style={{display: 'flex', alignSelf: 'center', marginTop: '20px'}}>
                        {roundCompleted && calculateWinnings(calculateMatchedNumbers(row.numbers, winningNumbers)) > 0 && (
                          <p><span style={{color: 'green', fontWeight: 'bold'}}>Voitto:</span> {calculateWinnings(calculateMatchedNumbers(row.numbers, winningNumbers)).toLocaleString('fi-FI', { style: 'currency', currency: 'EUR' })}</p>
                        )}
                      </div>
                      <span onClick={() => handleDeleteRow(index)}><FontAwesomeIcon icon={faTrashCan} /></span>
                    </div>
                  ))}
              </div>
              {rows.length > 0 && (
                  <button className="btn btn-secondary mt-3" onClick={clearAllSelectedRows}>
                    Tyhjennä rivit
                  </button>
              )}
            </div>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-md-12">
            {roundCompleted && !winningNumbersDrawn ? (
              <button className="btn btn-primary" onClick={handleDrawWinningNumbers}>
                Arvo numerot
              </button>
            ) : (
              renderPaymentButton()
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

        {roundCompleted && winningNumbersDrawn && (
            <button
              className="btn btn-secondary mt-2"
              onClick={() => setAccordionVisible(!accordionVisible)}
            >
              Näytä pelitulokset
            </button>
          )}

          {accordionVisible && roundCompleted && winningNumbersDrawn && (
            <div className="accordion mt-3" id="accordionResults">
              <div className="card">
                <div className="card-header past-game__container" id="headingResults">
                  <h2 className="mb-0">
                    <button
                      className="btn btn-link w-100"
                      type="button"
                      data-toggle="collapse"
                      data-target="#collapseResults"
                      aria-expanded="true"
                      aria-controls="collapseResults"
                    >
                      <div className="d-flex flex-row justify-content-between align-items-center w-100 past-game__accordion">
                        <h4>Lotto</h4>
                        <div className="d-flex flex-column align-items-end">
                          <span>Hinta: <strong>{previousRoundDetails.cost}</strong></span>
                          <span>Arvottu: <strong>{previousRoundDetails.date}</strong></span>
                        </div>
                      </div>
                    </button>
                  </h2>
                </div>

                <div
                  id="collapseResults"
                  className="collapse"
                  aria-labelledby="headingResults"
                  data-parent="#accordionResults"
                >
                  <div className="card-body">
                    {previousRoundDetails && (
                      <div>
                        <h5><strong>Edellisen kierroksen tiedot:</strong></h5>
                        <p><strong>Valitut numerot:</strong> {previousRoundDetails.selectedNumbers.join(', ')}</p>
                        <p><strong>Voittorivin numerot:</strong> {previousRoundDetails.winningNumbers.join(', ')}</p>
                        <p><strong>Ajankohta:</strong> {previousRoundDetails.timestamp}</p>
                        <p><strong>Hinta:</strong> {previousRoundDetails.cost}</p>
                        {previousRoundDetails.winnings > 0 && (
                          <p><strong>Voitot:</strong> {previousRoundDetails.winnings.toLocaleString('fi-FI', { style: 'currency', currency: 'EUR' })}</p>
                        )}
                      </div>
                    )}

                    {rows.map((row, index) => (
                      <div key={row.key} className="past-game__row">
                        <div className="selected-row">
                          <div className="d-flex flex-row align-items-center">
                            <small className="mx-2 past-game__index">{index + 1}.</small>
                            <SelectedNumbers
                              selectedNumbers={row.numbers}
                              winningNumbers={winningNumbers}
                              handleResetRow={() => {}}
                              showResetButton={false}
                            />

                          </div>
                          <div
                            className="winning-info"
                            style={{ display: 'flex', alignSelf: 'center', marginTop: '20px' }}
                          >
                            {roundCompleted &&
                              calculateWinnings(calculateMatchedNumbers(row.numbers, winningNumbers)) > 0 && (
                                <p>
                                  <span style={{ color: 'green', fontWeight: 'bold' }}>Voitto:</span>{' '}
                                  {calculateWinnings(calculateMatchedNumbers(row.numbers, winningNumbers)).toLocaleString(
                                    'fi-FI',
                                    { style: 'currency', currency: 'EUR' }
                                  )}
                                </p>
                              )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <p>Pelien kokonaiskustannus: {currentTotalCost} €</p>
                    <p>Pelien voitot: {calculateTotalWinnings().toLocaleString('fi-FI', { style: 'currency', currency: 'EUR' })}</p>
                    <p>Voitto/yhteenlaskettu tulos: {(calculateTotalWinnings() - currentTotalCost).toLocaleString('fi-FI', { style: 'currency', currency: 'EUR' })}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

export default Lottery;