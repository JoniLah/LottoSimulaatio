import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import DepositModal from './DepositModal/DepositModal';
import GameSelection from './GameSelection/GameSelection';
import Lottery from './Games/Lottery/Lottery';
import Eurojackpot from './Games/Eurojackpot/Eurojackpot';
import AllOrNothing from './Games/AllOrNothing/AllOrNothing';
import WebFont from 'webfontloader';

function App() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [balance, setBalance] = useState(0);
  const [showDeposit, setShowDeposit] = useState(false);
  const [depositModalClosed, setDepositModalClosed] = useState(false);

  const handleSelectGame = (game) => {
    setSelectedGame(game);
    setShowDeposit(true);
  };

  const showDepositModal = () => {
    setShowDeposit(true);
  };

  const closeDepositModal = () => {
    setShowDeposit(false);
    setDepositModalClosed(true); // Set modal state to closed
  };

  const handleDeposit = (amount) => {
    setBalance(parseFloat(amount));
    setShowDeposit(false);
    setDepositModalClosed(true); // Set modal state to closed
  };

  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Open Sans', 'Kanit:400,700', 'Valera Round:300,400,700']
      }
    });
  }, []);

  return (
    <div className="wrapper">
      {selectedGame === null ? (
        <GameSelection onSelectGame={handleSelectGame} />
      ) : selectedGame === 'lottery' ? (
        <>
          {balance === 0 && !depositModalClosed ? (
            <DepositModal
              show={showDeposit}
              onClose={closeDepositModal}
              onDeposit={handleDeposit}
            />
          ) : (
            <Lottery
              balance={balance}
              setBalance={setBalance}
            />
          )}
        </>
      ) : selectedGame === 'eurojackpot' ? (
        <Eurojackpot
          // Pass props to Eurojackpot component
        />
      ) : selectedGame === 'all-or-nothing' ? (
        <AllOrNothing
          // Pass props to Eurojackpot component
        />
      ) : null}
    </div>
  );
}

export default App;
