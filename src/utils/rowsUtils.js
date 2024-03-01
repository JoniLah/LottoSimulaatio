export const handleAddRow = (rows, setRows, rowPrice, selectedNumbers, setSelectedNumbers, selectedExtraNumbers, setSelectedExtraNumbers, totalCost, setTotalCost, setNewRowsSelected, keyCounter, mainNumbers, extraNumbers) => {
    if (extraNumbers === 0) {
        if (selectedNumbers.length === mainNumbers) {
            const newRowKey = `row_${performance.now()}`;
            setRows((prevRows) => [
                ...prevRows,
                { key: newRowKey, numbers: selectedNumbers, extraNumbers: [] },
            ]);
            setTotalCost((prevCost) => prevCost + rowPrice);
            setSelectedNumbers([]);
            setNewRowsSelected(true);
        }
    } else {
        const newRowKey = `row_${performance.now()}`;
        setRows((prevRows) => [
            ...prevRows,
            { key: newRowKey, numbers: selectedNumbers, extraNumbers: selectedExtraNumbers },
        ]);
        setTotalCost((prevCost) => prevCost + rowPrice);
        setSelectedNumbers([]);
        setSelectedExtraNumbers([]);
        setNewRowsSelected(true);
    }
};

export const handleResetRow = (setSelectedNumbers, setSelectedExtraNumbers) => {
    setSelectedNumbers([]);
    setSelectedExtraNumbers([]);
};

export const handleDeleteRow = (rows, setRows, rowPrice, rowIndex, setTotalCost) => {
    const updatedRows = rows.filter((_, index) => index !== rowIndex);
    setRows(updatedRows);
    setTotalCost(prevCost => prevCost - rowPrice);
};

export const clearAllSelectedRows = (setRows, setTotalCost, setNewRowsSelected) => {
    setRows([]);
    setTotalCost(0);
    setNewRowsSelected(false);
};

export const pickRandomRows = (
    count,
    setRows,
    setTotalCost,
    setKeyCounter,
    setNewRowsSelected,
    keyCounter,
    selectedNumbers,
    mainNumbers,
    totalMainNumbers,
    extraNumbers,
    totalExtraNumbers,
    extraNumbersSelectable,
    rowPrice
    ) => {
    for (let i = 0; i < count; i++) {
        const randomNumbers = [];
        const randomExtraNumbers = [];
        while (randomNumbers.length < mainNumbers) {
            const randomNumber = Math.floor(Math.random() * totalMainNumbers) + 1;
            if (!randomNumbers.includes(randomNumber)) {
                randomNumbers.push(randomNumber);
            }
        }

        if (extraNumbersSelectable) {
            for (let j = 0; j < count; j++) {
                while (randomExtraNumbers.length < extraNumbers) {
                    const randomExtraNumber = Math.floor(Math.random() * totalExtraNumbers) + 1;
                    if (!randomExtraNumbers.includes(randomExtraNumber)) {
                        randomExtraNumbers.push(randomExtraNumber);
                    }
                }
            }
        }

        const newRowKey = `row_${performance.now()}_${keyCounter + i}`;
        setRows((prevRows) => [
            ...prevRows,
            { key: newRowKey, numbers: randomNumbers, extraNumbers: randomExtraNumbers },
        ]);
        setTotalCost((prevCost) => prevCost + rowPrice);
    }

    setKeyCounter((prevKeyCounter) => prevKeyCounter + count);
    setNewRowsSelected(true);
};