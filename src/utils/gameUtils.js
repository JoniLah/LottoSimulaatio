export const savePreviousRoundDetails = (
    setPreviousGames,
    setPreviousRoundDetails,
    totalCost,
    roundNumber,
    selectedNumbers,
    winningNumbers,
    winningExtraNumbers,
    calculateTotalWinnings
    ) => {
    const timestamp = new Date().toLocaleString('fi-FI');
    const cost = totalCost.toLocaleString('fi-FI', { style: 'currency', currency: 'EUR' });
    const round = roundNumber;
    const winnings = calculateTotalWinnings();
    const date = new Date().toLocaleDateString('fi-FI');
    const roundWinningNumbersCopy = [...winningNumbers];
    const roundWinningExtraNumbersCopy = [...winningExtraNumbers];

    const roundDetails = {
        timestamp,
        roundNumber: round,
        selectedNumbers,
        winningNumbers: roundWinningNumbersCopy,
        winningExtraNumbers: roundWinningExtraNumbersCopy,
        cost,
        winnings,
        date
    };

    setPreviousGames(prevGames => [...prevGames, roundDetails]);
    setPreviousRoundDetails(roundDetails);
};

export const startRound = (setRoundCompleted, setNewRoundAvailable) => {
    setRoundCompleted(true);
    setNewRoundAvailable(false);
  
    setTimeout(() => {
        const winningNumberElements = document.querySelectorAll('.winning-number');
        winningNumberElements.forEach((element) => {
            element.classList.add('winning-number-active');
        });
    }, 100);
};

export const resetRound = (setWinningNumbersDrawn, setRoundCompleted) => {
    setWinningNumbersDrawn(false);
    setRoundCompleted(false);
};

export const handleNewRound = (setRoundNumber, setWinningNumbersHistory, newWinningNumbers, setWinningExtraNumbersHistory, newWinningExtraNumbers) => {
    setRoundNumber((prevRound) => prevRound +1);
    setWinningNumbersHistory((prevHistory) => [...prevHistory, newWinningNumbers]);
    setWinningExtraNumbersHistory((prevExtraHistory) => [...prevExtraHistory, newWinningExtraNumbers]);
};