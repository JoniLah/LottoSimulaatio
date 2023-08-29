import React from 'react';
import './Header.css';
import DepositModal from '../DepositModal/DepositModal'; // Import DepositModal component
import { Link } from 'react-router-dom';

function Header({ balance, onToggleDepositModal, showDeposit, handleDeposit }) {
  return (
    <div className="header">
        <h1><Link to="/">LottoSimulaatio</Link></h1>
        <div className="d-flex flex-row">
            <div className="balance-button-container mx-4 d-flex align-items-center">
                <button className="btn btn-primary" onClick={onToggleDepositModal}>Lisää saldoa</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
                <p>Saldo:</p>
                <h5>{balance.toLocaleString('fi-FI', { style: 'currency', currency: 'EUR' })}</h5>
            </div>
        </div>
        {showDeposit && <DepositModal show={showDeposit} onClose={onToggleDepositModal} onDeposit={handleDeposit} />}
    </div>
  );
}

export default Header;