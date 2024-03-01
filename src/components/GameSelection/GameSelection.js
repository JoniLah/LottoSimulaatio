import React from 'react';
import './GameSelection.css';
import { Link } from 'react-router-dom';

function GameSelection({ onSelectGame }) {

  const handleGameCardClick = (game) => {
    onSelectGame(game);
  };

  return (
    <div className="d-flex justify-content-center align-items-center flex-column vh-100 game-selection-container">
    <h1 className="game-selection-title">Valitse peli</h1>
      <div className="d-flex my-4">
        <div className="mx-2">
          <Link to="/lottery">
            <div className="game-card lottery" onClick={() => handleGameCardClick('lottery')}>
              Lotto
            </div>
          </Link>
        </div>
        <div className="mx-2">
          <Link to="/eurojackpot">
            <div className="game-card eurojackpot" onClick={() => handleGameCardClick('eurojackpot')}>
              Eurojackpot
            </div>
          </Link>
        </div>
        <div className="mx-2">
          <Link to="/all-or-nothing">
            <div className="game-card all-or-nothing" onClick={() => handleGameCardClick('all-or-nothing')}>
              Kaikki tai ei mitään
            </div>
          </Link>
        </div>
        <div className="mx-2">
          <Link to="/keno">
            <div className="game-card keno" onClick={() => handleGameCardClick('keno')}>
              Keno
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default GameSelection;