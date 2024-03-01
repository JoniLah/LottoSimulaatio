import { createContext, useState } from 'react';
import { generateWinningNumbers } from '../utils';

const LotteryContext = createContext();

function LotteryProvider({ children }) {
    const [winningNumbers, setWinningNumbers] = useState([]);
    const [winningExtraNumbers, setWinningExtraNumbers] = useState([]);
    const [winningNumbersGenerated, setWinningNumbersGenerated] = useState(false);
    const winningPrizes = [0, 0, 0, 0, 10, 79.75, 3628.14, 13000000];
    const [rowPrice, setRowPrice] = useState(1);
    const mainNumbers = 7;
    const extraNumbers = 1;
    const totalMainNumbers = 40;
    const totalExtraNumbers = 0;
    const extraNumbersSelectable = false;
    const [gameAnimations, setGameAnimations] = useState(true);
    const [hideRows, setHideRows] = useState(false);

    const getWinningNumbers = () => {
        const newWinningNumbers = generateWinningNumbers().sort((a, b) => a - b);
        setWinningNumbers(newWinningNumbers);
        setWinningNumbersGenerated(true);
    };

    const winningNumberDetails = {
        winningNumbers,
        winningExtraNumbers,
        winningNumbersGenerated,
        getWinningNumbers,
        winningPrizes,
        rowPrice,
        setRowPrice,
        mainNumbers,
        extraNumbers,
        totalMainNumbers,
        totalExtraNumbers,
        extraNumbersSelectable,
        gameAnimations,
        setGameAnimations,
        hideRows,
        setHideRows
    };

    return <LotteryContext.Provider value={winningNumberDetails}>{children}</LotteryContext.Provider>;
}

export { LotteryProvider };
export default LotteryContext;