import React from 'react';
import './GameSelection.css';

function GameSelection({ onSelectGame }) {
  return (
    <div className="d-flex justify-content-center align-items-center flex-column vh-100 game-selection-container">
    <h1 className="game-selection-title">Valitse peli</h1>
      <div className="d-flex my-4">
        <div className="mx-2">
          <div className="game-card lottery" onClick={() => onSelectGame('lottery')}>
            Lotto
          </div>
        </div>
        <div className="mx-2">
          <div className="game-card eurojackpot" onClick={() => onSelectGame('eurojackpot')}>
            Eurojackpot
          </div>
        </div>
        <div className="mx-2">
          <div className="game-card all-or-nothing" onClick={() => onSelectGame('all-or-nothing')}>
            Kaikki tai ei mitään
          </div>
        </div>
        <div className="mx-2">
          <div className="game-card keno" onClick={() => onSelectGame('keno')}>
            Keno
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameSelection;