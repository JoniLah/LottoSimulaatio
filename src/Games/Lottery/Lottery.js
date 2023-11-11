import { useState, useEffect } from 'react';
import NumberPicker from '../../NumberPicker/NumberPicker';
import SelectedNumbers from '../../SelectedNumbers/SelectedNumbers';
import WinningNumbers from '../../WinningNumbers/WinningNumbers';
import { generateWinningNumbers } from '../../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Accordion } from 'react-bootstrap';
import './Lottery.css';

function Lottery({ balance, setBalance }) {
  const [winningNumbersDrawn, setWinningNumbersDrawn] = useState(false);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [rows, setRows] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [currentTotalCost, setCurrentTotalCost] = useState(0);
  const [winningNumbers, setWinningNumbers] = useState([]);
  const [roundWinningNumbers, setRoundWinningNumbers] = useState([]);
  const [roundCompleted, setRoundCompleted] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [keyCounter, setKeyCounter] = useState(0);
  const [newRowsSelected, setNewRowsSelected] = useState(false);
  const [accordionVisible, setAccordionVisible] = useState(false);
  const [previousRoundDetails, setPreviousRoundDetails] = useState(null);
  const [previousGames, setPreviousGames] = useState([]);
  const [firstRoundCompleted, setFirstRoundCompleted] = useState(false);
  const [newRoundAvailable, setNewRoundAvailable] = useState(false);
  const [roundWinningNumbersCopy, setRoundWinningNumbersCopy] = useState([]);
  const [winningNumbersHistory, setWinningNumbersHistory] = useState([]);

  useEffect(() => {
    if (roundCompleted && winningNumbersDrawn) {
      const totalWinnings = calculateTotalWinnings();
      setBalance(prevBalance => prevBalance + totalWinnings);
      savePreviousRoundDetails();
      resetRound();
    }
  }, [roundCompleted, winningNumbersDrawn]);

  const startRound = () => {
    // Generate new winning numbers for each round
    // const newWinningNumbers = generateWinningNumbers(Date.now());
    // setWinningNumbers(newWinningNumbers);

    console.log("AAAAAAAAAAAAA Winning numbers in Lottery component: ", winningNumbers);
    //setRoundWinningNumbers(newWinningNumbers);

    //savePreviousRoundDetails();

    setRoundCompleted(true);
    setNewRoundAvailable(false);

    setTimeout(() => {
      const winningNumberElements = document.querySelectorAll('.winning-number');
      winningNumberElements.forEach((element) => {
        element.classList.add('winning-number-active');
      });
    }, 100);
  };

  const resetRound = () => {
    setWinningNumbers([]);
    setWinningNumbersDrawn(false);
    setRoundCompleted(false);
    //setNewRowsSelected(false);
  };

  /* GAME LOGIC */
  const savePreviousRoundDetails = () => {
    const timestamp = new Date().toLocaleString('fi-FI');
    const cost = totalCost.toLocaleString('fi-FI', { style: 'currency', currency: 'EUR' });
    const winnings = calculateTotalWinnings();
    const date = new Date().toLocaleDateString('fi-FI');
    const roundWinningNumbersCopy = [...roundWinningNumbers];
    console.log(roundWinningNumbersCopy);

    const roundDetails = {
      timestamp,
      selectedNumbers,
      winningNumbers: roundWinningNumbersCopy,
      cost,
      winnings,
      date
    };

    setPreviousGames(prevGames => [...prevGames, roundDetails]);
    setPreviousRoundDetails(roundDetails);
  };

  const handleNewRound = (newWinningNumbers) => {
    // Update the winning numbers history with the new round's winning numbers
    //setWinningNumbersHistory([...winningNumbersHistory, newWinningNumbers]);
    setWinningNumbersHistory((prevHistory) => [...prevHistory, newWinningNumbers]);
  };

  /* ROWS LOGIC */
  const handleAddRow = () => {
    if (selectedNumbers.length === 7) {
      const newRowKey = `row_${performance.now()}`;
      setRows((prevRows) => [
        ...prevRows,
        { key: newRowKey, numbers: selectedNumbers },
      ]);
      setCurrentTotalCost((prevCost) => prevCost + 1);
      setSelectedNumbers([]);
  
      setNewRowsSelected(true);
    }
  };

  const handleResetRow = () => {
    setSelectedNumbers([]);
  }

  const handleDeleteRow = (rowIndex) => {
    const updatedRows = rows.filter((_, index) => index !== rowIndex);
    setRows(updatedRows);
    setTotalCost(prevCost => prevCost - 1);
  };

  const clearAllSelectedRows = () => {
    setRows([]);
    setTotalCost(0);
    setNewRowsSelected(false);
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
    setNewRowsSelected(true);
  };

  /* PAYMENT LOGIC */
  const handlePayment = () => {
    if (totalCost <= balance) {
      setBalance((prevBalance) => prevBalance - totalCost);
      setPaymentCompleted(true);
    } else {
      alert('Ei riittävästi saldoa.');
    }
  };

  const calculateWinnings = (matchedNumbersCount) => {
    const winningPrizes = [0, 0, 0, 0, 10, 79.75, 3628.14, 13000000];
    return winningPrizes[matchedNumbersCount];
  };

  const calculateTotalWinnings = () => {
    const totalWinnings = rows.reduce(
      (total, row) => total + calculateWinnings(calculateMatchedNumbers(row.numbers, winningNumbers)),
      0
    );
  
    return totalWinnings;
  };

  const handleDrawWinningNumbers = () => {
    if (!winningNumbersDrawn) {
      setWinningNumbersDrawn(true);

      console.log("in handle draw winnings");
      if (!firstRoundCompleted) {
        setFirstRoundCompleted(true);
      }

      const newWinningNumbers = generateWinningNumbers(Date.now());
      setWinningNumbers(newWinningNumbers);
      setRoundWinningNumbers(newWinningNumbers);

      // Call handleNewRound with the newWinningNumbers
      handleNewRound(newWinningNumbers);
      
      //setRoundCompleted(true);
      setPaymentCompleted(false);
      setNewRoundAvailable(true);
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



  const calculateMatchedNumbers = (selectedNumbers, winningNumbers) => {
    return selectedNumbers.filter(number => winningNumbers.includes(number)).length;
  };

  

  const handleDrawRemainingNumbers = () => {
    const remainingNumbers = generateRandomNumbers();
    const updatedSelectedNumbers = [...selectedNumbers, ...remainingNumbers];
    setSelectedNumbers(updatedSelectedNumbers);
  };

  const generateRandomNumbers = () => {
    const remainingNumbers = [];
    while (remainingNumbers.length < 7 - selectedNumbers.length) {
      const randomNumber = Math.floor(Math.random() * 40) + 1;
      if (!selectedNumbers.includes(randomNumber) && !remainingNumbers.includes(randomNumber)) {
        remainingNumbers.push(randomNumber);
      }
    }
    return remainingNumbers; // Ensure it always returns an array
  };

  /* RENDERING */
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
        {count === 1 ? (
          `Valitse ${formattedCount} satunnainen rivi`
        ) : (
          `Valitse ${formattedCount} satunnaista riviä`
        )}
      </button>
    );
  }

  const renderWinningNumbers = () => {
    return winningNumbers.map((number, index) => (
      <div
        key={index}
        // className={`winning-number number-${number} winning-number-active`}
        className={`winning-number number-${number} ${winningNumbersDrawn ? 'winning-number-active' : ''}`}
      >
        {number}
      </div>
    ));
  };

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
                <SelectedNumbers 
                  selectedNumbers={selectedNumbers}
                  winningNumbers={winningNumbers}
                  handleResetRow={handleResetRow}
                  showResetButton={true}
                  onDrawRemainingNumbers={handleDrawRemainingNumbers}
                  winningNumbersHistory={[]}
                />
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
                          winningNumbersHistory={[]}
                        />
                      </div>
                      <div className="winning-info" style={{display: 'flex', alignSelf: 'center', marginTop: '20px'}}>
                        {roundCompleted && calculateWinnings(calculateMatchedNumbers(row.numbers, winningNumbers)) > 0 && (
                          <p><span style={{color: 'green', fontWeight: 'bold'}}>Voitto:</span> {calculateWinnings(calculateMatchedNumbers(row.numbers, winningNumbers)).toLocaleString('fi-FI', { style: 'currency', currency: 'EUR' })}</p>
                        )}
                      </div>
                      {!roundCompleted && (
                        <span onClick={() => handleDeleteRow(index)}><FontAwesomeIcon icon={faTrashCan} /></span>
                      )}
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
            {/* {roundCompleted && !winningNumbersDrawn ? ( */}
            {paymentCompleted ? (
              <button className="btn btn-primary" onClick={handleDrawWinningNumbers}>
                Arvo numerot
              </button>
            ) : (
              newRoundAvailable ? (
                <button className="btn btn-secondary" onClick={startRound}>
                  Uusi kierros
                </button>
              ) : (
                renderPaymentButton()
              )
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

        <div>
          {/* {firstRoundCompleted && winningNumbersDrawn && ( */}
          {firstRoundCompleted && (
            <button
              className="btn btn-secondary mt-2"
              onClick={() => setAccordionVisible(!accordionVisible)}
            >
              Näytä pelitulokset
            </button>
          )}

          {accordionVisible && (
            <Accordion defaultActiveKey="0" flush>
              {previousGames.map((previousGame, index) => (
                <Accordion.Item eventKey={index} key={index}>
                  <div className="card">
                    <div className="card-header past-game__container">
                      <Accordion.Header className="mb-0">
                        <div className="btn btn-link w-100">
                          <div className="d-flex flex-row justify-content-between align-items-center w-100 past-game__accordion">
                            <h4>Lotto</h4>
                            <div className="d-flex flex-column align-items-end">
                              <span>Hinta: <strong>{previousGame.cost}</strong></span>
                              <span>Arvottu: <strong>{previousGame.date}</strong></span>
                            </div>
                          </div>
                        </div>
                      </Accordion.Header>
                    </div>

                    <Accordion.Body>
                      <div className="card-body">
                        <div>
                          <h5><strong>Edellisen kierroksen tiedot:</strong></h5>
                          <p><strong>Voittorivin numerot:</strong> {previousGame.winningNumbers.sort((a, b) => a - b).join(', ')}</p>
                          <p><strong>Ajankohta:</strong> {previousGame.timestamp}</p>
                          <p><strong>Hinta:</strong> {previousGame.cost}</p>
                          {previousGame.winnings > 0 && (
                            <p><strong>Voitot:</strong> {previousGame.winnings.toLocaleString('fi-FI', { style: 'currency', currency: 'EUR' })}</p>
                          )}
                        </div>
                      </div>

                      <table className="w-100 past-game__table table table-striped">
                        <thead>
                          <tr>
                            <th>Rivi</th>
                            <th>Numerot</th>
                            <th>Osumia</th>
                            <th>Voitto</th>
                          </tr>
                        </thead>
                        <tbody>
                        {rows.map((row, index) => (
                          <tr className="past-game__row" key={row.key}>
                            <td><small className="mx-2 past-game__index">{index + 1}.</small></td>

                            <td>
                              <div className="selected-row">
                                <div className="d-flex flex-row align-items-center">
                                  <SelectedNumbers
                                    selectedNumbers={row.numbers}
                                    winningNumbers={winningNumbers}
                                    handleResetRow={() => {}}
                                    showResetButton={false}
                                    winningNumbersHistory={previousGame.winningNumbers.sort((a, b) => a - b).join(', ')}
                                  />
                                </div>
                              </div>
                            </td>

                            <td>
                              {row.numbers.length}
                            </td>

                            <td>
                              {roundCompleted &&
                                calculateWinnings(calculateMatchedNumbers(row.numbers, winningNumbers)) > 0 && (
                                  <p>
                                    {calculateWinnings(calculateMatchedNumbers(row.numbers, winningNumbers)).toLocaleString(
                                      'fi-FI',
                                      { style: 'currency', currency: 'EUR' }
                                    )}
                                  </p>
                                )}
                            </td>
                          </tr>
                          ))}
                        </tbody>
                      </table>
                    </Accordion.Body>
                  </div>
                </Accordion.Item>
              ))}
            </Accordion>
          )}
        </div>
      </div>
    </div>
  );
}

export default Lottery;