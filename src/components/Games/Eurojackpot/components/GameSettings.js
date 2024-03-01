import React, { useContext, useState } from 'react';
import EurojackpotContext from '../../../../context/EurojackpotContext';
import GlobalSettings from '../../../GlobalSettings/GlobalSettings';

const GameSettings = () => {
    const { winningPrizes, rowPrice, setRowPrice,
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
        winning2_1, setWinning2_1 } = useContext(EurojackpotContext);

    return (
        <div>
            <div>
                <h2>Pelikohtaiset asetukset</h2>
                <h3>Muuta rivin hintaa</h3>
                <p>Yhden rivin hinta: <input type="number" name="win-5+2" value={rowPrice} onChange={(event) => setRowPrice(event.target.value)} />€</p>
            </div>

            <div>
                <h3>Muuta voitonjakoa</h3>
                <ul>
                    <li>5+2 oikein: <input type="number" name="win-5+2" value={winning5_2} onChange={(event) => setWinning5_2(event.target.value)} />€</li>

                    <li>5+1 oikein: <input type="number" name="win-5+2" value={winning5_1} onChange={(event) => setWinning5_1(event.target.value)} />€</li>

                    <li>5+0 oikein: <input type="number" name="win-5+2" value={winning5_0} onChange={(event) => setWinning5_0(event.target.value)} />€</li>

                    <li>4+2 oikein: <input type="number" name="win-5+2" value={winning4_2} onChange={(event) => setWinning4_2(event.target.value)} />€</li>

                    <li>4+1 oikein: <input type="number" name="win-5+2" value={winning4_1} onChange={(event) => setWinning4_1(event.target.value)} />€</li>

                    <li>3+2 oikein: <input type="number" name="win-5+2" value={winning3_2} onChange={(event) => setWinning3_2(event.target.value)} />€</li>

                    <li>4+0 oikein: <input type="number" name="win-5+2" value={winning4_0} onChange={(event) => setWinning4_0(event.target.value)} />€</li>

                    <li>2+2 oikein: <input type="number" name="win-5+2" value={winning2_2} onChange={(event) => setWinning2_2(event.target.value)} />€</li>

                    <li>3+1 oikein: <input type="number" name="win-5+2" value={winning3_1} onChange={(event) => setWinning3_1(event.target.value)} />€</li>

                    <li>3+0 oikein: <input type="number" name="win-5+2" value={winning3_0} onChange={(event) => setWinning3_0(event.target.value)} />€</li>

                    <li>1+2 oikein: <input type="number" name="win-5+2" value={winning1_2} onChange={(event) => setWinning1_2(event.target.value)} />€</li>

                    <li>2+1 oikein: <input type="number" name="win-5+2" value={winning2_1} onChange={(event) => setWinning2_1(event.target.value)} />€</li>
                </ul>
            </div>
            <hr />
            <GlobalSettings />
        </div>
    );
}

export default GameSettings;