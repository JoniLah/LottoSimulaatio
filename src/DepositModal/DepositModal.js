import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const DepositModal = ({ show, onClose, onDeposit }) => {
  const [depositAmount, setDepositAmount] = useState(0);

  const handleDeposit = () => {
    onDeposit(depositAmount);
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Talleta rahaa</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Talletussumma (€)</Form.Label>
          <Form.Control
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Sulje
        </Button>
        <Button variant="primary" onClick={handleDeposit}>
          Talleta
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DepositModal;