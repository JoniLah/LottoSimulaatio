import React from 'react';
import './Header.css';
import DepositModal from '../DepositModal/DepositModal';
import { Link, useLocation } from 'react-router-dom';

function Header({ balance, onToggleDepositModal, showDeposit, handleDeposit }) {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  return (
    <div className="header">
      <div className="top-menu">
        <h1><Link to="/">Arvaus</Link></h1>
        <div className="d-flex flex-row">
          <div className="balance-button-container mx-4 d-flex align-items-center">
            <button className="add-cash" onClick={onToggleDepositModal}>Lisää saldoa</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
            <p>Saldo:</p>
            <h5>{balance.toLocaleString('fi-FI', { style: 'currency', currency: 'EUR' })}</h5>
          </div>
        </div>
        {showDeposit && <DepositModal show={showDeposit} onClose={onToggleDepositModal} onDeposit={handleDeposit} />}
      </div>

      <div className="sub-menu">
        <div className="menu-links">
          <Link to="/lottery" className={isActive('/lottery') ? 'current' : ''}>Lotto</Link>
          <Link to="/eurojackpot" className={isActive('/eurojackpot') ? 'current' : ''}>Eurojackpot</Link>
          <Link to="/all-or-nothing" className={isActive('/all-or-nothing') ? 'current' : ''}>Kaikki tai ei mitään</Link>
          <Link to="/keno" className={isActive('/keno') ? 'current' : ''}>Keno</Link>
        </div>
      </div>
    </div>
  );
}

export default Header;