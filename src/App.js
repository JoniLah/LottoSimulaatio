import React, { useState } from 'react';
import './App.css';
import NumberPicker from './NumberPicker/NumberPicker';
import SelectedNumbers from './SelectedNumbers/SelectedNumbers';
import WinningNumbers from './WinningNumbers/WinningNumbers';
import { generateWinningNumbers } from './utils'; // Import from the utils file
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [rows, setRows] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [keyCounter, setKeyCounter] = useState(0);
  const [balance, setBalance] = useState(50000);
  const [winningNumbers, setWinningNumbers] = useState([]); // State to store winning numbers
  const [roundCompleted, setRoundCompleted] = useState(false);

  const handlePayment = () => {
    if (totalCost <= balance) {
      if (winningNumbers.length === 0) {
        const newWinningNumbers = generateWinningNumbers().sort((a, b) => a - b);
        console.log("newWinningNumbers: " + newWinningNumbers);
        setWinningNumbers(newWinningNumbers);
      }
      setRoundCompleted(true); // Mark the round as completed
  
      setBalance(prevBalance => prevBalance - totalCost);
    } else {
      alert('Ei riittävästi saldoa.');
    }
  };

  const handleNewRound = () => {
    // Reset states for a new round
    setSelectedNumbers([]);
    setRows([]);
    setTotalCost(0);
    setWinningNumbers([]);
    setRoundCompleted(false);
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
      setRows(prevRows => [
        ...prevRows,
        { key: newRowKey, numbers: selectedNumbers },
      ]);
      setTotalCost(prevCost => prevCost + 1);
      setSelectedNumbers([]);
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
      setRows(prevRows => [
        ...prevRows,
        { key: newRowKey, numbers: randomNumbers },
      ]);
      setTotalCost(prevCost => prevCost + 1);
    }
    setKeyCounter(prevKeyCounter => prevKeyCounter + count);
  };

  const handleDeleteRow = (rowIndex) => {
    const updatedRows = rows.filter((_, index) => index !== rowIndex);
    setRows(updatedRows);
    setTotalCost(prevCost => prevCost - 1);
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
          <div className="selected-numbers-live">
            <SelectedNumbers selectedNumbers={selectedNumbers} winningNumbers={winningNumbers} />
            <button
              onClick={handleAddRow}
              disabled={selectedNumbers.length !== 7}
            >
              Lisää rivi
            </button>
          </div>
        </div>
        <div className="col-md-6 selected-container">
          {rows.map((row, index) => (
            <div key={row.key} className="selected-row">
              <SelectedNumbers
                selectedNumbers={row.numbers}
                winningNumbers={winningNumbers} // Passing winningNumbers prop here
              />
              <button onClick={() => handleDeleteRow(index)}>Poista</button>
            </div>
          ))}
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-md-12">
          <button className="btn btn-success" onClick={handlePayment}>
            Maksa {totalCost.toLocaleString('fi-FI', { style: 'currency', currency: 'EUR' })}
          </button>
          {roundCompleted && (
            <button className="btn btn-primary ml-2" onClick={handleNewRound}>
              Uusi kierros
            </button>
          )}
        </div>
      </div>

      <div>
        {winningNumbers.length > 0 && (
          <WinningNumbers winningNumbers={winningNumbers} selectedRows={rows} />
        )}
      </div>
    </div>
  );
}

export default App;