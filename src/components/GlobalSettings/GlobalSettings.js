import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import SettingsContext from '../../context/SettingsContext';

const GlobalSettings = () => {
    const { gameAnimations, setGameAnimations, hideRows, setHideRows } = useContext(SettingsContext);
    
    return (
        <div>
            <h2>Yleiset asetukset</h2>
            <h3>Grafiikka</h3>
            <div className="form-item">
                <input type="checkbox" name="winning-animation" checked={gameAnimations} onChange={() => setGameAnimations(!gameAnimations)}/> Pelianimaatiot
            </div>

            <div className="form-item">
                <input type="checkbox" name="render-rows" checked={!hideRows} onChange={() => setHideRows(!hideRows)}/> Renderöi rivit <FontAwesomeIcon icon={faCircleInfo} title="Piilottaa valitut rivit, joka mahdollistaa paremman suorituskyvyn" />
            </div>
        </div>
    );
}

export default GlobalSettings;