import { createContext, useState } from 'react';

const SettingsContext = createContext();

function SettingsProvider({ children }) {
    const [gameAnimations, setGameAnimations] = useState(true);
    const [hideRows, setHideRows] = useState(false);

    const settingsDetails = {
        gameAnimations,
        setGameAnimations,
        hideRows,
        setHideRows
    };

    return <SettingsContext.Provider value={settingsDetails}>{children}</SettingsContext.Provider>;
}

export { SettingsProvider };
export default SettingsContext;