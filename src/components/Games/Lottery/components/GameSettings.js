import React, { useContext } from 'react';
import LotteryContext from '../../../../context/LotteryContext';
import GlobalSettings from '../../../GlobalSettings/GlobalSettings';

const GameSettings = () => {
    const { winningPrizes, rowPrice, setRowPrice } = useContext(LotteryContext);

    return (
        <div>
            <div>
                <h2>Pelikohtaiset asetukset</h2>
                <h3>Muuta rivin hintaa</h3>
                <p>Yhden rivin hinta: {rowPrice.toLocaleString('fi-FI', { style: 'currency', currency: 'EUR' })}</p>
            </div>

            <div>
                <h3>Muuta voitonjakoa</h3>
                <ul>
                    <li>7 oikein: {winningPrizes[7].toLocaleString("fi-FI")}</li>
                    <li>6 oikein: {winningPrizes[6].toLocaleString("fi-FI")}</li>
                    <li>5 oikein: {winningPrizes[5].toLocaleString("fi-FI")}</li>
                    <li>4 oikein: {winningPrizes[4].toLocaleString("fi-FI")}</li>
                    <li>3 oikein: {winningPrizes[3].toLocaleString("fi-FI")}</li>
                    <li>2 oikein: {winningPrizes[2].toLocaleString("fi-FI")}</li>
                    <li>1 oikein: {winningPrizes[1].toLocaleString("fi-FI")}</li>
                </ul>
            </div>
            <hr />
            <GlobalSettings />
        </div>
    );
}

export default GameSettings;