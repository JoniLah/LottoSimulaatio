import { useState, useEffect, useContext } from 'react';
import SettingsContext from '../../../context/SettingsContext';
import EurojackpotContext from '../../../context/EurojackpotContext';
import NumberPicker from '../../NumberPicker/NumberPicker';
import SelectedNumbers from '../../SelectedNumbers/SelectedNumbers';
import WinningNumbers from './WinningNumbers';
import GameHistory from '../../GameHistory/GameHistory';
import GameSettings from './components/GameSettings';
// import GameInfo from './components/GameInfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faStar } from '@fortawesome/free-solid-svg-icons';
import './Eurojackpot.css';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { handleAddRow, handleResetRow, handleDeleteRow, clearAllSelectedRows, pickRandomRows } from '../../../utils/rowsUtils';
import { savePreviousRoundDetails, startRound, resetRound, handleNewRound } from '../../../utils/gameUtils';

function Eurojackpot({ balance, setBalance }) {
  const { 
    winningPrizes,
    getWinningNumbers,
    winningMainNumbers,
    winningExtraNumbers,
    rowPrice,
    mainNumbers,
    extraNumbers,
    totalMainNumbers,
    totalExtraNumbers,
    extraNumbersSelectable
  } = useContext(EurojackpotContext);
  const { hideRows, gameAnimations } = useContext(SettingsContext);
  
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
  const [winningNumberVisibility, setWinningNumberVisibility] = useState(Array(winningMainNumbers.length).fill(false));
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    let timeout;

    if (winningNumbersDrawn) {
      winningMainNumbers.forEach((_, index) => {
        timeout = setTimeout(() => {
          setWinningNumberVisibility((prevVisibility) => {
            const newVisibility = [...prevVisibility];
            newVisibility[index] = true;
            return newVisibility;
          });
        }, (index + 1) * 300);
      });

      // Rendering extra numbers
      winningExtraNumbers.forEach((_, index) => {
        timeout = setTimeout(() => {
          setWinningNumberVisibility((prevVisibility) => {
            const newVisibility = [...prevVisibility];
            // Index for extra numbers starts from winningMainNumbers.length
            newVisibility[index + winningMainNumbers.length] = true;
            return newVisibility;
          });
        }, (index + winningMainNumbers.length + 1) * 300); // Start timeout after main numbers
      });
    }

    return () => {
      clearTimeout(timeout); // Clear the timeout on component unmount or state change
      setWinningNumberVisibility(Array(winningMainNumbers.length).fill(false)); // Reset animation
    }
  }, [winningNumbersDrawn, winningMainNumbers]);

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
        winningMainNumbers,
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
    const winningClassPrizes = {
      "5+2": 120000000,
      "5+1": 2398356.60,
      "5+0": 124104.50,
      "4+2": 464.25,
      "4+1": 272.60,
      "3+2": 112.50,
      "4+0": 100.20,
      "2+2": 19.20,
      "3+1": 18.90,
      "3+0": 17.30,
      "1+2": 10,
      "2+1": 9.60
    };
  
    const totalWinnings = rows.reduce((total, row) => {
      const mainMatchCount = calculateMatchedNumbers(row.numbers, winningMainNumbers);
      const extraMatchCount = calculateMatchedNumbers(row.extraNumbers, winningExtraNumbers);
  
      const winningClass = `${mainMatchCount}+${extraMatchCount}`;
  
      return total + (winningClassPrizes[winningClass] || 0);
    }, 0);
  
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
      setRoundWinningNumbers(winningMainNumbers);

      handleNewRound(setRoundNumber, setWinningNumbersHistory, newWinningNumbers, setWinningExtraNumbersHistory, newWinningExtraNumbers);
      
      setPaymentCompleted(false);
      setNewRoundAvailable(true);
    }
  };

  const handleNumberClick = (number, isExtraNumber) => {
    if (!isExtraNumber) {
      if (selectedNumbers.includes(number)) {
        setSelectedNumbers(prevSelected => prevSelected.filter(num => num !== number));
      } else {
        if (selectedNumbers.length < mainNumbers) {
          setSelectedNumbers(prevSelected => [...prevSelected, number]);
        }
      }
    } else {
      if (selectedExtraNumbers.includes(number)) {
        setSelectedExtraNumbers(prevSelected => prevSelected.filter(num => num !== number));
      } else {
        if (selectedExtraNumbers.length < extraNumbers) {
          setSelectedExtraNumbers(prevSelected => [...prevSelected, number]);
        }
      }
    }
  };

  const calculateMatchedNumbers = (selectedNumbers, winningNumbers) => {
    return selectedNumbers.filter(number => winningNumbers.includes(number)).length;
  };

  const handleDrawRemainingNumbers = () => {
    const { remainingMainNumbers, remainingExtraNumbers } = generateRandomNumbers();
    const updatedSelectedMainNumbers = [...selectedNumbers, ...remainingMainNumbers];
    const updatedSelectedExtraNumbers = [...selectedExtraNumbers, ...remainingExtraNumbers];
    setSelectedNumbers(updatedSelectedMainNumbers);
    setSelectedExtraNumbers(updatedSelectedExtraNumbers);
  };

  const generateRandomNumbers = () => {
    const remainingMainNumbers = [];

    while (remainingMainNumbers.length < mainNumbers - selectedNumbers.length) {
      const randomNumber = Math.floor(Math.random() * 40) + 1;
      if (!selectedNumbers.includes(randomNumber) && !remainingMainNumbers.includes(randomNumber)) {
        remainingMainNumbers.push(randomNumber);
      }
    }

    const remainingExtraNumbers = [];
    while (remainingExtraNumbers.length < extraNumbers - selectedExtraNumbers.length) {
      const randomNumber = Math.floor(Math.random() * 40) + 1;
      if (!selectedNumbers.includes(randomNumber) && !remainingExtraNumbers.includes(randomNumber)) {
        remainingExtraNumbers.push(randomNumber);
      }
    }

    return {remainingMainNumbers, remainingExtraNumbers};
  };

  /* RENDERING */
  const renderPaymentButton = () => {
    let cost = currentTotalCost;
    if (rows.length > 0 && (!roundCompleted || (roundCompleted && winningNumbersDrawn))) {
      cost = rows.length * rowPrice;
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
    const allWinningNumbers = [...winningMainNumbers, ...winningExtraNumbers];
    
    return allWinningNumbers.map((number, index) => (
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

  // const renderWinningNumbers = () => {
  //   const allWinningNumbers = [...winningMainNumbers];
  //   // Add FontAwesomeIcon component between main and extra numbers
  //   if (winningExtraNumbers.length > 0) {
  //     allWinningNumbers.push(<FontAwesomeIcon icon={faStar} className="d-flex align-self-center mx-2" />);
  //     winningExtraNumbers.forEach(number => {
  //       allWinningNumbers.push(number);
  //     });
  //   }
  
  //   return allWinningNumbers.map((item, index) => (
  //     <div
  //       key={index}
  //       className={`winning-number ${typeof item === 'number' ? `number-${item}` : ''} ${winningNumbersDrawn && winningNumberVisibility[index] ? 'winning-number-active winning-number-falling' : ''}`}
  //       style={{
  //         animationDelay: `${300}ms`, // Same initial delay for each number
  //         transitionDelay: `${(index + 1) * 300}ms`, // Delay before animation starts
  //         opacity: winningNumbersDrawn && winningNumberVisibility[index] ? 1 : 0, // Control visibility with opacity
  //       }}
  //     >
  //       {typeof item === 'number' ? item : item}
  //     </div>
  //   ));
  // };

  const handleAddRowClick = () => {
    handleAddRow(rows, setRows, rowPrice, selectedNumbers, setSelectedNumbers, selectedExtraNumbers, setSelectedExtraNumbers,
      totalCost, setTotalCost, setNewRowsSelected, keyCounter, mainNumbers);
  };
  
  const handleResetRowClick = () => {
    handleResetRow(setSelectedNumbers, setSelectedExtraNumbers);
  };
  
  const handleDeleteRowClick = (rowIndex) => {
    handleDeleteRow(rows, setRows, rowPrice, rowIndex, setTotalCost);
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
          defaultActiveKey="eurojackpot"
          transition={false}
          id="noanim-tab-example"
          className="mb-3"
        >
          <Tab eventKey="eurojackpot" title="Eurojackpot">
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
                    {(selectedNumbers.length < mainNumbers || selectedExtraNumbers.length < extraNumbers) && (
                      <small><strong>
                        Valitse {mainNumbers - selectedNumbers.length === 1 ? 'vielä 1 päänumero' : (mainNumbers - selectedNumbers.length === 0 ? '' : `${mainNumbers - selectedNumbers.length} päänumeroa`)}
                        {extraNumbers - selectedExtraNumbers.length === 1 ? ` ${mainNumbers - selectedNumbers.length === 0 ? '' : 'ja '} 1 lisänumero` : (extraNumbers - selectedExtraNumbers.length === 0 ? '' : ` ${mainNumbers - selectedNumbers.length === 0 ? '' : 'ja '} ${extraNumbers - selectedExtraNumbers.length} lisänumeroa`)}
                      </strong></small>
                    )}
                    <NumberPicker totalNumbers={totalMainNumbers} selectedNumbers={selectedNumbers} extraNumbers={false} onNumberClick={handleNumberClick} />
                    <hr />
                    <NumberPicker totalNumbers={totalExtraNumbers} selectedNumbers={selectedExtraNumbers} extraNumbers={true} onNumberClick={handleNumberClick} />
                    {selectedNumbers.length > 0 || selectedExtraNumbers.length > 0 ? (
                      <div className="selected-numbers-live">
                        <SelectedNumbers 
                          selectedNumbers={selectedNumbers}
                          winningNumbers={winningMainNumbers}
                          winningExtraNumbers={winningExtraNumbers}
                          selectedExtraNumbers={selectedExtraNumbers}
                          handleResetRow={handleResetRowClick}
                          showResetButton={true}
                          onDrawRemainingNumbers={handleDrawRemainingNumbers}
                          winningNumbersHistory={[]}
                          winningExtraNumbersHistory={[]}
                        />
                        {selectedNumbers.length >= mainNumbers && selectedExtraNumbers.length >= extraNumbers ? (
                        <button
                          onClick={handleAddRowClick}
                          disabled={selectedNumbers.length !== mainNumbers}
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
                    {!hideRows ? (
                      rows.map((row, index) => (
                        <div key={row.key} className="selected-row">
                          <div className="d-flex flex-row align-items-center">
                            <small className="mx-2">{index + 1}.</small>
                            <SelectedNumbers
                              selectedNumbers={row.numbers}
                              selectedExtraNumbers={row.extraNumbers}
                              winningNumbers={winningMainNumbers}
                              winningExtraNumbers={winningExtraNumbers}
                              handleResetRow={() => {}}
                              showResetButton={false}
                              winningNumbersHistory={[]}
                              winningExtraNumbersHistory={[]}
                              winningNumbersDrawn={winningNumbersDrawn}
                            />
                          </div>
                          <div className="winning-info" style={{display: 'flex', alignSelf: 'center', marginTop: '20px'}}>
                            {roundCompleted && calculateWinnings(calculateMatchedNumbers(row.numbers, winningMainNumbers)) > 0 && (
                              <p><span style={{color: 'green', fontWeight: 'bold'}}>Voitto:</span> {calculateWinnings(calculateMatchedNumbers(row.numbers, winningMainNumbers)).toLocaleString('fi-FI', { style: 'currency', currency: 'EUR' })}</p>
                            )}
                          </div>
                          {!roundCompleted && !paymentCompleted && !newRoundAvailable && (
                            <span onClick={() => handleDeleteRowClick(index)}><FontAwesomeIcon icon={faTrashCan} /></span>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="d-flex align-items-center"><i>Rivit on piilotettu. Aseta ne näkyviksi asetuksista.</i></div>
                    )}
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

            {roundNumber > 0 && 
              <div className="winning-numbers-container mt-3">
              {winningMainNumbers.length > 0 && (
                  <WinningNumbers winningNumbers={winningMainNumbers} selectedRows={rows} calculateTotalWinnings={calculateTotalWinnings} />
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

              {accordionVisible && 
              <GameHistory 
                previousGames={previousGames}
                rows={rows}
                winningNumbers={winningMainNumbers}
                winningExtraNumbers={winningExtraNumbers}
                roundCompleted={roundCompleted}
                calculateWinnings={calculateWinnings}
                calculateMatchedNumbers={calculateMatchedNumbers}
                roundNumber={roundNumber}
              />
              }
            </div>
          </Tab>
          <Tab eventKey="info" title="Tietoa pelistä">
            {/* <GameInfo /> */}
          </Tab>
          <Tab eventKey="settings" title="Peliasetukset">
            <GameSettings />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}

export default Eurojackpot;