import React from 'react';

const Rows = ({
    rows,
    setRows,
    selectedNumbers,
    setCurrentTotalCost,
    setTotalCost,
    setSelectedNumbers,
    setNewRowsSelected,
    keyCounter,
    setKeyCounter,
  }) => {
    const handleAddRow = () => {
      if (selectedNumbers.length === 7) {
        const newRowKey = `row_${performance.now()}`;
        setRows((prevRows) => [
          ...prevRows,
          { key: newRowKey, numbers: selectedNumbers },
        ]);
        setCurrentTotalCost((prevCost) => prevCost + 1);
        setSelectedNumbers([]);
        setNewRowsSelected(true);
      }
    };
  
    const handleResetRow = () => {
      setSelectedNumbers([]);
    };
  
    const handleDeleteRow = (rowIndex) => {
      const updatedRows = rows.filter((_, index) => index !== rowIndex);
      setRows(updatedRows);
      setTotalCost((prevCost) => prevCost - 1);
    };
  
    const clearAllSelectedRows = () => {
      setRows([]);
      setTotalCost(0);
      setNewRowsSelected(false);
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
        setRows((prevRows) => [
          ...prevRows,
          { key: newRowKey, numbers: randomNumbers },
        ]);
        setTotalCost((prevCost) => prevCost + 1);
      }
      setKeyCounter((prevKeyCounter) => prevKeyCounter + count);
      setNewRowsSelected(true);
    };
  
    return (
      <div>
        {/* Render any additional components or UI related to rows here */}
      </div>
    );
  };
  
  export default Rows;