import { createContext, useState } from 'react';
import { generateWinningNumbers } from '../utils';

const LotteryContext = createContext();

function LotteryProvider({ children }) {
    const [winningNumbers, setWinningNumbers] = useState([]);
    const [winningNumbersGenerated, setWinningNumbersGenerated] = useState(false);
    const winningPrizes = [0, 0, 0, 0, 10, 79.75, 3628.14, 13000000];

    const getWinningNumbers = () => {
        const newWinningNumbers = generateWinningNumbers().sort((a, b) => a - b);
        setWinningNumbers(newWinningNumbers);
        setWinningNumbersGenerated(true);
    };

    const winningNumberDetails = {
        winningNumbers,
        winningNumbersGenerated,
        getWinningNumbers,
        winningPrizes
    };

    return <LotteryContext.Provider value={winningNumberDetails}>{children}</LotteryContext.Provider>;
}

export { LotteryProvider };
export default LotteryContext;