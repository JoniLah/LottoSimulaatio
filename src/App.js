import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap";
import DepositModal from './DepositModal/DepositModal';
import GameSelection from './GameSelection/GameSelection';
import Lottery from './Games/Lottery/Lottery';
import Eurojackpot from './Games/Eurojackpot/Eurojackpot';
import AllOrNothing from './Games/AllOrNothing/AllOrNothing';
import Keno from './Games/Keno/Keno';
import Header from './Header/Header';
import WebFont from 'webfontloader';
import { LotteryProvider } from './context/LotteryContext';

function App() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [balance, setBalance] = useState(0);
  const [showDeposit, setShowDeposit] = useState(true);
  const [depositModalClosed, setDepositModalClosed] = useState(false);

  const handleSelectGame = (game) => {
    setSelectedGame(game);
  };

  const closeDepositModal = () => {
    setShowDeposit(false);
    setDepositModalClosed(true);
  };

  const handleDeposit = (amount) => {
    setBalance((prevBalance) => prevBalance + parseFloat(amount));
    setShowDeposit(false);
    setDepositModalClosed(true);
  };

  const toggleDepositModal = () => {
    if (showDeposit) {
      setShowDeposit(false);
    } else {
      setShowDeposit(true);
    }
  };

  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Open Sans', 'Kanit:400,700', 'Valera Round:300,400,700']
      }
    });
  }, []);

  return (
    <Router>
      <div className="wrapper">
        <Header balance={balance} onToggleDepositModal={toggleDepositModal} showDeposit={showDeposit} handleDeposit={handleDeposit} />
          <Routes>
            <Route exact path="/" element={<GameSelection onSelectGame={handleSelectGame} />} />
            <Route exact path="/lottery" element={
              <LotteryProvider>
                <Lottery balance={balance} setBalance={setBalance} />
              </LotteryProvider>
            } />
            <Route path="/eurojackpot" element={<Eurojackpot balance={balance} setBalance={setBalance} />} />
            <Route path="/all-or-nothing" element={<AllOrNothing balance={balance} setBalance={setBalance} />} />
            <Route path="/keno" element={<Keno balance={balance} setBalance={setBalance} />} />
          </Routes>
        
        <DepositModal 
          show={showDeposit && !depositModalClosed}
          onClose={closeDepositModal}
          onDeposit={handleDeposit} 
        />
      </div>
    </Router>
  );
}

export default App;