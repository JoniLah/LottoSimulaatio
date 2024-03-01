import { useState, useEffect, useContext } from 'react';
import LotteryContext from '../../../context/LotteryContext';
import NumberPicker from '../../NumberPicker/NumberPicker';
import SelectedNumbers from '../../SelectedNumbers/SelectedNumbers';
import WinningNumbers from '../../WinningNumbers/WinningNumbers';
import GameHistory from './components/GameHistory';
import GameSettings from './components/GameSettings';
import GameInfo from './components/GameInfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import './Lottery.css';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { handleAddRow, handleResetRow, handleDeleteRow, clearAllSelectedRows, pickRandomRows } from '../../../utils/rowsUtils';
import { savePreviousRoundDetails, startRound, resetRound, handleNewRound } from '../../../utils/gameUtils';

function Lottery({ balance, setBalance }) {
  const { 
    winningPrizes,
    getWinningNumbers,
    winningNumbers,
    winningExtraNumbers,
    rowPrice,
    mainNumbers,
    extraNumbers,
    totalMainNumbers,
    totalExtraNumbers,
    extraNumbersSelectable
  } = useContext(LotteryContext);
  
  const [winningNumbersDrawn, setWinningNumbersDrawn] = useState(false);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [selectedExtraNumbers, setSelectedExtraNumbers] = useState([]);
  const [rows, setRows] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [currentTotalCost, setCurrentTotalCost] = useState(0);
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
  const [winningNumbersHistory, setWinningNumbersHistory] = useState([]);
  const [winningExtraNumbersHistory, setWinningExtraNumbersHistory] = useState([]);
  const [roundNumber, setRoundNumber] = useState(0); // Amount of rounds played, used to previousGame array to index old game stats
  const [winningNumberVisibility, setWinningNumberVisibility] = useState(Array(winningNumbers.length).fill(false));
  const [showDetails, setShowDetails] = useState(false);
  const [hideRows, setHideRows] = useState(false);

  useEffect(() => {
    let timeout;

    if (winningNumbersDrawn) {
      winningNumbers.forEach((_, index) => {
        timeout = setTimeout(() => {
          setWinningNumberVisibility((prevVisibility) => {
            const newVisibility = [...prevVisibility];
            newVisibility[index] = true;
            return newVisibility;
          });
        }, (index + 1) * 300);
      });
    }

    return () => {
      clearTimeout(timeout); // Clear the timeout on component unmount or state change
      setWinningNumberVisibility(Array(winningNumbers.length).fill(false)); // Reset animation
    }
  }, [winningNumbersDrawn, winningNumbers]);

  useEffect(() => {
    if (roundCompleted && winningNumbersDrawn) {
      const totalWinnings = calculateTotalWinnings();
      setBalance(prevBalance => prevBalance + totalWinnings);
      savePreviousRoundDetails(
        setPreviousGames,
        setPreviousRoundDetails,
        totalCost,
        roundNumber,
        selectedNumbers,
        winningNumbers,
        winningExtraNumbers,
        calculateTotalWinnings
      );
      resetRound(setWinningNumbersDrawn, setRoundCompleted);
    }
  }, [roundCompleted, winningNumbersDrawn]);

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
    return winningPrizes[matchedNumbersCount];
  };

  const calculateTotalWinnings = () => {
    const totalWinnings = rows.reduce(
      (total, row) => total + calculateWinnings(calculateMatchedNumbers(row.numbers, winningNumbers)),
      0
    );
  
    return totalWinnings;
  };

  // Katso täältä WinningNumbersien setter! Käytä contextia mieluummin
  const handleDrawWinningNumbers = () => {
    if (!winningNumbersDrawn) {
      setWinningNumbersDrawn(true);

      if (!firstRoundCompleted) {
        setFirstRoundCompleted(true);
      }

      const newWinningNumbers = getWinningNumbers(Date.now());
      const newWinningExtraNumbers = getWinningNumbers(Date.now());
      setRoundWinningNumbers(winningNumbers);

      handleNewRound(setRoundNumber, setWinningNumbersHistory, newWinningNumbers, setWinningExtraNumbersHistory, newWinningExtraNumbers);
      
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
        className="random-rows"
        onClick={() => handlePickRandomRowsClick(count)}
      >
        {count === 1 ? (
          `Valitse ${formattedCount} satunnainen rivi`
        ) : (
          `Valitse ${formattedCount} satunnaista riviä`
        )}
      </button>
    );
  };

  const renderWinningNumbers = () => {
    return winningNumbers.map((number, index) => (
      <div
        key={index}
        className={`winning-number number-${number} ${winningNumbersDrawn && winningNumberVisibility[index] ? 'winning-number-active winning-number-falling' : ''}`}
        style={{
          animationDelay: `${300}ms`, // Same initial delay for each number
          transitionDelay: `${(index + 1) * 300}ms`, // Delay before animation starts
          opacity: winningNumbersDrawn && winningNumberVisibility[index] ? 1 : 0, // Control visibility with opacity
        }}
      >
        {number}
      </div>
    ));
  };

  const handleAddRowClick = () => {
    handleAddRow(rows, setRows, rowPrice, selectedNumbers, setSelectedNumbers, selectedExtraNumbers, setSelectedNumbers, totalCost, setTotalCost, setNewRowsSelected, keyCounter, mainNumbers);
  };
  
  const handleResetRowClick = () => {
    handleResetRow(setSelectedNumbers);
  };
  
  const handleDeleteRowClick = (rowIndex) => {
    handleDeleteRow(rows, setRows, rowIndex, setTotalCost);
  };
  
  const handleClearAllRowsClick = () => {
    clearAllSelectedRows(setRows, setTotalCost, setNewRowsSelected);
  };
  
  const handlePickRandomRowsClick = (count) => {
    pickRandomRows(count, setRows, setTotalCost, setKeyCounter, setNewRowsSelected, keyCounter, selectedNumbers,
      mainNumbers, totalMainNumbers, extraNumbers, totalExtraNumbers, extraNumbersSelectable, rowPrice);
  };

  return (
    <div className="container mt-5">
      <div className="row mb-3">
        <Tabs
          defaultActiveKey="lottery"
          transition={false}
          id="noanim-tab-example"
          className="mb-3"
        >
          <Tab eventKey="lottery" title="Lotto">
            {!paymentCompleted && !newRoundAvailable &&
              <div className="row my-3">
                <div className="col-md-12">
                  {renderRandomRowButton(1)}
                  {renderRandomRowButton(10)}
                  {renderRandomRowButton(100)}
                  {renderRandomRowButton(1000)}
                </div>
              </div>
            }

            <div className="row">
              {newRoundAvailable && (
                <div className="col-md-6">
                  <h2>Voittonumerot:</h2>
                  <div className="winning-numbers-animation">
                    {renderWinningNumbers()}
                  </div>
                </div>
              )}

              {paymentCompleted ?
                (
                <div className="col-md-6">
                  <i>Voittonumerot näkyvät tässä, kun numerot on arvottu.</i>
                </div>
                ) : (
                  <>
                  {!newRoundAvailable && (
                    <div className="col-md-6">
                    {selectedNumbers.length < 7 && (
                      <small><strong>Valitse {7 - selectedNumbers.length === 1 ? 'vielä 1 numero' : `${7 - selectedNumbers.length} numeroa`}</strong></small>
                    )}
                    <NumberPicker totalNumbers={totalMainNumbers} selectedNumbers={selectedNumbers} onNumberClick={handleNumberClick} />
                    {selectedNumbers.length > 0 ? (
                      <div className="selected-numbers-live">
                        <SelectedNumbers 
                          selectedNumbers={selectedNumbers}
                          winningNumbers={winningNumbers}
                          handleResetRow={handleResetRowClick}
                          showResetButton={true}
                          onDrawRemainingNumbers={handleDrawRemainingNumbers}
                          winningNumbersHistory={[]}
                        />
                        {selectedNumbers.length >= 7 ? (
                        <button
                          onClick={handleAddRowClick}
                          disabled={selectedNumbers.length !== 7}
                          className="btn btn-warning mt-2"
                        >
                          Lisää rivi
                        </button>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                  )}
                </>
              )}

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
                              winningNumbersDrawn={winningNumbersDrawn}
                            />
                          </div>
                          <div className="winning-info" style={{display: 'flex', alignSelf: 'center', marginTop: '20px'}}>
                            {roundCompleted && calculateWinnings(calculateMatchedNumbers(row.numbers, winningNumbers)) > 0 && (
                              <p><span style={{color: 'green', fontWeight: 'bold'}}>Voitto:</span> {calculateWinnings(calculateMatchedNumbers(row.numbers, winningNumbers)).toLocaleString('fi-FI', { style: 'currency', currency: 'EUR' })}</p>
                            )}
                          </div>
                          {!roundCompleted && !paymentCompleted && !newRoundAvailable && (
                            <span onClick={() => handleDeleteRowClick(index)}><FontAwesomeIcon icon={faTrashCan} /></span>
                          )}
                        </div>
                      ))}
                  </div>
                  {rows.length > 0 && !paymentCompleted && !newRoundAvailable && (
                      <button className="btn btn-secondary mt-3" onClick={handleClearAllRowsClick}>
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
                  <div className="draw-numbers-container">
                    <button className="draw-numbers-button" onClick={handleDrawWinningNumbers}>
                      Arvo numerot
                    </button>
                  </div>
                ) : (
                  newRoundAvailable ? (
                    <button className="btn btn-secondary" onClick={() => startRound(setRoundCompleted, setNewRoundAvailable)}>
                      Uusi kierros
                    </button>
                  ) : (
                    renderPaymentButton()
                  )
                )}
              </div>
            </div>

            <div className="total-winnings">
              {roundCompleted && winningNumbersDrawn && (
                <p>Voitit yhteensä: {calculateTotalWinnings().toLocaleString('fi-FI', { style: 'currency', currency: 'EUR' })}</p>
              )}
            </div>

            {roundNumber > 0 && 
              <div className="winning-numbers-container mt-3">
              {winningNumbers.length > 0 && (
                  <WinningNumbers winningNumbers={winningNumbers} selectedRows={rows} />
                )}
              </div>
            }
            
          </Tab>
          <Tab eventKey="history" title="Pelihistoria">
            {roundNumber > 0 ? (
              <p>Pelihistoriasi</p>
              ) : (
                <div className="d-flex flex-row justify-content-center m-4">
                  <i>Pelaa ainakin yksi kierros, jotta voit nähdä pelihistoriasi.<br /><strong>Huom!</strong> Mikäli päivitit sivun tai vaihdoit peliä, pelihistoriasi häviää!</i>
                </div>
              )
            }

            <div>
              {firstRoundCompleted && (
                <button
                  className="btn btn-secondary mt-2"
                  onClick={() => setAccordionVisible(!accordionVisible)}
                >
                  {accordionVisible ? "Piilota" : "Näytä"} pelitulokset
                </button>
              )}

              {accordionVisible && <GameHistory 
                previousGames={previousGames}
                rows={rows}
                winningNumbers={winningNumbers}
                roundCompleted={roundCompleted}
                calculateWinnings={calculateWinnings}
                calculateMatchedNumbers={calculateMatchedNumbers}
                roundNumber={roundNumber}
              />
              }
            </div>
          </Tab>
          <Tab eventKey="info" title="Tietoa pelistä">
            <GameInfo />
          </Tab>
          <Tab eventKey="settings" title="Peliasetukset">
            <GameSettings />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}

export default Lottery;