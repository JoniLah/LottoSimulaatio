import { createContext, useState } from 'react';
import { generateWinningNumbersDynamic } from '../utils';

const EurojackpotContext = createContext();

function EurojackpotProvider({ children }) {
    const [winningMainNumbers, setWinningMainNumbers] = useState([]);
    const [winningExtraNumbers, setWinningExtraNumbers] = useState([]);
    const [winningNumbersGenerated, setWinningNumbersGenerated] = useState(false);
    const winningPrizes = [9.60, 10, 17.30, 18.90, 19.20, 100.20, 112.50, 272.60, 3411.80, 124104.50, 2398356.60, 120000000];
    const [rowPrice, setRowPrice] = useState(2);
    const mainNumbers = 5;
    const extraNumbers = 2;
    const totalMainNumbers = 50;
    const totalExtraNumbers = 12;
    const extraNumbersSelectable = true;
    const [gameAnimations, setGameAnimations] = useState(true);
    const [winning5_2, setWinning5_2] = useState(winningPrizes[11]);
    const [winning5_1, setWinning5_1] = useState(winningPrizes[10]);
    const [winning5_0, setWinning5_0] = useState(winningPrizes[9]);
    const [winning4_2, setWinning4_2] = useState(winningPrizes[8]);
    const [winning4_1, setWinning4_1] = useState(winningPrizes[7]);
    const [winning3_2, setWinning3_2] = useState(winningPrizes[6]);
    const [winning4_0, setWinning4_0] = useState(winningPrizes[5]);
    const [winning2_2, setWinning2_2] = useState(winningPrizes[4]);
    const [winning3_1, setWinning3_1] = useState(winningPrizes[3]);
    const [winning3_0, setWinning3_0] = useState(winningPrizes[2]);
    const [winning1_2, setWinning1_2] = useState(winningPrizes[1]);
    const [winning2_1, setWinning2_1] = useState(winningPrizes[0]);

    const getWinningNumbers = () => {
        const { newWinningMainNumbers, newWinningExtraNumbers } = generateWinningNumbersDynamic(Math.random() * 1000, mainNumbers, totalMainNumbers, extraNumbers, totalExtraNumbers);
        const sortedWinningMainNumbers = newWinningMainNumbers.sort((a, b) => a - b);
        const sortedWinningExtraNumbers = newWinningExtraNumbers.sort((a, b) => a - b);
        
        setWinningMainNumbers(sortedWinningMainNumbers);
        setWinningExtraNumbers(sortedWinningExtraNumbers);
        setWinningNumbersGenerated(true);
    };

    const winningNumberDetails = {
        winningMainNumbers,
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
        winning5_2, setWinning5_2,
        winning5_1, setWinning5_1,
        winning5_0, setWinning5_0,
        winning4_2, setWinning4_2,
        winning4_1, setWinning4_1,
        winning3_2, setWinning3_2,
        winning4_0, setWinning4_0,
        winning2_2, setWinning2_2,
        winning3_1, setWinning3_1,
        winning3_0, setWinning3_0,
        winning1_2, setWinning1_2,
        winning2_1, setWinning2_1,
    };

    return <EurojackpotContext.Provider value={winningNumberDetails}>{children}</EurojackpotContext.Provider>;
}

export { EurojackpotProvider };
export default EurojackpotContext;